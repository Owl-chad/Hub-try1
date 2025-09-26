import React, { useContext, useState, useRef, useMemo } from 'react';
import { PostStatus } from '../../types';
import { AppContext } from '../../context/AppContext';
import Icon from '../ui/Icon';

const getStatusPill = (post) => {
    const isQuestion = post.title.endsWith('?') || post.title.endsWith('？');

    if (isQuestion && post.status === PostStatus.InDiscussion) {
        return (
            React.createElement('span', { className: `px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200` },
                "問題集思廣益"
            )
        );
    }

    const statusStyles = {
        [PostStatus.InDiscussion]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [PostStatus.Confirmed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        [PostStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        [PostStatus.Reconsiderable]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return (
        React.createElement('span', { className: `px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusStyles[post.status]}` },
            post.status
        )
    );
};


const PostCard = ({ post }) => {
    const { users, currentUser, toggleLike, addComment, setEditingPost } = useContext(AppContext);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const commentInputRef = useRef(null);
    const author = users.find(u => u.id === post.authorId);
    const isLiked = post.likes.includes(currentUser.id);

    const handleCommentSubmit = (e) => {
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

    const handleReplyClick = (commentId) => {
        setReplyingTo(commentId);
        if (!showComments) {
            setShowComments(true);
        }
        setTimeout(() => commentInputRef.current?.focus(), 0);
    };

    const commentsByParent = useMemo(() => {
        const map = { root: [] };
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

    const CommentView = ({ comment }) => {
        const commentAuthor = users.find(u => u.id === comment.authorId);
        const replies = commentsByParent[comment.id] || [];
        if (!commentAuthor) return null;

        return (
            React.createElement('div', { className: "flex items-start space-x-2" },
                React.createElement('img', { src: commentAuthor.avatarUrl, alt: commentAuthor.name, className: "w-6 h-6 rounded-full mt-0.5" }),
                React.createElement('div', { className: "flex-1" },
                    React.createElement('p', null,
                        React.createElement('span', { className: "font-semibold mr-1" }, commentAuthor.name),
                        React.createElement('span', null, comment.text)
                    ),
                    React.createElement('div', { className: "flex items-center space-x-3 text-xs text-gray-400" },
                        React.createElement('span', null, new Date(comment.createdAt).toLocaleDateString()),
                        React.createElement('button', { onClick: () => handleReplyClick(comment.id), className: "font-semibold hover:underline" }, "回覆")
                    ),
                    
                    replies.length > 0 && (
                        React.createElement('div', { className: "mt-2 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700" },
                            replies.map(reply => (
                                React.createElement(CommentView, { key: reply.id, comment: reply })
                            ))
                        )
                    )
                )
            )
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
        React.createElement('div', { className: "bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800" },
            React.createElement('div', { className: "flex items-center justify-between p-3" },
                React.createElement('div', { className: "flex items-center min-w-0" },
                    React.createElement('img', { src: author.avatarUrl, alt: author.name, className: "w-8 h-8 rounded-full" }),
                    React.createElement('span', { className: "ml-3 font-semibold text-sm truncate" }, author.name)
                ),
                React.createElement('div', { className: "flex items-center space-x-2 flex-shrink-0" },
                    getStatusPill(post),
                    currentUser.id === post.authorId &&
                        React.createElement('button', { onClick: () => setEditingPost(post), "aria-label": "Edit post" },
                            React.createElement(Icon, { name: "edit", className: "w-5 h-5 text-gray-500 dark:text-gray-400" })
                        )
                )
            ),
            
            React.createElement('img', { src: post.imageUrl, alt: post.title, className: "w-full h-auto" }),

            React.createElement('div', { className: "p-3" },
                React.createElement('div', { className: "flex items-center space-x-4" },
                    React.createElement('button', { onClick: () => toggleLike(post.id), "aria-label": isLiked ? 'Unlike post' : 'Like post' },
                        React.createElement(Icon, { name: "heart", isFilled: isLiked, className: `w-7 h-7 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}` })
                    ),
                    React.createElement('button', { onClick: handleCommentIconClick, "aria-label": "Comment on post" },
                        React.createElement(Icon, { name: "comment", className: "w-7 h-7 text-gray-500 dark:text-gray-400" })
                    )
                ),

                React.createElement('div', { className: "mt-2 text-sm" },
                    React.createElement('span', { className: "font-semibold" }, `${post.likes.length} 個讚`)
                ),
                
                React.createElement('div', { className: "mt-1 text-sm" },
                    React.createElement('p', null,
                        React.createElement('span', { className: "font-semibold mr-2" }, author.name),
                        React.createElement('span', { className: "font-bold text-base" }, post.title)
                    ),
                    React.createElement('p', { className: "text-gray-600 dark:text-gray-300 whitespace-pre-wrap" }, post.content)
                ),

                hasAnalysis && (
                    React.createElement('div', { className: "mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg" },
                        React.createElement('h4', { className: "font-bold text-sm mb-2" }, "團隊分析"),
                        React.createElement('div', { className: "space-y-2 text-sm" },
                            Object.entries(post.analysis || {}).map(([role, text]) => (
                                text && (
                                    React.createElement('div', { key: role },
                                        React.createElement('p', { className: "font-semibold text-gray-700 dark:text-gray-300" }, role),
                                        React.createElement('p', { className: "text-gray-600 dark:text-gray-400 whitespace-pre-wrap" }, text)
                                    )
                                )
                            ))
                        )
                    )
                ),

                post.comments.length > 0 ? (
                    React.createElement('button', { onClick: () => setShowComments(!showComments), className: "mt-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" },
                        showComments ? "隱藏留言" : `查看全部 ${post.comments.length} 則留言`
                    )
                ) : (
                    React.createElement('div', { className: "mt-2 text-sm text-gray-400" }, "尚無留言")
                ),
                
                showComments && (
                     React.createElement('div', { className: "mt-2 text-sm space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar" },
                        (commentsByParent['root'] || []).map(comment => (
                            React.createElement(CommentView, { key: comment.id, comment: comment })
                        ))
                    )
                ),

                React.createElement('form', { onSubmit: handleCommentSubmit, className: "mt-2 flex items-center" },
                    replyingTo && (
                        React.createElement('button', 
                            { 
                                type: "button", 
                                onClick: handleCancelReply, 
                                className: "text-xs text-gray-500 mr-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0",
                                "aria-label": "Cancel reply"
                            },
                            "×"
                        )
                    ),
                    React.createElement('input',
                        {
                            ref: commentInputRef,
                            type: "text",
                            value: commentText,
                            onChange: (e) => setCommentText(e.target.value),
                            placeholder: placeholder,
                            className: "flex-grow bg-transparent text-sm focus:outline-none"
                        }
                    ),
                    React.createElement('button', { type: "submit", className: `text-sm font-semibold ${commentText.trim() ? 'text-blue-500' : 'text-blue-300 dark:text-blue-700'}`, disabled: !commentText.trim() }, "發佈")
                ),

                React.createElement('div', { className: "mt-2 text-xs text-gray-400 uppercase" },
                    new Date(post.createdAt).toLocaleDateString()
                )
            )
        )
    );
};

export default PostCard;
