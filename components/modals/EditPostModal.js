import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const EditPostModal = ({ post, onClose }) => {
  const { updatePost } = useContext(AppContext);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    updatePost(post.id, title, content);
    onClose();
  };

  return (
    React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" },
      React.createElement('div', { className: "bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-md flex flex-col relative" },
        React.createElement('header', { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700" },
          React.createElement('h2', { className: "text-lg font-bold" }, "編輯貼文"),
          React.createElement('button', { onClick: onClose, className: "text-gray-500 text-2xl", "aria-label": "Close edit modal" }, "×")
        ),
        
        React.createElement('form', { onSubmit: handleSubmit, className: "flex-grow flex flex-col p-4" },
          React.createElement('div', { className: "space-y-4" },
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "edit-title", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "標題"),
              React.createElement('input',
                {
                  id: "edit-title",
                  type: "text",
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  className: "w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                }
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "edit-content", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "內容"),
              React.createElement('textarea',
                {
                  id: "edit-content",
                  value: content,
                  onChange: (e) => setContent(e.target.value),
                  rows: 6,
                  className: "w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none"
                }
              )
            )
          ),
          
          React.createElement('div', { className: "mt-6" },
            React.createElement('button', { type: "submit", className: "w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 font-semibold" }, "儲存變更")
          )
        )
      )
    )
  );
};

export default EditPostModal;
