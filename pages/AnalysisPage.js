import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { PostStatus } from '../types';
import { ANALYSIS_FRAMEWORK, TOTAL_QUESTIONS } from '../constants/analysisQuestions';
import QuestionBrick from '../components/analysis/QuestionBrick';
import AnalysisHouse from '../components/analysis/AnalysisHouse';

const RAIC_COLORS_DETAILS = {
    'R': { color: 'bg-purple-500', label: '負責' },
    'A': { color: 'bg-orange-500', label: '當責' },
    'I': { color: 'bg-blue-500', label: '被告知' },
    'C': { color: 'bg-green-500', label: '被諮詢' },
};

const RaicLegend = () => (
    React.createElement('div', { className: "p-2 bg-gray-100/80 dark:bg-gray-900/80 rounded-lg shadow-inner w-32 border border-gray-200 dark:border-gray-700 ml-4 flex-shrink-0" },
        React.createElement('h4', { className: "font-bold text-xs mb-1 text-center" }, "RAIC"),
        React.createElement('ul', { className: "space-y-1 text-xs" },
            Object.entries(RAIC_COLORS_DETAILS).map(([key, { color, label }]) => (
                React.createElement('li', { key: key, className: "flex items-center" },
                    React.createElement('span', { className: `w-3 h-3 rounded-full mr-1.5 ${color}` }),
                    React.createElement('span', null, label)
                )
            ))
        )
    )
);


const AnalysisPage = () => {
    const { posts, analysisState } = useContext(AppContext);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

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
        React.createElement('div', { className: "flex flex-col h-full" },
            React.createElement('header', { className: "p-4 border-b border-gray-200 dark:border-gray-800" },
                React.createElement('h2', { className: "text-xl font-bold" }, "專案分析中心"),
                React.createElement('p', { className: "text-sm text-gray-500" }, "選擇一個專案來進行深度分析。")
            ),

            React.createElement('div', { className: "p-4 border-b border-gray-200 dark:border-gray-800" },
                React.createElement('div', { className: "flex space-x-2 overflow-x-auto pb-2" },
                    projectPosts.map(post => (
                        React.createElement('button', 
                            { 
                                key: post.id,
                                onClick: () => setSelectedProjectId(post.id),
                                className: `px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0 transition-colors ${selectedProjectId === post.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`
                            },
                            post.title
                        )
                    ))
                )
            ),

            selectedProject ? (
                React.createElement('div', { className: "flex-grow overflow-y-auto custom-scrollbar relative pb-32" },
                    React.createElement('div', { className: "p-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 flex justify-between items-start" },
                        React.createElement('div', { className: "flex-grow" },
                           React.createElement('h3', { className: "font-bold text-lg" }, selectedProject.title),
                            React.createElement('div', { className: "flex items-center space-x-2 mt-1" },
                                React.createElement('div', { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5" },
                                    React.createElement('div', { className: "bg-green-500 h-2.5 rounded-full", style: { width: `${overallProgress}%` } })
                                ),
                                React.createElement('span', { className: "text-sm font-medium" }, `${Math.round(overallProgress)}%`)
                            )
                        ),
                        React.createElement(RaicLegend, null)
                    ),
                    ANALYSIS_FRAMEWORK.map((section, sIndex) => (
                        React.createElement('div', { key: `s-${sIndex}`, className: "p-4" },
                            React.createElement('h4', { className: "font-bold text-xl mb-4 text-gray-800 dark:text-gray-200" }, section.title),
                            section.levels.map((level, lIndex) => (
                                React.createElement('div', { key: `s-${sIndex}-l-${lIndex}`, className: "mb-6" },
                                    React.createElement('h5', { className: "font-semibold mb-3 text-gray-600 dark:text-gray-400" }, level.title),
                                    React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 gap-2" },
                                        level.questions.map((q, qIndex) => (
                                            React.createElement(QuestionBrick,
                                                {
                                                    key: q.id,
                                                    projectId: selectedProject.id,
                                                    questionId: q.id,
                                                    questionText: q.text
                                                }
                                            )
                                        ))
                                    )
                                )
                            ))
                        )
                    )),
                    React.createElement(AnalysisHouse, { completedBricks: completedCount, totalBricks: TOTAL_QUESTIONS })
                )
            ) : (
                React.createElement('div', { className: "flex-grow flex items-center justify-center text-gray-500" },
                    React.createElement('p', null, "請從上方選擇一個專案開始分析。")
                )
            )
        )
    );
};

export default AnalysisPage;
