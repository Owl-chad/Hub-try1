import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Post, User, Story, Role, RAICMatrix, RAICEntity, GanttTask, RAICType, Comment, Notification, Conversation, PostStatus, Message, AnalysisQuestionState, ViewingQuestionPayload } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_TEAM_RAIC, TEAM_ROLES_ENTITIES, INITIAL_REPORT_RAIC, REPORT_ENTITIES, INITIAL_GANTT_TASKS, INITIAL_NOTIFICATIONS, INITIAL_CONVERSATIONS, INITIAL_ANALYSIS_STATE } from '../constants';
import { INITIAL_ANALYSIS_RAIC_MAP } from '../constants/analysisQuestions';
import { usePersistentState } from '../hooks/usePersistentState';

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: Story[];
  teamRaicMatrix: RAICMatrix;
  teamRaicEntities: RAICEntity[];
  reportRaicMatrix: RAICMatrix;
  reportRaicEntities: RAICEntity[];
  ganttTasks: GanttTask[];
  notifications: Notification[];
  conversations: Conversation[];
  analysisState: AnalysisQuestionState[];
  analysisRaicMap: { [questionId: string]: { [role in Role]?: RAICType } };
  isCreateModalOpen: boolean;
  editingPost: Post | null;
  viewingQuestion: ViewingQuestionPayload | null;
  isEditProfileModalOpen: boolean;
  setCurrentUserId: (userId: string) => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'likes' | 'comments' | 'status' | 'analysis'>) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'authorId'>) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string, parentId?: string) => void;
  updateTeamRaic: (entityId: string, role: Role, value: RAICType) => void;
  addTeamRaicEntity: (name: string) => void;
  updateGanttTask: (task: GanttTask) => void;
  addGanttTask: (taskData: Omit<GanttTask, 'id'>) => void;
  deleteGanttTask: (taskId: string) => void;
  setCreateModalOpen: (isOpen: boolean) => void;
  markNotificationsAsRead: () => void;
  sendMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updatePostStatus: (postId: string, status: PostStatus) => void;
  addOrUpdateAnalysis: (postId: string, role: Role, analysisText: string) => void;
  setEditingPost: (post: Post | null) => void;
  updatePost: (postId: string, newTitle: string, newContent: string) => void;
  setViewingQuestion: (payload: ViewingQuestionPayload | null) => void;
  addAnalysisAnswer: (projectId: string, questionId: string, answerText: string) => void;
  toggleAnalysisLike: (projectId: string, questionId: string) => void;
  addAnalysisComment: (projectId: string, questionId: string, commentText: string) => void;
  setEditProfileModalOpen: (isOpen: boolean) => void;
  updateUser: (userId: string, newName: string, newAvatarUrl: string) => void;
  cycleAnalysisRaic: (questionId: string) => void;
}

