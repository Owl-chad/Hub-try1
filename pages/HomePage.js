import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import StoryReel from '../components/feed/StoryReel';
import PostCard from '../components/feed/PostCard';
import StoryViewerModal from '../components/modals/StoryViewerModal';
import { PostStatus } from '../types';

const HomePage = () => {
    const { posts, stories } = useContext(AppContext);
    const [viewingStoryId, setViewingStoryId] = useState(null);

    const viewingStory = stories.find(s => s.id === viewingStoryId);

    const handleStoryClick = (storyId) => {
        setViewingStoryId(storyId);
    };

    const handleCloseStory = () => {
        setViewingStoryId(null);
    };
    
    const sortedPosts = useMemo(() => {
        const getPostCategory = (post) => {
            const isQuestion = post.title.endsWith('?') || post.title.endsWith('？');
            
            if (post.status === PostStatus.Confirmed) return 1;
            if (post.status === PostStatus.InDiscussion) {
                return isQuestion ? 3 : 2;
            }
            if (isQuestion) return 3;
            
            if (post.status === PostStatus.Reconsiderable) return 4;
            if (post.status === PostStatus.Rejected) return 5;

            return 99; // Default for any other case
        };

        return [...posts].sort((a, b) => {
            const categoryA = getPostCategory(a);
            const categoryB = getPostCategory(b);
            if (categoryA !== categoryB) {
                return categoryA - categoryB;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [posts]);

    return (
        React.createElement('div', null,
            React.createElement(StoryReel, { onStoryClick: handleStoryClick }),
            React.createElement('div', { className: "flex flex-col" },
                sortedPosts.map(post => React.createElement(PostCard, { key: post.id, post: post }))
            ),
            viewingStory && (
                React.createElement(StoryViewerModal, 
                    { 
                        story: viewingStory,
                        onClose: handleCloseStory
                    }
                )
            )
        )
    );
};

export default HomePage;
