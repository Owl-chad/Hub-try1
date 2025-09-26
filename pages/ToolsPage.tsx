
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import RAICTable from '../components/tools/RAICTable';
import GanttChart from '../components/tools/GanttChart';
import Icon from '../components/ui/Icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Role } from '../types';

type ToolTab = 'dashboard' | 'teamRaic' | 'reportRaic' | 'gantt';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
        <div className="text-blue-500">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const timeRangeOptions = [
    { key: 'weekly', label: '本週' },
    { key: '3weeks', label: '三週' },
    { key: '2months', label: '兩個月' },
    { key: 'all', label: '總共' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }}>{`${pld.name} : ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const ToolsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ToolTab>('dashboard');
    const { 
        currentUser,
        users,
        posts,
        stories,
        analysisState,
        teamRaicMatrix,
        teamRaicEntities,
        updateTeamRaic,
        addTeamRaicEntity,
        reportRaicMatrix,
        reportRaicEntities,
        ganttTasks,
        setEditProfileModalOpen
    } = useContext(AppContext);
    
    const [timeRangeIndex, setTimeRangeIndex] = useState(0);

    const handlePrevTimeRange = () => {
        setTimeRangeIndex((prev) => (prev - 1 + timeRangeOptions.length) % timeRangeOptions.length);
    };

    const handleNextTimeRange = () => {
        setTimeRangeIndex((prev) => (prev + 1) % timeRangeOptions.length);
    };
    
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyPosts = posts.filter(p => p.authorId === currentUser.id && p.createdAt > oneWeekAgo).length;
    const weeklyComments = posts.reduce((acc, p) => acc + p.comments.filter(c => c.authorId === currentUser.id && c.createdAt > oneWeekAgo).length, 0);

    const totalPosts = posts.filter(p => p.authorId === currentUser.id).length;
    const totalStories = stories.filter(s => s.authorId === currentUser.id).length;
    const totalComments = posts.reduce((acc, p) => acc + p.comments.filter(c => c.authorId === currentUser.id).length, 0);
    const totalAnalyses = analysisState.filter(s => s.answer?.authorId === currentUser.id).length;

    const chartData = useMemo(() => {
        const { key } = timeRangeOptions[timeRangeIndex];
        const now = Date.now();
        let startDate: Date | null = null;
        
        switch (key) {
            case 'weekly':
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case '3weeks':
                startDate = new Date(now - 21 * 24 * 60 * 60 * 1000);
                break;
            case '2months':
                startDate = new Date(now - 60 * 24 * 60 * 60 * 1000);
                break;
            case 'all':
            default:
                startDate = null;
                break;
        }

        return Object.values(Role).map(role => {
            const usersInRole = users.filter(u => u.role === role);
            const userIdsInRole = usersInRole.map(u => u.id);

            const rolePosts = posts.filter(p => 
                userIdsInRole.includes(p.authorId) &&
                (!startDate || new Date(p.createdAt) > startDate)
            ).length;

            const roleComments = posts.reduce((acc, p) => 
                acc + p.comments.filter(c => 
                    userIdsInRole.includes(c.authorId) &&
                    (!startDate || new Date(c.createdAt) > startDate)
                ).length, 0
            );
            
            const roleAnalyses = analysisState.filter(s => 
                s.answer && userIdsInRole.includes(s.answer.authorId) &&
                (!startDate || new Date(s.answer.createdAt) > startDate)
            ).length;

            return {
                name: role,
                '貼文': rolePosts,
                '回應': roleComments,
                '分析': roleAnalyses,
            };
        });

    }, [timeRangeIndex, posts, users, analysisState]);


    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="p-4 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2">角色: {currentUser.role}</h3>
                            <p className="text-sm text-gray-500">這是您在本週與總體的活動總覽。</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard title="本週貼文" value={weeklyPosts} icon={<Icon name="add" className="w-8 h-8"/>} />
                            <StatCard title="本週回應" value={weeklyComments} icon={<Icon name="comment" className="w-8 h-8"/>} />
                            <StatCard title="總貼文數" value={totalPosts} icon={<Icon name="add" className="w-8 h-8"/>} />
                            <StatCard title="總限動數" value={totalStories} icon={<Icon name="plus" className="w-8 h-8"/>} />
                            <StatCard title="總回應數" value={totalComments} icon={<Icon name="comment" className="w-8 h-8"/>} />
                            <StatCard title="總分析數" value={totalAnalyses} icon={<Icon name="question" className="w-8 h-8"/>} />
                        </div>
                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold">團隊{timeRangeOptions[timeRangeIndex].label}活動頻率</h3>
                                <div className="flex items-center space-x-2">
                                    <button onClick={handlePrevTimeRange} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Previous time range">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button onClick={handleNextTimeRange} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Next time range">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full h-64">
                                <ResponsiveContainer>
                                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" fontSize={10} interval={0} tick={{ dy: 5 }} />
                                        <YAxis allowDecimals={false} domain={[0, 10]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Bar dataKey="貼文" stackId="a" fill="#8884d8" name="貼文" />
                                        <Bar dataKey="回應" stackId="a" fill="#82ca9d" name="回應" />
                                        <Bar dataKey="分析" stackId="a" fill="#ffc658" name="分析" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );
            case 'teamRaic':
                return <RAICTable entities={teamRaicEntities} matrix={teamRaicMatrix} onUpdate={updateTeamRaic} onAddEntity={addTeamRaicEntity} />;
            case 'reportRaic':
                return <RAICTable entities={reportRaicEntities} matrix={reportRaicMatrix} onUpdate={() => {}} onAddEntity={() => {}} />;
            case 'gantt':
                return <GanttChart tasks={ganttTasks} />;
        }
    };
    
    return (
        <div>
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-4">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-16 h-16 rounded-full"/>
                    <div>
                        <h2 className="text-xl font-bold">{currentUser.name}</h2>
                        <p className="text-gray-500">{currentUser.role}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setEditProfileModalOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Edit profile"
                >
                    <Icon name="edit" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
            </div>
            <div className="flex justify-around border-b border-gray-200 dark:border-gray-800">
                <TabButton name="個人總覽" icon="dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <TabButton name="團隊 RAIC" icon="raic" isActive={activeTab === 'teamRaic'} onClick={() => setActiveTab('teamRaic')} />
                <TabButton name="報告 RAIC" icon="raic" isActive={activeTab === 'reportRaic'} onClick={() => setActiveTab('reportRaic')} />
                <TabButton name="甘特圖" icon="gantt" isActive={activeTab === 'gantt'} onClick={() => setActiveTab('gantt')} />
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

const TabButton: React.FC<{name: string, icon: any, isActive: boolean, onClick: () => void}> = ({name, icon, isActive, onClick}) => (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center p-2 text-xs ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>
        <Icon name={icon} className="w-5 h-5 mb-1" />
        {name}
    </button>
);


export default ToolsPage;