export const AppContext = createContext<AppContextType>(null!);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = usePersistentState<User[]>('users', INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = usePersistentState<string>('currentUserId', INITIAL_USERS[0].id);

  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);
  
  const [posts, setPosts] = usePersistentState<Post[]>('posts', INITIAL_POSTS);
  const [stories, setStories] = usePersistentState<Story[]>('stories', INITIAL_STORIES);
  const [teamRaicMatrix, setTeamRaicMatrix] = usePersistentState<RAICMatrix>('teamRaicMatrix', INITIAL_TEAM_RAIC);
  const [teamRaicEntities, setTeamRaicEntities] = usePersistentState<RAICEntity[]>('teamRaicEntities', TEAM_ROLES_ENTITIES);
  const [reportRaicMatrix, setReportRaicMatrix] = usePersistentState<RAICMatrix>('reportRaicMatrix', INITIAL_REPORT_RAIC);
  const [reportRaicEntities, setReportRaicEntities] = usePersistentState<RAICEntity[]>('reportRaicEntities', REPORT_ENTITIES);
  const [ganttTasks, setGanttTasks] = usePersistentState<GanttTask[]>('ganttTasks', INITIAL_GANTT_TASKS);
  const [notifications, setNotifications] = usePersistentState<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = usePersistentState<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
  const [analysisState, setAnalysisState] = usePersistentState<AnalysisQuestionState[]>('analysisState', INITIAL_ANALYSIS_STATE);
  const [analysisRaicMap, setAnalysisRaicMap] = usePersistentState<{ [questionId: string]: { [role in Role]?: RAICType } }>('analysisRaicMap', INITIAL_ANALYSIS_RAIC_MAP);
  
  // Transient UI state, should not be persisted
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<ViewingQuestionPayload | null>(null);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const addPost = useCallback((postData: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'likes' | 'comments' | 'status' | 'analysis'>) => {
    const newPost: Post = {
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

  const addStory = useCallback((storyData: Omit<Story, 'id' | 'createdAt' | 'authorId'>) => {
    const newStory: Story = {
      ...storyData,
      id: `s${Date.now()}`,
      authorId: currentUser.id,
      createdAt: new Date(),
    };
    setStories(prev => [newStory, ...prev]);
  }, [currentUser, setStories]);

  const toggleLike = useCallback((postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const newLikes = p.likes.includes(currentUser.id)
            ? p.likes.filter(uid => uid !== currentUser.id)
            : [...p.likes, currentUser.id];
          
          if (newLikes.length > p.likes.length) {
            const postAuthor = users.find(u => u.id === p.authorId);
            if (postAuthor && postAuthor.id !== currentUser.id) {
              const newNotification: Notification = {
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

  const addComment = useCallback((postId: string, text: string, parentId?: string) => {
    const newComment: Comment = {
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
          const notificationsToAdd: Notification[] = [];
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
  
  const updateTeamRaic = (entityId: string, role: Role, value: RAICType) => {
    setTeamRaicMatrix(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [role]: value,
      },
    }));
  };
  
  const addTeamRaicEntity = (name: string) => {
      const newEntity: RAICEntity = { id: `e${Date.now()}`, name };
      setTeamRaicEntities(prev => [...prev, newEntity]);
      setTeamRaicMatrix(prev => ({ ...prev, [newEntity.id]: {} }));
  };

  const updateGanttTask = (updatedTask: GanttTask) => {
      setGanttTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const addGanttTask = useCallback((taskData: Omit<GanttTask, 'id'>) => {
    const newTask: GanttTask = {
        ...taskData,
        id: `t${Date.now()}`,
    };
    setGanttTasks(prev => [...prev, newTask]);
  }, [setGanttTasks]);
  
  const deleteGanttTask = useCallback((taskId: string) => {
      setGanttTasks(prev => prev.filter(t => t.id !== taskId));
  }, [setGanttTasks]);
  
  const markNotificationsAsRead = () => {
      setNotifications(prev => prev.map(n => ({...n, read: true})));
  };
  
  const sendMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
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
            const newConversation: Conversation = {
                id: conversationId,
                participantIds: [message.senderId, message.receiverId].filter((value, index, self) => self.indexOf(value) === index),
                messages: [newMessage],
            };
            return [...prev, newConversation];
        }
    });
  }, [setConversations]);

  const updatePostStatus = (postId: string, status: PostStatus) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, status } : p
      )
    );
  };

  const addOrUpdateAnalysis = (postId: string, role: Role, analysisText: string) => {
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
  
  const updatePost = (postId: string, newTitle: string, newContent: string) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, title: newTitle, content: newContent } : p
      )
    );
  };

  const getOrCreateAnalysisState = useCallback((projectId: string, questionId: string): [AnalysisQuestionState[], number] => {
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

  const addAnalysisAnswer = useCallback((projectId: string, questionId: string, answerText: string) => {
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

  const toggleAnalysisLike = useCallback((projectId: string, questionId: string) => {
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
  
  const addAnalysisComment = useCallback((projectId: string, questionId: string, commentText: string) => {
      const [newAnalysisState, stateIndex] = getOrCreateAnalysisState(projectId, questionId);
      const newComment: Comment = {
          id: `ac-${Date.now()}`,
          authorId: currentUser.id,
          text: commentText,
          createdAt: new Date(),
      };
      newAnalysisState[stateIndex].comments.push(newComment);
      setAnalysisState(newAnalysisState);
  }, [currentUser, getOrCreateAnalysisState, setAnalysisState]);
  
  const updateUser = useCallback((userId: string, newName: string, newAvatarUrl: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === userId) {
            return { ...user, name: newName, avatarUrl: newAvatarUrl };
        }
        return user;
    }));
  }, [setUsers]);
  
  const cycleAnalysisRaic = useCallback((questionId: string) => {
    const RAIC_CYCLE: (RAICType | null)[] = ['R', 'A', 'I', 'C', null];
    
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
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};