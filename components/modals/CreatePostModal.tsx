
import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { generateCreativeText } from '../../services/geminiService';
import Icon from '../ui/Icon';

interface CreatePostModalProps {
  onClose: () => void;
}

type PostType = 'post' | 'qna' | 'story';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const { addPost, addStory } = useContext(AppContext);
  const [postType, setPostType] = useState<PostType>('post');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [storyContent, setStoryContent] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
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
        <button type="button" onClick={handleAIAssist} disabled={isGenerating} className="px-3 py-1.5 bg-purple-500 text-white rounded-md text-xs disabled:bg-purple-300 flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v2.355a4 4 0 0 1 0 7.29v2.355m0 5V21"/><path d="M2.345 6.691l1.64 1.64m16.03 0l-1.64-1.64m-14.39 12.26l1.64-1.64m12.75 0l-1.64 1.64M18 12h-2.355a4 4 0 0 0-7.29 0H6"/></svg>
            <span>{isGenerating ? '生成中' : 'AI 概括'}</span>
        </button>
      );

      switch (postType) {
          case 'post':
              return (
                  <div className="space-y-3 p-4">
                      <div className="flex items-center space-x-2">
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="點子標題..." className="flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-md" />
                        {commonAIAssistButton}
                      </div>
                      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="詳細內容... (加上 #project 來標記為專案)" rows={4} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none" />
                  </div>
              );
          case 'qna':
              return (
                  <div className="space-y-3 p-4">
                      <div className="flex items-center space-x-2">
                         <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="你的問題... (自動標記為 #project)" className="flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-md" />
                         {commonAIAssistButton}
                      </div>
                      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="提供一些背景資訊 (選填)" rows={4} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none" />
                  </div>
              );
          case 'story':
              return (
                  <div className="space-y-3 p-4">
                       <div className="flex items-center space-x-2">
                          <textarea value={storyContent} onChange={(e) => setStoryContent(e.target.value)} placeholder="靈光一閃的點子..." rows={4} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md resize-none" />
                          {commonAIAssistButton}
                        </div>
                  </div>
              );
      }
  };

  const TabButton: React.FC<{ type: PostType; name: string; icon: any; }> = ({ type, name, icon }) => (
    <button type="button" onClick={() => setPostType(type)} className={`flex-1 flex flex-col items-center p-2 text-sm font-medium ${postType === type ? 'text-blue-500' : 'text-gray-400'}`}>
        <Icon name={icon} isFilled={postType === type} className="w-6 h-6 mb-1" />
        {name}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-md h-[90vh] flex flex-col relative">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold">建立新的內容</h2>
            <button onClick={onClose} className="text-gray-500 text-2xl" aria-label="Close create modal">&times;</button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <div 
            onClick={handleFileSelect} 
            className="h-64 flex-shrink-0 bg-gray-100 dark:bg-gray-800 m-4 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-gray-400">
                    <Icon name="upload" className="w-12 h-12 mx-auto" />
                    <p>從圖庫選擇</p>
                </div>
            )}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          
          <div className="flex-grow overflow-y-auto">
            {renderInputs()}
          </div>
          
          <div className="p-4">
            <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 font-semibold">發佈</button>
          </div>
        </form>

        <footer className="flex border-t border-gray-200 dark:border-gray-700">
            <TabButton type="post" name="貼文" icon="add" />
            <TabButton type="qna" name="問題回答" icon="question" />
            <TabButton type="story" name="靈機一動" icon="lightbulb" />
        </footer>
      </div>
    </div>
  );
};

export default CreatePostModal;
