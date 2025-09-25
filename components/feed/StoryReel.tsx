import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

interface StoryReelProps {
    onStoryClick: (storyId: string) => void;
}

const StoryReel: React.FC<StoryReelProps> = ({ onStoryClick }) => {
    const { stories, users, setCreateModalOpen } = useContext(AppContext);
    
    // Stories last for one week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeStories = stories.filter(story => story.createdAt > oneWeekAgo);

    return (
        <div className="w-full p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                 <div className="flex-shrink-0 text-center">
                    <button 
                      onClick={() => setCreateModalOpen(true)}
                      className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400"
                      aria-label="Create new content"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <p className="text-xs mt-1">新增</p>
                </div>
                {activeStories.map(story => {
                    const author = users.find(u => u.id === story.authorId);
                    if (!author) return null;
                    return (
                        <div key={story.id} className="flex-shrink-0 text-center">
                            <button onClick={() => onStoryClick(story.id)} className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 block" aria-label={`View ${author.name}'s story`}>
                                <img
                                    src={author.avatarUrl}
                                    alt={author.name}
                                    className="w-full h-full rounded-full border-2 border-white dark:border-black object-cover"
                                />
                            </button>
                            <p className="text-xs mt-1 truncate w-16">{author.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StoryReel;