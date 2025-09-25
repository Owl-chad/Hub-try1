export enum Page {
  Home = 'HOME',
  Explore = 'EXPLORE',
  Messages = 'MESSAGES',
  Notifications = 'NOTIFICATIONS',
  Tools = 'TOOLS',
  Analysis = 'ANALYSIS',
}

export enum Role {
  MarketPioneer = '市場先鋒',
  ProductStrategist = '產品策略',
  ProjectManager = '專案管理',
  UserDesigner = '使用者設計',
  TechnicalArtisan = '技術匠人',
}

export const ALL_ROLES = Object.values(Role);

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: Role;
}

export interface Story {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Comment {
  id:string;
  authorId: string;
  text: string;
  createdAt: Date;
}

export enum PostStatus {
  InDiscussion = '正在討論階段',
  Confirmed = '確認可實施',
  Rejected = '無法通過的廢案',
  Reconsiderable = '可再考慮的廢案',
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
  likes: string[]; // array of user IDs
  comments: Comment[];
  createdAt: Date;
  status: PostStatus;
  analysis?: { [role in Role]?: string };
}

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  type: 'like' | 'comment';
  postId: string;
  commentText?: string;
  read: boolean;
  createdAt: Date;
}

export type RAICType = 'R' | 'A' | 'I' | 'C' | null;

export interface RAICEntity {
  id: string;
  name: string;
}

export interface RAICMatrix {
  [entityId: string]: {
    [role in Role]?: RAICType;
  };
}

export interface GanttTask {
  id: string;
  name: string;
  assignee: Role;
  startDate: Date;
  endDate: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface Conversation {
    id: string;
    participantIds: string[];
    messages: Message[];
}

export interface AnalysisQuestionState {
  // composite key: `${projectId}-${questionId}`
  id: string;
  projectId: string;
  questionId: string;
  answer?: {
    authorId: string;
    text: string;
    createdAt: Date;
  };
  likes: string[]; // user IDs
  comments: Comment[];
}

export interface ViewingQuestionPayload {
    projectId: string;
    questionId: string;
    questionText: string;
}
