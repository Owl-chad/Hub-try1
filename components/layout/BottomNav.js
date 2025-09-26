import React from 'react';
import { Page } from '../../types';
import Icon from '../ui/Icon';

const BottomNav = ({ currentPage, onNavigate }) => {
    const navItems = [
        { page: Page.Home, icon: 'home' },
        { page: Page.Explore, icon: 'explore' },
        { page: Page.Messages, icon: 'messages' },
        { page: Page.Analysis, icon: 'dashboard' },
        { page: Page.Tools, icon: 'tools' },
    ];

    return (
        React.createElement('nav', { className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800" },
            React.createElement('div', { className: "flex justify-around items-center h-16" },
                navItems.map(item => (
                    React.createElement('button',
                        {
                            key: item.page,
                            onClick: () => onNavigate(item.page),
                            className: "flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        },
                        React.createElement(Icon, { name: item.icon, isFilled: currentPage === item.page, className: `w-7 h-7 ${currentPage === item.page ? 'text-black dark:text-white' : ''}` })
                    )
                ))
            )
        )
    );
};

export default BottomNav;
