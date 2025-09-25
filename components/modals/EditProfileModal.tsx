
import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import Icon from '../ui/Icon';

interface EditProfileModalProps {
  onClose: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateUser } = useContext(AppContext);
  const [name, setName] = useState(currentUser.name);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl); // This will now be the preview URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-md flex flex-col relative">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">編輯個人資料</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl" aria-label="Close edit profile modal">&times;</button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col p-4">
          <div className="space-y-4">
            <div className="text-center">
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="relative w-24 h-24 rounded-full mx-auto group"
                    aria-label="Change avatar"
                >
                    <img src={avatarUrl || 'https://picsum.photos/seed/placeholder/100/100'} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity">
                        <Icon name="upload" className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                required
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

export default EditProfileModal;
