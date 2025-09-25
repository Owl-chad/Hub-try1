
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Conversation, User } from '../types';
import Icon from '../components/ui/Icon';

const getConversationId = (id1: string, id2: string): string => {
    if (id1 === id2) return `notepad_${id1}`;
    return [id1, id2].sort().join('_');
};

const MessagesPage: React.FC = () => {
  const { conversations, users, currentUser, sendMessage } = useContext(AppContext);
  const [activeChatId, setActiveChatId] = useState<string>('notepad'); // 'notepad' or a userId
  const [messageText, setMessageText] = useState('');

  const otherUsers = useMemo(() => users.filter(u => u.id !== currentUser.id), [users, currentUser]);

  const { currentConversation, otherParticipant } = useMemo(() => {
    let convId: string;
    let participant: User | undefined;

    if (activeChatId === 'notepad') {
        convId = getConversationId(currentUser.id, currentUser.id);
        participant = currentUser;
    } else {
        convId = getConversationId(currentUser.id, activeChatId);
        participant = users.find(u => u.id === activeChatId);
    }
    const conversation = conversations.find(c => c.id === convId);
    return { currentConversation: conversation, otherParticipant: participant };
  }, [activeChatId, conversations, currentUser, users]);

  const handleSend = () => {
    if (messageText.trim()) {
        const receiverId = activeChatId === 'notepad' ? currentUser.id : activeChatId;
        const conversationId = getConversationId(currentUser.id, receiverId);
        
        sendMessage(conversationId, {
            senderId: currentUser.id,
            receiverId: receiverId,
            text: messageText,
        });
        setMessageText('');
    }
  };

  const ConversationListItem: React.FC<{
    user?: User;
    isNotepad?: boolean;
    isActive: boolean;
    onClick: () => void;
  }> = ({ user, isNotepad = false, isActive, onClick }) => {
    const convId = isNotepad ? getConversationId(currentUser.id, currentUser.id) : getConversationId(currentUser.id, user!.id);
    const conversation = conversations.find(c => c.id === convId);
    const lastMessage = conversation?.messages[conversation.messages.length - 1];

    return (
      <button 
        onClick={onClick}
        className={`w-full text-left p-3 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        {isNotepad ? (
            <div className="w-10 h-10 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center">
                <Icon name="edit" className="w-5 h-5 text-yellow-800 dark:text-yellow-200" />
            </div>
        ) : (
            <img src={user!.avatarUrl} alt={user!.name} className="w-10 h-10 rounded-full" />
        )}
        <div>
            <p className="font-semibold">{isNotepad ? '記事本' : user!.name}</p>
            <p className="text-xs text-gray-500 truncate max-w-[100px]">{lastMessage?.text || '尚無訊息'}</p>
        </div>
      </button>
    );
  };
  
  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">訊息</h2>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
            <ConversationListItem
                isNotepad
                isActive={activeChatId === 'notepad'}
                onClick={() => setActiveChatId('notepad')}
            />
            {otherUsers.map(user => (
              <ConversationListItem
                key={user.id}
                user={user}
                isActive={activeChatId === user.id}
                onClick={() => setActiveChatId(user.id)}
              />
            ))}
        </div>
        <div className="w-2/3 flex flex-col">
          {otherParticipant ? (
            <>
              <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                <p className="font-semibold">{activeChatId === 'notepad' ? '記事本' : otherParticipant.name}</p>
              </div>
              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {currentConversation?.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-200 dark:border-gray-800 flex items-center space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="輸入訊息..."
                  className="flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none"
                />
                <button onClick={handleSend} className="bg-blue-500 text-white rounded-full p-2">
                    <Icon name="send" className="w-5 h-5"/>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              選擇一個對話開始
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;