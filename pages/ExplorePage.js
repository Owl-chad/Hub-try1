import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ExplorePost from '../components/explore/ExplorePost';
import { PostStatus } from '../types';

const ExplorePage = () => {
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
        React.createElement('div', null,
            React.createElement('div', { className: "p-4 border-b border-gray-200 dark:border-gray-800" },
                React.createElement('h2', { className: "text-xl font-bold" }, "探索專案點子"),
                React.createElement('p', { className: "text-sm text-gray-500" }, "查看所有 #project 標籤的貼文，並取得 AI 輔助的回應建議。")
            ),
            activePosts.length > 0 ? (
                activePosts.map(post => React.createElement(ExplorePost, { key: post.id, post: post }))
            ) : (
                React.createElement('div', { className: "p-8 text-center text-gray-500" },
                    "目前沒有任何進行中的專案點子。"
                )
            ),
            
            React.createElement('div', { className: "mt-6" },
                React.createElement('div', { className: "p-4 border-y border-gray-200 dark:border-gray-800" },
                    React.createElement('button', { onClick: () => setShowRejected(!showRejected), className: "w-full text-left flex justify-between items-center" },
                        React.createElement('div', null,
                            React.createElement('h2', { className: "text-xl font-bold" }, "廢案區"),
                            React.createElement('p', { className: "text-sm text-gray-500" }, "查看已歸檔或暫緩的專案點子。")
                        ),
                        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: `h-6 w-6 transition-transform ${showRejected ? 'rotate-180' : ''}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                           React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
                        )
                    )
                ),
                showRejected && (
                    React.createElement('div', null,
                        rejectedPosts.length > 0 ? (
                            rejectedPosts.map(post => React.createElement(ExplorePost, { key: post.id, post: post }))
                        ) : (
                            React.createElement('div', { className: "p-8 text-center text-gray-500" },
                                "廢案區是空的。"
                            )
                        )
                    )
                )
            )
        )
    );
};

export default ExplorePage;
