
import React, { useState } from 'react';
import { Role, RAICMatrix, RAICEntity, RAICType, ALL_ROLES } from '../../types';
import Icon from '../ui/Icon';

interface RAICTableProps {
    entities: RAICEntity[];
    matrix: RAICMatrix;
    onUpdate: (entityId: string, role: Role, value: RAICType) => void;
    onAddEntity: (name: string) => void;
}

const RAIC_TYPES: RAICType[] = ['R', 'A', 'I', 'C', null];
const RAIC_COLORS: Record<string, string> = {
    'R': 'text-purple-500',
    'A': 'text-orange-500',
    'I': 'text-blue-500',
    'C': 'text-green-500',
};

const RAICCell: React.FC<{ value: RAICType, onClick: () => void }> = ({ value, onClick }) => {
    const colorClass = value ? RAIC_COLORS[value] : 'text-gray-400 dark:text-gray-500';
    return (
        <td className="border border-gray-300 dark:border-gray-700 text-center p-0">
            <button onClick={onClick} className={`w-full h-full p-2 font-bold text-lg transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800 ${colorClass}`}>
                {value || '·'}
            </button>
        </td>
    );
};

const RAICTable: React.FC<RAICTableProps> = ({ entities, matrix, onUpdate, onAddEntity }) => {
    const [newEntityName, setNewEntityName] = useState('');

    const handleCellClick = (entityId: string, role: Role, currentValue: RAICType) => {
        const currentIndex = RAIC_TYPES.indexOf(currentValue);
        const nextValue = RAIC_TYPES[(currentIndex + 1) % RAIC_TYPES.length];
        onUpdate(entityId, role, nextValue);
    };

    const handleAddEntity = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEntityName.trim()) {
            onAddEntity(newEntityName.trim());
            setNewEntityName('');
        }
    };
    
    return (
        <div className="p-4 overflow-x-auto">
            <div className="w-full min-w-[700px]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 min-w-[150px]">職責/分區</th>
                            {ALL_ROLES.map(role => (
                                <th key={role} className="border border-gray-300 dark:border-gray-700 p-2 text-sm">{role}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {entities.map(entity => (
                            <tr key={entity.id}>
                                <td className="sticky left-0 z-10 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 font-semibold text-sm">{entity.name}</td>
                                {ALL_ROLES.map(role => (
                                    <RAICCell 
                                        key={role}
                                        value={matrix[entity.id]?.[role] || null}
                                        onClick={() => handleCellClick(entity.id, role, matrix[entity.id]?.[role] || null)}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <form onSubmit={handleAddEntity} className="mt-4 flex space-x-2">
                <input 
                    type="text"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    placeholder="新增職責/分區"
                    className="flex-grow p-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600"
                />
                <button type="submit" className="p-2 text-blue-500 rounded-md flex-shrink-0 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                    <Icon name="plus" className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default RAICTable;
