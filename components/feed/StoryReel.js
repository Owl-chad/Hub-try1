import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const StoryReel = ({ onStoryClick }) => {
    const { stories, users, setCreateModalOpen } = useContext(AppContext);
    
    // Stories last for one week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeStories = stories.filter(story => story.createdAt > oneWeekAgo);

    return (
        React.createElement('div', { className: "w-full p-4 border-b border-gray-200 dark:border-gray-800" },
            React.createElement('div', { className: "flex items-center space-x-4 overflow-x-auto pb-2" },
                 React.createElement('div', { className: "flex-shrink-0 text-center" },
                    React.createElement('button', 
                      {
                        onClick: () => setCreateModalOpen(true),
                        className: "w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400",
                        "aria-label": "Create new content"
                      },
                      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-gray-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" })
                      )
                    ),
                    React.createElement('p', { className: "text-xs mt-1" }, "新增")
                ),
                activeStories.map(story => {
                    const author = users.find(u => u.id === story.authorId);
                    if (!author) return null;
                    return (
                        React.createElement('div', { key: story.id, className: "flex-shrink-0 text-center" },
                            React.createElement('button', { onClick: () => onStoryClick(story.id), className: "w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 block", "aria-label": `View ${author.name}'s story` },
                                React.createElement('img',
                                    {
                                        src: author.avatarUrl,
                                        alt: author.name,
                                        className: "w-full h-full rounded-full border-2 border-white dark:border-black object-cover"
                                    }
                                )
                            ),
                            React.createElement('p', { className: "text-xs mt-1 truncate w-16" }, author.name)
                        )
                    );
                })
            )
        )
    );
};

export default StoryReel;
