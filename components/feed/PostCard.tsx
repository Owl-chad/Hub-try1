
import React, { useContext, useState, useRef, useMemo } from 'react';
import { Post, PostStatus, Comment } from '../../types';
import { AppContext } from '../../context/AppContext';
import Icon from '../ui/Icon';

interface PostCardProps {
    post: Post;
}

const getStatusPill = (post: Post) => {
    const isQuestion = post.title.endsWith('?') || post.title.endsWith('？');

    if (isQuestion && post.status === PostStatus.InDiscussion) {
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`}>
                問題集思廣益
            </span>
        );
    }

    const statusStyles: Record<PostStatus, string> = {
        [PostStatus.InDiscussion]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [PostStatus.Confirmed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        [PostStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        [PostStatus.Reconsiderable]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusStyles[post.status]}`}>
            {post.status}
        </span>
    );
};


const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { users, currentUser, toggleLike, addComment, setEditingPost } = useContext(AppContext);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const commentInputRef = useRef<HTMLInputElement>(null);
    const author = users.find(u => u.id === post.authorId);
    const isLiked = post.likes.includes(currentUser.id);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            addComment(post.id, commentText, replyingTo || undefined);
            setCommentText('');
            setReplyingTo(null);
        }
    };
    
    const handleCommentIconClick = () => {
        if (!showComments) {
            setShowComments(true);
        }
        setReplyingTo(null);
        setTimeout(() => commentInputRef.current?.focus(), 0);
    };

    const handleReplyClick = (commentId: string) => {
        setReplyingTo(commentId);
        if (!showComments) {
            setShowComments(true);
        }
        setTimeout(() => commentInputRef.current?.focus(), 0);
    };

    const commentsByParent = useMemo(() => {
        const map: Record<string, Comment[]> = { root: [] };
        post.comments.forEach(comment => {
            const parent = comment.parentId || 'root';
            if (!map[parent]) {
                map[parent] = [];
            }
            map[parent].push(comment);
        });
        Object.values(map).forEach(commentList => {
            commentList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });
        return map;
    }, [post.comments]);

    const CommentView: React.FC<{ comment: Comment }> = ({ comment }) => {
        const commentAuthor = users.find(u => u.id === comment.authorId);
        const replies = commentsByParent[comment.id] || [];
        if (!commentAuthor) return null;

        return (
            <div className="flex items-start space-x-2">
                <img src={commentAuthor.avatarUrl} alt={commentAuthor.name} className="w-6 h-6 rounded-full mt-0.5" />
                <div className="flex-1">
                    <p>
                        <span className="font-semibold mr-1">{commentAuthor.name}</span>
                        <span>{comment.text}</span>
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        <button onClick={() => handleReplyClick(comment.id)} className="font-semibold hover:underline">回覆</button>
                    </div>
                    
                    {replies.length > 0 && (
                        <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                            {replies.map(reply => (
                                <CommentView key={reply.id} comment={reply} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!author) return null;

    const handleCancelReply = () => {
        setReplyingTo(null);
        commentInputRef.current?.focus();
    };

    const hasAnalysis = post.analysis && Object.keys(post.analysis).length > 0;
    const replyingToComment = replyingTo ? post.comments.find(c => c.id === replyingTo) : null;
    const replyingToUser = replyingToComment ? users.find(u => u.id === replyingToComment.authorId) : null;
    const placeholder = replyingToUser ? `回覆 ${replyingToUser.name}...` : "新增留言...";

    return (
        <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center min-w-0">
                    <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full" />
                    <span className="ml-3 font-semibold text-sm truncate">{author.name}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {getStatusPill(post)}
                    {currentUser.id === post.authorId &&
                        <button onClick={() => setEditingPost(post)} aria-label="Edit post">
                            <Icon name="edit" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    }
                </div>
            </div>
            
            <img src={post.imageUrl} alt={post.title} className="w-full h-auto" />

            <div className="p-3">
                <div className="flex items-center space-x-4">
                    <button onClick={() => toggleLike(post.id)} aria-label={isLiked ? 'Unlike post' : 'Like post'}>
                        <Icon name="heart" isFilled={isLiked} className={`w-7 h-7 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
                    </button>
                    <button onClick={handleCommentIconClick} aria-label="Comment on post">
                        <Icon name="comment" className="w-7 h-7 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="mt-2 text-sm">
                    <span className="font-semibold">{post.likes.length} 個讚</span>
                </div>
                
                <div className="mt-1 text-sm">
                    <p>
                        <span className="font-semibold mr-2">{author.name}</span>
                        <span className="font-bold text-base">{post.title}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
                </div>

                {hasAnalysis && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <h4 className="font-bold text-sm mb-2">團隊分析</h4>
                        <div className="space-y-2 text-sm">
                            {Object.entries(post.analysis || {}).map(([role, text]) => (
                                text && (
                                    <div key={role}>
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">{role}</p>
                                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{text}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {post.comments.length > 0 ? (
                    <button onClick={() => setShowComments(!showComments)} className="mt-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {showComments ? "隱藏留言" : `查看全部 ${post.comments.length} 則留言`}
                    </button>
                ) : (
                    <div className="mt-2 text-sm text-gray-400">尚無留言</div>
                )}
                
                {showComments && (
                     <div className="mt-2 text-sm space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {(commentsByParent['root'] || []).map(comment => (
                            <CommentView key={comment.id} comment={comment} />
                        ))}
                    </div>
                )}

                <form onSubmit={handleCommentSubmit} className="mt-2 flex items-center">
                    {replyingTo && (
                        <button 
                            type="button" 
                            onClick={handleCancelReply} 
                            className="text-xs text-gray-500 mr-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"
                            aria-label="Cancel reply"
                        >
                            &times;
                        </button>
                    )}
                    <input
                        ref={commentInputRef}
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={placeholder}
                        className="flex-grow bg-transparent text-sm focus:outline-none"
                    />
                    <button type="submit" className={`text-sm font-semibold ${commentText.trim() ? 'text-blue-500' : 'text-blue-300 dark:text-blue-700'}`} disabled={!commentText.trim()}>發佈</button>
                </form>

                <div className="mt-2 text-xs text-gray-400 uppercase">
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default PostCard;