
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { ViewingQuestionPayload } from '../../types';
import Icon from '../ui/Icon';

interface QuestionDetailModalProps {
    questionPayload: ViewingQuestionPayload;
    onClose: () => void;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({ questionPayload, onClose }) => {
    const { projectId, questionId, questionText } = questionPayload;
    const { 
        currentUser,
        users,
        analysisState,
        addAnalysisAnswer,
        toggleAnalysisLike,
        addAnalysisComment,
    } = useContext(AppContext);

    const [answerText, setAnswerText] = useState('');
    const [commentText, setCommentText] = useState('');

    const state = useMemo(() => {
        const id = `${projectId}-${questionId}`;
        return analysisState.find(s => s.id === id);
    }, [analysisState, projectId, questionId]);

    const answer = state?.answer;
    const answerAuthor = useMemo(() => answer ? users.find(u => u.id === answer.authorId) : null, [answer, users]);
    const isLiked = state?.likes.includes(currentUser.id) ?? false;
    const canLike = answer && answer.authorId !== currentUser.id;

    const handleAnswerSubmit = () => {
        if (answerText.trim()) {
            addAnalysisAnswer(projectId, questionId, answerText);
            setAnswerText('');
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            addAnalysisComment(projectId, questionId, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-md h-[90vh] flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold">問題分析</h2>
                    <button onClick={onClose} className="text-gray-500 text-2xl" aria-label="Close question modal">&times;</button>
                </header>

                <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="font-semibold">{questionText}</p>
                    </div>

                    {answer && answerAuthor ? (
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <img src={answerAuthor.avatarUrl} alt={answerAuthor.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-sm">{answerAuthor.name}</p>
                                        <p className="text-xs text-gray-400">{new Date(answer.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm whitespace-pre-wrap">{answer.text}</p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button onClick={() => canLike && toggleAnalysisLike(projectId, questionId)} disabled={!canLike} className="flex items-center space-x-1 text-sm disabled:opacity-50">
                                    <Icon name="heart" isFilled={isLiked} className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
                                    <span>{state?.likes.length || 0}</span>
                                </button>
                                <div className="text-sm flex items-center space-x-1 text-gray-500">
                                    <Icon name="comment" className="w-5 h-5" />
                                    <span>{state?.comments.length || 0}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold mb-2">留言</h3>
                                <div className="space-y-3">
                                    {state?.comments.map(comment => {
                                        const commentAuthor = users.find(u => u.id === comment.authorId);
                                        return (
                                            <div key={comment.id} className="flex items-start space-x-2 text-sm">
                                                <img src={commentAuthor?.avatarUrl} alt={commentAuthor?.name} className="w-6 h-6 rounded-full" />
                                                <div>
                                                    <span className="font-semibold mr-2">{commentAuthor?.name}</span>
                                                    <span>{comment.text}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <textarea
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="寫下你的回答..."
                                rows={5}
                                className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                            />
                            <button onClick={handleAnswerSubmit} className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md">提交回答</button>
                        </div>
                    )}
                </div>

                {answer && (
                    <footer className="p-2 border-t border-gray-200 dark:border-gray-700">
                         <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="新增留言..."
                                className="flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none"
                            />
                            <button type="submit" className="bg-blue-500 text-white rounded-full p-2">
                                <Icon name="send" className="w-5 h-5"/>
                            </button>
                        </form>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default QuestionDetailModal;
