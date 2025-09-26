
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { PostStatus, RAICType } from '../types';
import { ANALYSIS_FRAMEWORK, TOTAL_QUESTIONS } from '../constants/analysisQuestions';
import QuestionBrick from '../components/analysis/QuestionBrick';
import AnalysisHouse from '../components/analysis/AnalysisHouse';

const RAIC_COLORS_DETAILS: { [key in RAICType & string]: { color: string, label: string } } = {
    'R': { color: 'bg-purple-500', label: '負責' },
    'A': { color: 'bg-orange-500', label: '當責' },
    'I': { color: 'bg-blue-500', label: '被告知' },
    'C': { color: 'bg-green-500', label: '被諮詢' },
};

const RaicLegend = () => (
    <div className="p-2 bg-gray-100/80 dark:bg-gray-900/80 rounded-lg shadow-inner w-32 border border-gray-200 dark:border-gray-700 ml-4 flex-shrink-0">
        <h4 className="font-bold text-xs mb-1 text-center">RAIC</h4>
        <ul className="space-y-1 text-xs">
            {Object.entries(RAIC_COLORS_DETAILS).map(([key, { color, label }]) => (
                <li key={key} className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-1.5 ${color}`}></span>
                    <span>{label}</span>
                </li>
            ))}
        </ul>
    </div>
);


const AnalysisPage: React.FC = () => {
    const { posts, analysisState } = useContext(AppContext);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const projectPosts = useMemo(() => {
        return posts.filter(p => 
            p.tags.includes('project') && 
            p.tags.includes('qna') &&
            (p.status === PostStatus.InDiscussion || p.status === PostStatus.Confirmed)
        );
    }, [posts]);

    const selectedProject = useMemo(() => {
        if (!selectedProjectId) return null;
        return projectPosts.find(p => p.id === selectedProjectId);
    }, [selectedProjectId, projectPosts]);

    const { completedCount, overallProgress } = useMemo(() => {
        if (!selectedProjectId) return { completedCount: 0, overallProgress: 0 };

        const projectStates = analysisState.filter(s => s.projectId === selectedProjectId);
        const completed = projectStates.filter(s => s.answer && s.likes.length >= 4).length;
        
        return {
            completedCount: completed,
            overallProgress: (completed / TOTAL_QUESTIONS) * 100,
        };
    }, [selectedProjectId, analysisState]);

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">專案分析中心</h2>
                <p className="text-sm text-gray-500">選擇一個專案來進行深度分析。</p>
            </header>

            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {projectPosts.map(post => (
                        <button 
                            key={post.id}
                            onClick={() => setSelectedProjectId(post.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0 transition-colors ${selectedProjectId === post.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            {post.title}
                        </button>
                    ))}
                </div>
            </div>

            {selectedProject ? (
                <div className="flex-grow overflow-y-auto custom-scrollbar relative pb-32">
                    <div className="p-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 flex justify-between items-start">
                        <div className="flex-grow">
                           <h3 className="font-bold text-lg">{selectedProject.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
                                </div>
                                <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                            </div>
                        </div>
                        <RaicLegend />
                    </div>
                    {ANALYSIS_FRAMEWORK.map((section, sIndex) => (
                        <div key={`s-${sIndex}`} className="p-4">
                            <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">{section.title}</h4>
                            {section.levels.map((level, lIndex) => (
                                <div key={`s-${sIndex}-l-${lIndex}`} className="mb-6">
                                    <h5 className="font-semibold mb-3 text-gray-600 dark:text-gray-400">{level.title}</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {level.questions.map((q, qIndex) => (
                                            <QuestionBrick
                                                key={q.id}
                                                projectId={selectedProject.id}
                                                questionId={q.id}
                                                questionText={q.text}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    <AnalysisHouse completedBricks={completedCount} totalBricks={TOTAL_QUESTIONS} />
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                    <p>請從上方選擇一個專案開始分析。</p>
                </div>
            )}
        </div>
    );
};

export default AnalysisPage;
