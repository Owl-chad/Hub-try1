
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Icon from '../components/ui/Icon';

const NotificationsPage: React.FC = () => {
    const { notifications, users, currentUser, posts, markNotificationsAsRead } = useContext(AppContext);

    const userNotifications = notifications.filter(n => n.recipientId === currentUser.id);

    useEffect(() => {
        const timer = setTimeout(() => {
            markNotificationsAsRead();
        }, 2000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userNotifications.length]);

    return (
        <div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">通知</h2>
            </div>
            {userNotifications.length === 0 ? (
                <p className="p-8 text-center text-gray-500">目前沒有任何通知。</p>
            ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {userNotifications.map(notification => {
                        const actor = users.find(u => u.id === notification.actorId);
                        const post = posts.find(p => p.id === notification.postId);
                        if (!actor || !post) return null;

                        const message = notification.type === 'like' 
                            ? `對你的貼文 "${post.title}" 表示讚。`
                            : `在你的貼文 "${post.title}" 留言：「${notification.commentText}」`;

                        return (
                            <li key={notification.id} className={`p-4 flex items-start space-x-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                <img src={actor.avatarUrl} alt={actor.name} className="w-10 h-10 rounded-full" />
                                <div className="flex-grow">
                                    <p className="text-sm">
                                        <span className="font-semibold">{actor.name}</span> {message}
                                    </p>
                                    <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
                                </div>
                                <img src={post.imageUrl} alt="post" className="w-12 h-12 object-cover rounded-md"/>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default NotificationsPage;
