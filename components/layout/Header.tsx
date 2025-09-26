
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Page } from '../../types';
import Icon from '../ui/Icon';

interface HeaderProps {
    onShowNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowNotifications }) => {
    const { currentUser, users, setCurrentUserId, notifications } = useContext(AppContext);

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUserId = event.target.value;
        const selectedUser = users.find(u => u.id === selectedUserId);
        if (selectedUser) {
            setCurrentUserId(selectedUserId);
        }
    };

    const unreadCount = notifications.filter(n => n.recipientId === currentUser.id && !n.read).length;

    return (
        <header className="w-full flex-shrink-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between h-14 px-4">
                <h1 className="text-2xl font-bold tracking-tighter">TeamSync Hub</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={onShowNotifications} className="relative" aria-label="View notifications">
                        <Icon name="heart" className="w-7 h-7 text-gray-600 dark:text-gray-300"/>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <select
                        value={currentUser.id}
                        onChange={handleUserChange}
                        className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-md p-1 text-sm border-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Switch current user"
                    >
                        {users.map((user: User) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;
