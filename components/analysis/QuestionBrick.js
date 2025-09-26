import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';

const RAIC_INDICATOR_STYLES = {
    'R': { colors: 'bg-purple-500 text-white border-white', letter: 'R', title: 'Responsible (負責者)' },
    'A': { colors: 'bg-orange-500 text-white border-white', letter: 'A', title: 'Accountable (當責者)' },
    'I': { colors: 'bg-blue-500 text-white border-white', letter: 'I', title: 'Informed (被告知者)' },
    'C': { colors: 'bg-green-500 text-white border-white', letter: 'C', title: 'Consulted (被諮詢者)' },
};

const QuestionBrick = ({ projectId, questionId, questionText }) => {
    const { analysisState, setViewingQuestion, currentUser, analysisRaicMap, cycleAnalysisRaic } = useContext(AppContext);
    const requiredLikes = 4;

    const state = useMemo(() => {
        const id = `${projectId}-${questionId}`;
        return analysisState.find(s => s.id === id);
    }, [analysisState, projectId, questionId]);

    const isAnswered = !!state?.answer;
    const progress = isAnswered ? Math.min((state.likes.length / requiredLikes) * 100, 100) : 0;

    const brickColor = useMemo(() => {
        if (progress === 100) return 'bg-green-500 hover:bg-green-600';
        if (isAnswered) return 'bg-yellow-400 hover:bg-yellow-500 text-black';
        return 'bg-orange-400 hover:bg-orange-500 text-black';
    }, [isAnswered, progress]);

    const isCompleted = progress === 100;

    const raicTypeForCurrentUser = useMemo(() => {
        const questionRaic = analysisRaicMap[questionId];
        return questionRaic?.[currentUser.role] ?? null;
    }, [analysisRaicMap, questionId, currentUser.role]);

    const raicInfo = raicTypeForCurrentUser ? RAIC_INDICATOR_STYLES[raicTypeForCurrentUser] : null;

    const handleClick = () => {
        setViewingQuestion({ projectId, questionId, questionText });
    };

    const handleRaicClick = (e) => {
        e.stopPropagation();
        cycleAnalysisRaic(questionId);
    };

    return (
        React.createElement('div', 
            { 
                className: `relative transition-all duration-300 transform rounded-lg ${isCompleted ? 'scale-95 opacity-80' : 'hover:scale-105'}`,
                style: { minHeight: '80px' }
            },
            React.createElement('button', 
                { 
                    onClick: handleClick,
                    className: `w-full h-full p-3 text-left text-sm font-medium rounded-lg ${brickColor}`,
                    "aria-label": `View details for question: ${questionText}`
                },
                React.createElement('p', { className: "line-clamp-3 pr-2" }, questionText),
                isAnswered && !isCompleted && (
                    React.createElement('div', { className: "absolute bottom-1 left-1 right-1 h-1.5 bg-black/20 rounded-full overflow-hidden" },
                        React.createElement('div', { className: "h-full bg-green-600", style: { width: `${progress}%` } })
                    )
                )
            ),
            React.createElement('button',
                {
                    type: "button",
                    onClick: handleRaicClick,
                    "aria-label": "Cycle RAIC assignment",
                    title: raicInfo ? raicInfo.title : "指定 RAIC",
                    className: `absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-transform hover:scale-125 z-10 ${
                        raicInfo ? raicInfo.colors : 'bg-gray-400 border-white'
                    }`
                },
                raicInfo ? raicInfo.letter : ''
            )
        )
    );
};

export default QuestionBrick;
