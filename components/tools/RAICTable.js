import React, { useState } from 'react';
import { ALL_ROLES } from '../../types';
import Icon from '../ui/Icon';

const RAIC_TYPES = ['R', 'A', 'I', 'C', null];
const RAIC_COLORS = {
    'R': 'text-purple-500',
    'A': 'text-orange-500',
    'I': 'text-blue-500',
    'C': 'text-green-500',
};

const RAICCell = ({ value, onClick }) => {
    const colorClass = value ? RAIC_COLORS[value] : 'text-gray-400 dark:text-gray-500';
    return (
        React.createElement('td', { className: "border border-gray-300 dark:border-gray-700 text-center p-0" },
            React.createElement('button', { onClick: onClick, className: `w-full h-full p-2 font-bold text-lg transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800 ${colorClass}` },
                value || '·'
            )
        )
    );
};

const RAICTable = ({ entities, matrix, onUpdate, onAddEntity }) => {
    const [newEntityName, setNewEntityName] = useState('');

    const handleCellClick = (entityId, role, currentValue) => {
        const currentIndex = RAIC_TYPES.indexOf(currentValue);
        const nextValue = RAIC_TYPES[(currentIndex + 1) % RAIC_TYPES.length];
        onUpdate(entityId, role, nextValue);
    };

    const handleAddEntity = (e) => {
        e.preventDefault();
        if (newEntityName.trim()) {
            onAddEntity(newEntityName.trim());
            setNewEntityName('');
        }
    };
    
    return (
        React.createElement('div', { className: "p-4 overflow-x-auto" },
            React.createElement('div', { className: "w-full min-w-[700px]" },
                React.createElement('table', { className: "w-full border-collapse" },
                    React.createElement('thead', null,
                        React.createElement('tr', null,
                            React.createElement('th', { className: "sticky left-0 z-10 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 min-w-[150px]" }, "職責/分區"),
                            ALL_ROLES.map(role => (
                                React.createElement('th', { key: role, className: "border border-gray-300 dark:border-gray-700 p-2 text-sm" }, role)
                            ))
                        )
                    ),
                    React.createElement('tbody', null,
                        entities.map(entity => (
                            React.createElement('tr', { key: entity.id },
                                React.createElement('td', { className: "sticky left-0 z-10 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 font-semibold text-sm" }, entity.name),
                                ALL_ROLES.map(role => (
                                    React.createElement(RAICCell, 
                                        { 
                                            key: role,
                                            value: matrix[entity.id]?.[role] || null,
                                            onClick: () => handleCellClick(entity.id, role, matrix[entity.id]?.[role] || null)
                                        }
                                    )
                                ))
                            )
                        ))
                    )
                )
            ),
            React.createElement('form', { onSubmit: handleAddEntity, className: "mt-4 flex space-x-2" },
                React.createElement('input', 
                    { 
                        type: "text",
                        value: newEntityName,
                        onChange: (e) => setNewEntityName(e.target.value),
                        placeholder: "新增職責/分區",
                        className: "flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600"
                    }
                ),
                React.createElement('button', { type: "submit", className: "p-2 text-blue-500 rounded-md flex-shrink-0 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" },
                    React.createElement(Icon, { name: "plus", className: "w-5 h-5" })
                )
            )
        )
    );
};

export default RAICTable;
