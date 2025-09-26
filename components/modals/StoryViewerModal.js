import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Icon from '../ui/Icon';

const getConversationId = (id1, id2) => {
    if (id1 === id2) return `notepad_${id1}`;
    return [id1, id2].sort().join('_');
};

const StoryViewerModal = ({ story, onClose }) => {
    const { users, currentUser, sendMessage } = useContext(AppContext);
    const author = users.find(u => u.id === story.authorId);
    const [replyText, setReplyText] = useState('');

    const defaultBackground = 'linear-gradient(to bottom, #4a90e2, #9013fe)';

    if (!author) return null;
    
    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const conversationId = getConversationId(currentUser.id, story.authorId);
        
        sendMessage(conversationId, {
            senderId: currentUser.id,
            receiverId: story.authorId,
            text: replyText,
            storyReply: {
                storyContent: story.content,
                storyImageUrl: story.imageUrl,
            }
        });

        setReplyText('');
        onClose(); 
    };

    return (
        React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50", onClick: onClose },
            React.createElement('div', 
                { 
                    className: "relative w-full max-w-md h-[90vh] rounded-lg overflow-hidden bg-cover bg-center flex flex-col justify-center items-center p-8 text-center",
                    style: { 
                        backgroundImage: story.imageUrl ? `url(${story.imageUrl})` : defaultBackground,
                    },
                    onClick: (e) => e.stopPropagation()
                },
                React.createElement('div', { className: "absolute inset-0 bg-black bg-opacity-30" }),
                
                React.createElement('div', { className: "absolute top-4 left-4 flex items-center z-10" },
                    React.createElement('img', { src: author.avatarUrl, alt: author.name, className: "w-10 h-10 rounded-full border-2 border-white" }),
                    React.createElement('span', { className: "ml-2 font-bold text-white", style: { textShadow: '1px 1px 2px rgba(0,0,0,0.8)' } }, author.name)
                ),
                
                React.createElement('button', { onClick: onClose, className: "absolute top-2 right-2 text-white text-3xl font-bold z-10", "aria-label": "Close story viewer" }, "×"),
                
                React.createElement('p', { className: "text-white text-3xl font-bold z-10", style: { textShadow: '2px 2px 4px rgba(0,0,0,0.7)' } },
                    story.content
                ),
                
                currentUser.id !== author.id && (
                    React.createElement('form', { onSubmit: handleSendReply, className: "absolute bottom-4 left-4 right-4 z-20 flex items-center space-x-2" },
                        React.createElement('input',
                            {
                                type: "text",
                                value: replyText,
                                onChange: (e) => setReplyText(e.target.value),
                                placeholder: `回覆 ${author.name}...`,
                                className: "flex-grow p-3 bg-black/50 text-white border border-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-300",
                                onClick: (e) => e.stopPropagation()
                            }
                        ),
                        React.createElement('button', 
                            { 
                                type: "submit", 
                                disabled: !replyText.trim(),
                                className: "bg-white/30 text-white rounded-full p-3 disabled:opacity-50 hover:bg-white/50 transition-colors",
                                "aria-label": "Send reply",
                                onClick: (e) => e.stopPropagation()
                            },
                            React.createElement(Icon, { name: "send", className: "w-6 h-6"})
                        )
                    )
                )
            )
        )
    );
};

export default StoryViewerModal;
