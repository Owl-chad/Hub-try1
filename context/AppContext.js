import React, { createContext, useState, useCallback, useMemo } from 'react';
import { PostStatus } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_TEAM_RAIC, TEAM_ROLES_ENTITIES, INITIAL_REPORT_RAIC, REPORT_ENTITIES, INITIAL_GANTT_TASKS, INITIAL_NOTIFICATIONS, INITIAL_CONVERSATIONS, INITIAL_ANALYSIS_STATE } from '../constants';
import { INITIAL_ANALYSIS_RAIC_MAP } from '../constants/analysisQuestions';
import { usePersistentState } from '../hooks/usePersistentState';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [users, setUsers] = usePersistentState('users', INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = usePersistentState('currentUserId', INITIAL_USERS[0].id);

  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);
  
  const [posts, setPosts] = usePersistentState('posts', INITIAL_POSTS);
  const [stories, setStories] = usePersistentState('stories', INITIAL_STORIES);
  const [teamRaicMatrix, setTeamRaicMatrix] = usePersistentState('teamRaicMatrix', INITIAL_TEAM_RAIC);
  const [teamRaicEntities, setTeamRaicEntities] = usePersistentState('teamRaicEntities', TEAM_ROLES_ENTITIES);
  const [reportRaicMatrix, setReportRaicMatrix] = usePersistentState('reportRaicMatrix', INITIAL_REPORT_RAIC);
  const [reportRaicEntities, setReportRaicEntities] = usePersistentState('reportRaicEntities', REPORT_ENTITIES);
  const [ganttTasks, setGanttTasks] = usePersistentState('ganttTasks', INITIAL_GANTT_TASKS);
  const [notifications, setNotifications] = usePersistentState('notifications', INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = usePersistentState('conversations', INITIAL_CONVERSATIONS);
  const [analysisState, setAnalysisState] = usePersistentState('analysisState', INITIAL_ANALYSIS_STATE);
  const [analysisRaicMap, setAnalysisRaicMap] = usePersistentState('analysisRaicMap', INITIAL_ANALYSIS_RAIC_MAP);
  
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const addPost = useCallback((postData) => {
    const newPost = {
      ...postData,
      id: `p${Date.now()}`,
      authorId: currentUser.id,
      createdAt: new Date(),
      likes: [],
      comments: [],
      status: PostStatus.InDiscussion,
      analysis: {},
    };
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser, setPosts]);

  const addStory = useCallback((storyData) => {
    const newStory = {
      ...storyData,
      id: `s${Date.now()}`,
      authorId: currentUser.id,
      createdAt: new Date(),
    };
    setStories(prev => [newStory, ...prev]);
  }, [currentUser, setStories]);

  const toggleLike = useCallback((postId) => {
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const newLikes = p.likes.includes(currentUser.id)
            ? p.likes.filter(uid => uid !== currentUser.id)
            : [...p.likes, currentUser.id];
          
          if (newLikes.length > p.likes.length) {
            const postAuthor = users.find(u => u.id === p.authorId);
            if (postAuthor && postAuthor.id !== currentUser.id) {
              const newNotification = {
                id: `n${Date.now()}`,
                recipientId: postAuthor.id,
                actorId: currentUser.id,
                type: 'like',
                postId: p.id,
                read: false,
                createdAt: new Date(),
              };
              setNotifications(prev => [newNotification, ...prev]);
            }
          }
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );
  }, [currentUser, users, setPosts, setNotifications]);

  const addComment = useCallback((postId, text, parentId) => {
    const newComment = {
      id: `c${Date.now()}`,
      authorId: currentUser.id,
      text,
      createdAt: new Date(),
      parentId,
    };
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const newComments = [...p.comments, newComment];
          const notificationsToAdd = [];
          const postAuthor = users.find(u => u.id === p.authorId);

          if (postAuthor && postAuthor.id !== currentUser.id) {
            notificationsToAdd.push({
              id: `n${Date.now()}-post-activity`,
              recipientId: postAuthor.id,
              actorId: currentUser.id,
              type: 'comment',
              postId: p.id,
              commentText: text,
              read: false,
              createdAt: new Date(),
            });
          }
          
          if (parentId) {
              const parentComment = p.comments.find(c => c.id === parentId);
              if (parentComment) {
                  const parentCommentAuthor = users.find(u => u.id === parentComment.authorId);
                  if (parentCommentAuthor && parentCommentAuthor.id !== currentUser.id && parentCommentAuthor.id !== p.authorId) {
                      notificationsToAdd.push({
                          id: `n${Date.now()}-reply`,
                          recipientId: parentCommentAuthor.id,
                          actorId: currentUser.id,
                          type: 'comment_reply',
                          postId: p.id,
                          commentText: text,
                          originalCommentText: parentComment.text,
                          read: false,
                          createdAt: new Date(),
                      });
                  }
              }
          }

          if (notificationsToAdd.length > 0) {
            setNotifications(prev => [...notificationsToAdd, ...prev]);
          }

          return { ...p, comments: newComments };
        }
        return p;
      })
    );
  }, [currentUser, users, setPosts, setNotifications]);
  
  const updateTeamRaic = (entityId, role, value) => {
    setTeamRaicMatrix(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [role]: value,
      },
    }));
  };
  
  const addTeamRaicEntity = (name) => {
      const newEntity = { id: `e${Date.now()}`, name };
      setTeamRaicEntities(prev => [...prev, newEntity]);
      setTeamRaicMatrix(prev => ({ ...prev, [newEntity.id]: {} }));
  };

  const updateGanttTask = (updatedTask) => {
      setGanttTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const addGanttTask = useCallback((taskData) => {
    const newTask = {
        ...taskData,
        id: `t${Date.now()}`,
    };
    setGanttTasks(prev => [...prev, newTask]);
  }, [setGanttTasks]);
  
  const deleteGanttTask = useCallback((taskId) => {
      setGanttTasks(prev => prev.filter(t => t.id !== taskId));
  }, [setGanttTasks]);
  
  const markNotificationsAsRead = () => {
      setNotifications(prev => prev.map(n => ({...n, read: true})));
  };
  
  const sendMessage = useCallback((conversationId, message) => {
    const newMessage = {
      ...message,
      id: `m${Date.now()}`,
      timestamp: new Date(),
    };
    setConversations(prev => {
        const convIndex = prev.findIndex(c => c.id === conversationId);

        if (convIndex > -1) {
            const newConversations = [...prev];
            const updatedConv = {
                ...newConversations[convIndex],
                messages: [...newConversations[convIndex].messages, newMessage],
            };
            newConversations[convIndex] = updatedConv;
            return newConversations;
        } else {
            const newConversation = {
                id: conversationId,
                participantIds: [message.senderId, message.receiverId].filter((value, index, self) => self.indexOf(value) === index),
                messages: [newMessage],
            };
            return [...prev, newConversation];
        }
    });
  }, [setConversations]);

  const updatePostStatus = (postId, status) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, status } : p
      )
    );
  };

  const addOrUpdateAnalysis = (postId, role, analysisText) => {
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const newAnalysis = { ...(p.analysis || {}), [role]: analysisText };
          return { ...p, analysis: newAnalysis };
        }
        return p;
      })
    );
  };
  
  const updatePost = (postId, newTitle, newContent) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, title: newTitle, content: newContent } : p
      )
    );
  };

  const getOrCreateAnalysisState = useCallback((projectId, questionId) => {
    const id = `${projectId}-${questionId}`;
    let stateIndex = analysisState.findIndex(s => s.id === id);
    let newAnalysisState = [...analysisState];

    if (stateIndex === -1) {
        newAnalysisState.push({
            id,
            projectId,
            questionId,
            likes: [],
            comments: [],
        });
        stateIndex = newAnalysisState.length - 1;
    }
    return [newAnalysisState, stateIndex];
  }, [analysisState]);

  const addAnalysisAnswer = useCallback((projectId, questionId, answerText) => {
      const [newAnalysisState, stateIndex] = getOrCreateAnalysisState(projectId, questionId);
      newAnalysisState[stateIndex] = {
          ...newAnalysisState[stateIndex],
          answer: {
              authorId: currentUser.id,
              text: answerText,
              createdAt: new Date(),
          }
      };
      setAnalysisState(newAnalysisState);
  }, [currentUser, getOrCreateAnalysisState, setAnalysisState]);

  const toggleAnalysisLike = useCallback((projectId, questionId) => {
    const [newAnalysisState, stateIndex] = getOrCreateAnalysisState(projectId, questionId);
    const currentState = newAnalysisState[stateIndex];
    const isLiked = currentState.likes.includes(currentUser.id);

    if (isLiked) {
        currentState.likes = currentState.likes.filter(id => id !== currentUser.id);
    } else {
        currentState.likes.push(currentUser.id);
    }
    setAnalysisState(newAnalysisState);
  }, [currentUser, getOrCreateAnalysisState, setAnalysisState]);
  
  const addAnalysisComment = useCallback((projectId, questionId, commentText) => {
      const [newAnalysisState, stateIndex] = getOrCreateAnalysisState(projectId, questionId);
      const newComment = {
          id: `ac-${Date.now()}`,
          authorId: currentUser.id,
          text: commentText,
          createdAt: new Date(),
      };
      newAnalysisState[stateIndex].comments.push(newComment);
      setAnalysisState(newAnalysisState);
  }, [currentUser, getOrCreateAnalysisState, setAnalysisState]);
  
  const updateUser = useCallback((userId, newName, newAvatarUrl) => {
    setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === userId) {
            return { ...user, name: newName, avatarUrl: newAvatarUrl };
        }
        return user;
    }));
  }, [setUsers]);
  
  const cycleAnalysisRaic = useCallback((questionId) => {
    const RAIC_CYCLE = ['R', 'A', 'I', 'C', null];
    
    setAnalysisRaicMap(prevMap => {
        const newMap = JSON.parse(JSON.stringify(prevMap));
        
        const questionRoles = newMap[questionId] || {};
        const currentRaic = questionRoles[currentUser.role] || null;
        
        const currentIndex = RAIC_CYCLE.indexOf(currentRaic);
        const nextIndex = (currentIndex + 1) % RAIC_CYCLE.length;
        
        questionRoles[currentUser.role] = RAIC_CYCLE[nextIndex];
        newMap[questionId] = questionRoles;
        
        return newMap;
    });
  }, [currentUser.role, setAnalysisRaicMap]);


  return (
    React.createElement(AppContext.Provider,
      {
        value: {
          currentUser,
          users,
          posts,
          stories,
          teamRaicMatrix,
          teamRaicEntities,
          reportRaicMatrix,
          reportRaicEntities,
          ganttTasks,
          notifications,
          conversations,
          analysisState,
          analysisRaicMap,
          isCreateModalOpen,
          editingPost,
          viewingQuestion,
          isEditProfileModalOpen,
          setCurrentUserId,
          addPost,
          addStory,
          toggleLike,
          addComment,
          updateTeamRaic,
          addTeamRaicEntity,
          updateGanttTask,
          addGanttTask,
          deleteGanttTask,
          setCreateModalOpen,
          markNotificationsAsRead,
          sendMessage,
          updatePostStatus,
          addOrUpdateAnalysis,
          setEditingPost,
          updatePost,
          setViewingQuestion,
          addAnalysisAnswer,
          toggleAnalysisLike,
          addAnalysisComment,
          setEditProfileModalOpen,
          updateUser,
          cycleAnalysisRaic,
        }
      },
      children
    )
  );
};
