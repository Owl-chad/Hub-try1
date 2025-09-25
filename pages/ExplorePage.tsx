import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ExplorePost from '../components/explore/ExplorePost';
import { PostStatus } from '../types';

const ExplorePage: React.FC = () => {
    const { posts } = useContext(AppContext);
    const [showRejected, setShowRejected] = useState(false);
    const projectPosts = posts.filter(p => p.tags.includes('project'));

    const activePosts = projectPosts.filter(
        p => p.status === PostStatus.InDiscussion || p.status === PostStatus.Confirmed
    );
    
    const rejectedPosts = projectPosts.filter(
        p => p.status === PostStatus.Rejected || p.status === PostStatus.Reconsiderable
    );

    return (
        <div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">探索專案點子</h2>
                <p className="text-sm text-gray-500">查看所有 #project 標籤的貼文，並取得 AI 輔助的回應建議。</p>
            </div>
            {activePosts.length > 0 ? (
                activePosts.map(post => <ExplorePost key={post.id} post={post} />)
            ) : (
                <div className="p-8 text-center text-gray-500">
                    目前沒有任何進行中的專案點子。
                </div>
            )}
            
            <div className="mt-6">
                <div className="p-4 border-y border-gray-200 dark:border-gray-800">
                    <button onClick={() => setShowRejected(!showRejected)} className="w-full text-left flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">廢案區</h2>
                            <p className="text-sm text-gray-500">查看已歸檔或暫緩的專案點子。</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${showRejected ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                {showRejected && (
                    <div>
                        {rejectedPosts.length > 0 ? (
                            rejectedPosts.map(post => <ExplorePost key={post.id} post={post} />)
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                廢案區是空的。
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;