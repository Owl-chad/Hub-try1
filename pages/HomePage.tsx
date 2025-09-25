
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import StoryReel from '../components/feed/StoryReel';
import PostCard from '../components/feed/PostCard';
import StoryViewerModal from '../components/modals/StoryViewerModal';
import { Post, PostStatus } from '../types';

const HomePage: React.FC = () => {
    const { posts, stories } = useContext(AppContext);
    const [viewingStoryId, setViewingStoryId] = useState<string | null>(null);

    const viewingStory = stories.find(s => s.id === viewingStoryId);

    const handleStoryClick = (storyId: string) => {
        setViewingStoryId(storyId);
    };

    const handleCloseStory = () => {
        setViewingStoryId(null);
    };
    
    const sortedPosts = useMemo(() => {
        const getPostCategory = (post: Post): number => {
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
        <div>
            <StoryReel onStoryClick={handleStoryClick} />
            <div className="flex flex-col">
                {sortedPosts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
            {viewingStory && (
                <StoryViewerModal 
                    story={viewingStory}
                    onClose={handleCloseStory}
                />
            )}
        </div>
    );
};

export default HomePage;
