import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { generateCreativeText } from '../../services/geminiService';
import Icon from '../ui/Icon';

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const CreatePostModal = ({ onClose }) => {
  const { addPost, addStory } = useContext(AppContext);
  const [postType, setPostType] = useState('post');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [storyContent, setStoryContent] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleAIAssist = async () => {
    setIsGenerating(true);
    let generatedText = '';
    if (postType === 'post' && content) {
        generatedText = await generateCreativeText('post_title', content);
        setTitle(generatedText);
    } else if (postType === 'qna' && title) {
        generatedText = await generateCreativeText('qna_question', title);
        setTitle(generatedText);
    } else if (postType === 'story' && storyContent) {
        generatedText = await generateCreativeText('story_content', storyContent);
        setStoryContent(generatedText);
    }
    setIsGenerating(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = previewUrl;
    if (selectedFile) {
        finalImageUrl = await fileToBase64(selectedFile);
    }

    if (postType === 'post') {
        if (!title || !content) return;
        const tags = content.toLowerCase().includes('#project') ? ['project'] : [];
        addPost({ title, content, imageUrl: finalImageUrl || `https://picsum.photos/seed/${title}/600/600`, tags });
    } else if (postType === 'qna') {
        if (!title) return;
        addPost({ title, content, imageUrl: finalImageUrl || `https://picsum.photos/seed/${title}/600/600`, tags: ['qna', 'project'] });
    } else { // story
        if (!storyContent) return;
        addStory({ content: storyContent, imageUrl: finalImageUrl });
    }
    onClose();
  };
  
  const renderInputs = () => {
      const commonAIAssistButton = (
        React.createElement('button', { type: "button", onClick: handleAIAssist, disabled: isGenerating, className: "px-3 py-1.5 bg-purple-500 text-white rounded-md text-xs disabled:bg-purple-300 flex items-center space-x-1" },
            React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M12 3v2.355a4 4 0 0 1 0 7.29v2.355m0 5V21" }), React.createElement('path', { d: "M2.345 6.691l1.64 1.64m16.03 0l-1.64-1.64m-14.39 12.26l1.64-1.64m12.75 0l-1.64 1.64M18 12h-2.355a4 4 0 0 0-7.29 0H6" })),
            React.createElement('span', null, isGenerating ? '生成中' : 'AI 概括')
        )
      );

      switch (postType) {
          case 'post':
              return (
                  React.createElement('div', { className: "space-y-3 p-4" },
                      React.createElement('div', { className: "flex items-center space-x-2" },
                        React.createElement('input', { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "點子標題...", className: "flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-md" }),
                        commonAIAssistButton
                      ),
                      React.createElement('textarea', { value: content, onChange: (e) => setContent(e.target.value), placeholder: "詳細內容... (加上 #project 來標記為專案)", rows: 4, className: "w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none" })
                  )
              );
          case 'qna':
              return (
                  React.createElement('div', { className: "space-y-3 p-4" },
                      React.createElement('div', { className: "flex items-center space-x-2" },
                         React.createElement('input', { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "你的問題... (自動標記為 #project)", className: "flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-md" }),
                         commonAIAssistButton
                      ),
                      React.createElement('textarea', { value: content, onChange: (e) => setContent(e.target.value), placeholder: "提供一些背景資訊 (選填)", rows: 4, className: "w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none" })
                  )
              );
          case 'story':
              return (
                  React.createElement('div', { className: "space-y-3 p-4" },
                       React.createElement('div', { className: "flex items-center space-x-2" },
                          React.createElement('textarea', { value: storyContent, onChange: (e) => setStoryContent(e.target.value), placeholder: "靈光一閃的點子...", rows: 4, className: "w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none" }),
                          commonAIAssistButton
                        )
                  )
              );
      }
  };

  const TabButton = ({ type, name, icon }) => (
    React.createElement('button', { type: "button", onClick: () => setPostType(type), className: `flex-1 flex flex-col items-center p-2 text-sm font-medium ${postType === type ? 'text-blue-500' : 'text-gray-400'}` },
        React.createElement(Icon, { name: icon, isFilled: postType === type, className: "w-6 h-6 mb-1" }),
        name
    )
  );

  return (
    React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" },
      React.createElement('div', { className: "bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-md h-[90vh] flex flex-col relative" },
        React.createElement('header', { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700" },
            React.createElement('h2', { className: "text-lg font-bold" }, "建立新的內容"),
            React.createElement('button', { onClick: onClose, className: "text-gray-500 text-2xl", "aria-label": "Close create modal" }, "×")
        ),
        
        React.createElement('form', { onSubmit: handleSubmit, className: "flex-grow flex flex-col" },
          React.createElement('div', 
            { 
              onClick: handleFileSelect, 
              className: "h-64 flex-shrink-0 bg-gray-100 dark:bg-gray-800 m-4 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
            },
            previewUrl ? (
                React.createElement('img', { src: previewUrl, alt: "Preview", className: "w-full h-full object-cover" })
            ) : (
                React.createElement('div', { className: "text-center text-gray-400" },
                    React.createElement(Icon, { name: "upload", className: "w-12 h-12 mx-auto" }),
                    React.createElement('p', null, "從圖庫選擇")
                )
            )
          ),
          React.createElement('input', { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleFileChange, className: "hidden" }),
          
          React.createElement('div', { className: "flex-grow overflow-y-auto" },
            renderInputs()
          ),
          
          React.createElement('div', { className: "p-4" },
            React.createElement('button', { type: "submit", className: "w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 font-semibold" }, "發佈")
          )
        ),

        React.createElement('footer', { className: "flex border-t border-gray-200 dark:border-gray-700" },
            React.createElement(TabButton, { type: "post", name: "貼文", icon: "add" }),
            React.createElement(TabButton, { type: "qna", name: "問題回答", icon: "question" }),
            React.createElement(TabButton, { type: "story", name: "靈機一動", icon: "lightbulb" })
        )
      )
    )
  );
};

export default CreatePostModal;
