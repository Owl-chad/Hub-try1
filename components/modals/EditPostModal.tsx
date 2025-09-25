
import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Post } from '../../types';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose }) => {
  const { updatePost } = useContext(AppContext);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    updatePost(post.id, title, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-md flex flex-col relative">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">編輯貼文</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl" aria-label="Close edit modal">&times;</button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">標題</label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">內容</label>
              <textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 font-semibold">儲存變更</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
