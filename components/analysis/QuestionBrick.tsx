
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';

interface QuestionBrickProps {
    projectId: string;
    questionId: string;
    questionText: string;
}

const QuestionBrick: React.FC<QuestionBrickProps> = ({ projectId, questionId, questionText }) => {
    const { analysisState, setViewingQuestion, users } = useContext(AppContext);
    const totalUsers = users.length;
    // Progress is based on 1 author + (totalUsers - 1) likes. We'll use 4 as a fixed number as requested.
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

    const handleClick = () => {
        setViewingQuestion({ projectId, questionId, questionText });
    };

    return (
        <button 
            onClick={handleClick}
            className={`relative p-3 rounded-lg text-left text-sm font-medium transition-all duration-300 transform ${brickColor} ${isCompleted ? 'scale-95 opacity-80' : 'hover:scale-105'}`}
            style={{ minHeight: '80px' }}
            aria-label={`View details for question: ${questionText}`}
        >
            <p className="line-clamp-3">{questionText}</p>
            {isAnswered && !isCompleted && (
                <div className="absolute bottom-1 left-1 right-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </button>
    );
};

export default QuestionBrick;
