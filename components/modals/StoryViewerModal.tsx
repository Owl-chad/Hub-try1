import React, { useContext, useState } from 'react';
import { Story } from '../../types';
import { AppContext } from '../../context/AppContext';
import Icon from '../ui/Icon';

interface StoryViewerModalProps {
  story: Story;
  onClose: () => void;
}

const getConversationId = (id1: string, id2: string): string => {
    if (id1 === id2) return `notepad_${id1}`;
    return [id1, id2].sort().join('_');
};

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ story, onClose }) => {
    const { users, currentUser, sendMessage } = useContext(AppContext);
    const author = users.find(u => u.id === story.authorId);
    const [replyText, setReplyText] = useState('');

    // Basic gradient for stories without images
    const defaultBackground = 'linear-gradient(to bottom, #4a90e2, #9013fe)';

    if (!author) return null;
    
    const handleSendReply = (e: React.FormEvent) => {
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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={onClose}>
            <div 
                className="relative w-full max-w-md h-[90vh] rounded-lg overflow-hidden bg-cover bg-center flex flex-col justify-center items-center p-8 text-center"
                style={{ 
                    backgroundImage: story.imageUrl ? `url(${story.imageUrl})` : defaultBackground,
                 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                
                <div className="absolute top-4 left-4 flex items-center z-10">
                    <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full border-2 border-white" />
                    <span className="ml-2 font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{author.name}</span>
                </div>
                
                <button onClick={onClose} className="absolute top-2 right-2 text-white text-3xl font-bold z-10" aria-label="Close story viewer">&times;</button>
                
                <p className="text-white text-3xl font-bold z-10" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                    {story.content}
                </p>
                
                {currentUser.id !== author.id && (
                    <form onSubmit={handleSendReply} className="absolute bottom-4 left-4 right-4 z-20 flex items-center space-x-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`回覆 ${author.name}...`}
                            className="flex-grow p-3 bg-black/50 text-white border border-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-300"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                            type="submit" 
                            disabled={!replyText.trim()}
                            className="bg-white/30 text-white rounded-full p-3 disabled:opacity-50 hover:bg-white/50 transition-colors"
                            aria-label="Send reply"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Icon name="send" className="w-6 h-6"/>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StoryViewerModal;