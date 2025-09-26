
import { Role, User, Story, Post, Comment, Notification, RAICEntity, RAICMatrix, GanttTask, Message, Conversation, PostStatus, AnalysisQuestionState } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Jane', avatarUrl: 'https://picsum.photos/seed/jane/100/100', role: Role.MarketPioneer },
  { id: 'u2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/100/100', role: Role.ProductStrategist },
  { id: 'u3', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', role: Role.ProjectManager },
  { id: 'u4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/diana/100/100', role: Role.UserDesigner },
  { id: 'u5', name: 'Eve', avatarUrl: 'https://picsum.photos/seed/eve/100/100', role: Role.TechnicalArtisan },
];

export const INITIAL_STORIES: Story[] = [
  { id: 's1', authorId: 'u1', content: '快速支付整合的點子', imageUrl: 'https://picsum.photos/seed/story1/600/1000', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: 's2', authorId: 'u4', content: '新的 onboarding 流程設計', imageUrl: 'https://picsum.photos/seed/story2/600/1000', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: 's3', authorId: 'u5', content: '可以試試新的前端框架', imageUrl: 'https://picsum.photos/seed/story3/600/1000', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
];

export const INITIAL_COMMENTS: Comment[] = [
    { id: 'c1', authorId: 'u2', text: '這個想法很棒！市場潛力巨大。', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'c2', authorId: 'u4', text: '使用者介面可以更簡潔一些。', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
];

export const INITIAL_POSTS: Post[] = [
  { 
    id: 'p1', 
    authorId: 'u2', 
    title: 'AI 驅動的個人化學習平台',
    content: '開發一個利用 AI 分析學習風格和進度，提供客製化學習路徑的平台。目標市場是 K-12 教育。#project', 
    imageUrl: 'https://picsum.photos/seed/project1/600/600', 
    tags: ['project', 'AI', 'EdTech', 'qna'], 
    likes: ['u1', 'u3', 'u4'],
    comments: INITIAL_COMMENTS,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: PostStatus.InDiscussion,
    analysis: {
        [Role.MarketPioneer]: '初期市場反應熱烈，建議小規模 MVP 測試，鎖定特定年級。'
    },
  },
  { 
    id: 'p2', 
    authorId: 'u1', 
    title: '如何驗證早期市場需求？',
    content: '在投入大量資源前，有哪些低成本的方式可以有效驗證市場對一個新產品的真實需求？尋求大家的看法。', 
    imageUrl: 'https://picsum.photos/seed/project2/600/600', 
    tags: ['MarketResearch', 'Strategy'], 
    likes: ['u2', 'u5'],
    comments: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: PostStatus.InDiscussion,
    analysis: {},
  },
  { 
    id: 'p3', 
    authorId: 'u5', 
    title: '區塊鏈在供應鏈管理中的應用',
    content: '利用區塊鏈的不可篡改特性來追蹤產品從源頭到消費者的整個流程，提高透明度和信任度。#project', 
    imageUrl: 'https://picsum.photos/seed/project3/600/600', 
    tags: ['project', 'Blockchain', 'SupplyChain', 'qna'], 
    likes: ['u1', 'u2', 'u3', 'u4'],
    comments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: PostStatus.Confirmed,
    analysis: {},
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: 'n1', recipientId: 'u2', actorId: 'u1', type: 'like', postId: 'p1', read: false, createdAt: new Date() },
    { id: 'n2', recipientId: 'u2', actorId: 'u4', type: 'comment', postId: 'p1', commentText: '使用者介面可以更簡潔一些。', read: true, createdAt: new Date() },
];

export const INITIAL_ANALYSIS_STATE: AnalysisQuestionState[] = [
    {
        id: 'p1-s0-l0-q0',
        projectId: 'p1',
        questionId: 's0-l0-q0',
        answer: {
            authorId: 'u1',
            text: '目前經濟景氣穩定，有利於教育科技等新興市場的投資與發展。',
            createdAt: new Date(),
        },
        likes: ['u2', 'u3', 'u4', 'u5'],
        comments: [],
    },
    {
        id: 'p1-s0-l0-q1',
        projectId: 'p1',
        questionId: 's0-l0-q1',
        answer: {
            authorId: 'u2',
            text: '國際市場對 EdTech 的需求持續增長，尤其是在亞洲地區。',
            createdAt: new Date(),
        },
        likes: ['u1', 'u3'],
        comments: [],
    }
];


export const TEAM_ROLES_ENTITIES: RAICEntity[] = [
    { id: 'e1', name: '市場研究' },
    { id: 'e2', name: '產品規格定義' },
    { id: 'e3', name: '專案時程規劃' },
    { id: 'e4', name: 'UI/UX 設計' },
    { id: 'e5', name: '技術架構' },
    { id: 'e6', name: '前後端開發' },
];

export const INITIAL_TEAM_RAIC: RAICMatrix = {
    'e1': { [Role.MarketPioneer]: 'A', [Role.ProductStrategist]: 'R', [Role.UserDesigner]: 'I' },
    'e2': { [Role.ProductStrategist]: 'A', [Role.MarketPioneer]: 'R', [Role.ProjectManager]: 'I', [Role.TechnicalArtisan]: 'C' },
    'e3': { [Role.ProjectManager]: 'A', [Role.ProductStrategist]: 'R', [Role.TechnicalArtisan]: 'C' },
    'e4': { [Role.UserDesigner]: 'A', [Role.ProductStrategist]: 'R', [Role.TechnicalArtisan]: 'C' },
    'e5': { [Role.TechnicalArtisan]: 'A', [Role.ProductStrategist]: 'R', [Role.ProjectManager]: 'I' },
    'e6': { [Role.TechnicalArtisan]: 'A', [Role.ProjectManager]: 'R' },
};

export const REPORT_ENTITIES: RAICEntity[] = [
    { id: 'r1', name: '公司業務與目標' },
    { id: 'r2', name: '客戶痛點' },
    { id: 'r3', name: '解決方案' },
    { id: 'r4', name: '時機點' },
    { id: 'r5', name: '市場規模' },
    { id: 'r6', name: '競爭對手' },
    { id: 'r7', name: '產品' },
    { id: 'r8', name: '商業模式' },
    { id: 'r9', name: '團隊組成' },
];

export const INITIAL_REPORT_RAIC: RAICMatrix = {
    'r1': { [Role.ProductStrategist]: 'A', [Role.MarketPioneer]: 'R', [Role.ProjectManager]: 'I' },
    'r2': { [Role.MarketPioneer]: 'A', [Role.UserDesigner]: 'R' },
    'r3': { [Role.ProductStrategist]: 'A', [Role.TechnicalArtisan]: 'R' },
    'r4': { [Role.MarketPioneer]: 'A', [Role.ProductStrategist]: 'R' },
    'r5': { [Role.MarketPioneer]: 'A', [Role.ProductStrategist]: 'R' },
    'r6': { [Role.MarketPioneer]: 'A', [Role.ProductStrategist]: 'I' },
    'r7': { [Role.UserDesigner]: 'R', [Role.TechnicalArtisan]: 'A' },
    'r8': { [Role.ProductStrategist]: 'A', [Role.MarketPioneer]: 'R' },
    'r9': { [Role.ProjectManager]: 'A' },
};

export const INITIAL_GANTT_TASKS: GanttTask[] = [
    { id: 't1', name: 'Q4 市場趨勢分析', assignee: Role.MarketPioneer, startDate: new Date(Date.UTC(2025, 8, 25)), endDate: new Date(Date.UTC(2025, 9, 10)), color: '#3b82f6' },
    { id: 't2', name: '新功能規格書 v1', assignee: Role.ProductStrategist, startDate: new Date(Date.UTC(2025, 9, 11)), endDate: new Date(Date.UTC(2025, 9, 25)), color: '#8b5cf6' },
    { id: 't3', name: '新功能 Prototype 設計', assignee: Role.UserDesigner, startDate: new Date(Date.UTC(2025, 9, 28)), endDate: new Date(Date.UTC(2025, 10, 15)), color: '#eab308' },
    { id: 't4', name: '技術選型評估', assignee: Role.TechnicalArtisan, startDate: new Date(Date.UTC(2025, 10, 10)), endDate: new Date(Date.UTC(2025, 10, 25)), color: '#22c55e' },
    { id: 't5', name: 'Q4 專案排程', assignee: Role.ProjectManager, startDate: new Date(Date.UTC(2025, 8, 25)), endDate: new Date(Date.UTC(2025, 11, 24)), color: '#ef4444' },
];

const initialMessages: Message[] = [
    {id: 'm1', senderId: 'u1', receiverId: 'u2', text: 'Hey Bob, check out the new market data.', timestamp: new Date(Date.now() - 5 * 60000)},
    {id: 'm2', senderId: 'u2', receiverId: 'u1', text: 'Looks promising! Let\'s discuss tomorrow.', timestamp: new Date(Date.now() - 4 * 60000)},
    {id: 'm3', senderId: 'u1', receiverId: 'u2', text: 'Sounds good.', timestamp: new Date(Date.now() - 3 * 60000)},
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: 'u1_u2',
        participantIds: ['u1', 'u2'],
        messages: initialMessages
    },
    {
        id: 'u1_u3',
        participantIds: ['u1', 'u3'],
        messages: [{id: 'm4', senderId: 'u3', receiverId: 'u1', text: 'Project deadline update?', timestamp: new Date(Date.now() - 10 * 60000)}]
    },
    {
        id: 'notepad_u1',
        participantIds: ['u1'],
        messages: [{id: 'note1', senderId: 'u1', receiverId: 'u1', text: '我的私人筆記：記得跟進第三季報告。', timestamp: new Date(Date.now() - 24 * 60 * 60000)}]
    }
];