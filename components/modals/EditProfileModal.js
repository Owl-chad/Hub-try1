import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import Icon from '../ui/Icon';

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const EditProfileModal = ({ onClose }) => {
  const { currentUser, updateUser } = useContext(AppContext);
  const [name, setName] = useState(currentUser.name);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl); // This will now be the preview URL
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalAvatarUrl = avatarUrl;
    if (selectedFile) {
      finalAvatarUrl = await fileToBase64(selectedFile);
    }

    updateUser(currentUser.id, name.trim(), finalAvatarUrl);
    onClose();
  };

  return (
    React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" },
      React.createElement('div', { className: "bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-md flex flex-col relative" },
        React.createElement('header', { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700" },
          React.createElement('h2', { className: "text-lg font-bold" }, "編輯個人資料"),
          React.createElement('button', { onClick: onClose, className: "text-gray-500 text-2xl", "aria-label": "Close edit profile modal" }, "×")
        ),
        
        React.createElement('form', { onSubmit: handleSubmit, className: "flex-grow flex flex-col p-4" },
          React.createElement('div', { className: "space-y-4" },
            React.createElement('div', { className: "text-center" },
                React.createElement('button',
                    {
                        type: "button",
                        onClick: handleAvatarClick,
                        className: "relative w-24 h-24 rounded-full mx-auto group",
                        "aria-label": "Change avatar"
                    },
                    React.createElement('img', { src: avatarUrl || 'https://picsum.photos/seed/placeholder/100/100', alt: "Avatar Preview", className: "w-24 h-24 rounded-full object-cover border-2 border-gray-300 group-hover:opacity-60 transition-opacity" }),
                    React.createElement('div', { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity" },
                        React.createElement(Icon, { name: "upload", className: "w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" })
                    )
                ),
                React.createElement('input',
                    {
                        type: "file",
                        accept: "image/*",
                        ref: fileInputRef,
                        onChange: handleFileChange,
                        className: "hidden"
                    }
                )
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "edit-name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "姓名"),
              React.createElement('input',
                {
                  id: "edit-name",
                  type: "text",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  className: "w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md",
                  required: true
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

export default EditProfileModal;
