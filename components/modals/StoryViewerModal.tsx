import React, { useContext } from 'react';
import { Story } from '../../types';
import { AppContext } from '../../context/AppContext';

interface StoryViewerModalProps {
  story: Story;
  onClose: () => void;
}

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ story, onClose }) => {
    const { users } = useContext(AppContext);
    const author = users.find(u => u.id === story.authorId);

    // Basic gradient for stories without images
    const defaultBackground = 'linear-gradient(to bottom, #4a90e2, #9013fe)';

    if (!author) return null;

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
            </div>
        </div>
    );
};

export default StoryViewerModal;