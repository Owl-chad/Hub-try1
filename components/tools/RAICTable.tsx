
import React, { useState } from 'react';
import { Role, RAICMatrix, RAICEntity, RAICType, ALL_ROLES } from '../../types';

interface RAICTableProps {
    entities: RAICEntity[];
    matrix: RAICMatrix;
    onUpdate: (entityId: string, role: Role, value: RAICType) => void;
    onAddEntity: (name: string) => void;
}

const RAIC_TYPES: RAICType[] = ['R', 'A', 'I', 'C', null];
const RAIC_COLORS: Record<string, string> = {
    'R': 'bg-green-500 text-white',
    'A': 'bg-blue-500 text-white',
    'I': 'bg-yellow-500 text-black',
    'C': 'bg-purple-500 text-white',
};

const RAICCell: React.FC<{ value: RAICType, onClick: () => void }> = ({ value, onClick }) => {
    return (
        <td className="border border-gray-300 dark:border-gray-700 text-center p-0">
            <button onClick={onClick} className={`w-full h-full p-2 font-bold ${value ? RAIC_COLORS[value] : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {value || '-'}
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
                            <th className="sticky left-0 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 min-w-[150px]">職責/分區</th>
                            {ALL_ROLES.map(role => (
                                <th key={role} className="border border-gray-300 dark:border-gray-700 p-2 text-sm">{role}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {entities.map(entity => (
                            <tr key={entity.id}>
                                <td className="sticky left-0 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-2 font-semibold text-sm">{entity.name}</td>
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
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">新增</button>
            </form>
        </div>
    );
};

export default RAICTable;
