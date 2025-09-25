
import React, { createContext, useState, ReactNode, useCallback } from 'react';
// FIX: Import the 'Message' type from '../types' to resolve 'Cannot find name' errors.
import { Post, User, Story, Role, RAICMatrix, RAICEntity, GanttTask, RAICType, Comment, Notification, Conversation, PostStatus, Message, AnalysisQuestionState, ViewingQuestionPayload } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_TEAM_RAIC, TEAM_ROLES_ENTITIES, INITIAL_REPORT_RAIC, REPORT_ENTITIES, INITIAL_GANTT_TASKS, INITIAL_NOTIFICATIONS, INITIAL_CONVERSATIONS, INITIAL_ANALYSIS_STATE } from '../constants';

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
  isCreateModalOpen: boolean;
  editingPost: Post | null;
  viewingQuestion: ViewingQuestionPayload | null;
  isEditProfileModalOpen: boolean;
  setCurrentUser: (user: User) => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'likes' | 'comments' | 'status' | 'analysis'>) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'authorId'>) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  updateTeamRaic: (entityId: string, role: Role, value: RAICType) => void;
  addTeamRaicEntity: (name: string) => void;
  updateGanttTask: (task: GanttTask) => void;
  addGanttTask: (name: string, startDate: Date, endDate: Date) => void;
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
}

export const AppContext = createContext<AppContextType>(null!);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [teamRaicMatrix, setTeamRaicMatrix] = useState<RAICMatrix>(INITIAL_TEAM_RAIC);
  const [teamRaicEntities, setTeamRaicEntities] = useState<RAICEntity[]>(TEAM_ROLES_ENTITIES);
  const [reportRaicMatrix, setReportRaicMatrix] = useState<RAICMatrix>(INITIAL_REPORT_RAIC);
  const [reportRaicEntities, setReportRaicEntities] = useState<RAICEntity[]>(REPORT_ENTITIES);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>(INITIAL_GANTT_TASKS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [analysisState, setAnalysisState] = useState<AnalysisQuestionState[]>(INITIAL_ANALYSIS_STATE);
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
  }, [currentUser]);

  const addStory = useCallback((storyData: Omit<Story, 'id' | 'createdAt' | 'authorId'>) => {
    const newStory: Story = {
      ...storyData,
      id: `s${Date.now()}`,
      authorId: currentUser.id,
      createdAt: new Date(),
    };
    setStories(prev => [newStory, ...prev]);
  }, [currentUser]);

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
  }, [currentUser.id, users]);

  const addComment = useCallback((postId: string, text: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      authorId: currentUser.id,
      text,
      createdAt: new Date(),
    };
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const postAuthor = users.find(u => u.id === p.authorId);
          if (postAuthor && postAuthor.id !== currentUser.id) {
            const newNotification: Notification = {
              id: `n${Date.now()}`,
              recipientId: postAuthor.id,
              actorId: currentUser.id,
              type: 'comment',
              postId: p.id,
              commentText: text,
              read: false,
              createdAt: new Date(),
            };
            setNotifications(prev => [newNotification, ...prev]);
          }
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );
  }, [currentUser, users]);
  
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

  const addGanttTask = useCallback((name: string, startDate: Date, endDate: Date) => {
    const newTask: GanttTask = {
        id: `t${Date.now()}`,
        name,
        assignee: currentUser.role,
        startDate,
        endDate,
    };
    setGanttTasks(prev => [...prev, newTask]);
  }, [currentUser.role]);
  
  const deleteGanttTask = useCallback((taskId: string) => {
      setGanttTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);
  
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
  }, []);

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

  const getOrCreateAnalysisState = (projectId: string, questionId: string): [AnalysisQuestionState[], number] => {
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
  };

  const addAnalysisAnswer = (projectId: string, questionId: string, answerText: string) => {
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
  };

  const toggleAnalysisLike = (projectId: string, questionId: string) => {
    const [newAnalysisState, stateIndex] = getOrCreateAnalysisState(projectId, questionId);
    const currentState = newAnalysisState[stateIndex];
    const isLiked = currentState.likes.includes(currentUser.id);

    if (isLiked) {
        currentState.likes = currentState.likes.filter(id => id !== currentUser.id);
    } else {
        currentState.likes.push(currentUser.id);
    }
    setAnalysisState(newAnalysisState);
  };
  
  const addAnalysisComment = (projectId: string, questionId: string, commentText: string) => {
      const [newAnalysisState, stateIndex] = getOrCreateAnalysisState(projectId, questionId);
      const newComment: Comment = {
          id: `ac-${Date.now()}`,
          authorId: currentUser.id,
          text: commentText,
          createdAt: new Date(),
      };
      newAnalysisState[stateIndex].comments.push(newComment);
      setAnalysisState(newAnalysisState);
  };
  
  const updateUser = useCallback((userId: string, newName: string, newAvatarUrl: string) => {
    let updatedUser: User | null = null;
    const newUsers = users.map(user => {
        if (user.id === userId) {
            updatedUser = { ...user, name: newName, avatarUrl: newAvatarUrl };
            return updatedUser;
        }
        return user;
    });
    setUsers(newUsers);

    if (currentUser.id === userId && updatedUser) {
        setCurrentUser(updatedUser);
    }
  }, [users, currentUser.id]);

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
        isCreateModalOpen,
        editingPost,
        viewingQuestion,
        isEditProfileModalOpen,
        setCurrentUser,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
