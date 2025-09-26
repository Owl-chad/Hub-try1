import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { ALL_ROLES } from '../../types';
import { AppContext } from '../../context/AppContext';
import Icon from '../ui/Icon';

// Helper function to add days to a UTC date
const addDaysUTC = (date, days) => {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

// Helper function to get the difference in days between two UTC dates
const diffDaysUTC = (date1, date2) => {
    const d1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
    const d2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate());
    return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
};

// Format Date to YYYY-MM-DD for input[type=date]
const formatDateForInput = (date) => {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Heuristic to determine if text should be black or white based on background color
const getTextColorForBackground = (hexColor) => {
    if (!hexColor) return 'text-white';
    try {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'text-black' : 'text-white';
    } catch (e) {
        return 'text-white';
    }
};

const DAY_WIDTH = 32; // Width of a single day cell in pixels
const MOCK_TODAY = new Date(Date.UTC(2025, 8, 25));
const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'
];

const GanttChart = ({ tasks }) => {
  const { currentUser, updateGanttTask, addGanttTask, deleteGanttTask } = useContext(AppContext);
  
  const [viewDate, setViewDate] = useState(addDaysUTC(MOCK_TODAY, -15));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const scrollContainerRef = useRef(null);
  const [isTodayCentering, setIsTodayCentering] = useState(false);

  const [draggingInfo, setDraggingInfo] = useState(null);

  const [tempTasks, setTempTasks] = useState(tasks);
  
  useEffect(() => {
    if (!draggingInfo) {
        setTempTasks(tasks);
    }
  }, [tasks, draggingInfo]);

  useEffect(() => {
    if (isTodayCentering && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const containerWidth = container.clientWidth;
        const todayPosition = 192 + (15.5 * DAY_WIDTH); 
        
        let scrollLeft = todayPosition - (containerWidth / 2);
        
        const maxScrollLeft = container.scrollWidth - containerWidth;
        scrollLeft = Math.max(0, Math.min(scrollLeft, maxScrollLeft));

        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        
        setIsTodayCentering(false);
    }
  }, [viewDate, isTodayCentering]);

  const totalDays = 30;
  const chartStartDate = viewDate;
  const chartEndDate = addDaysUTC(chartStartDate, totalDays - 1);

  const months = useMemo(() => {
    const monthMap = new Map(); // Map<"YYYY-M", dayCount>
    for (let i = 0; i < totalDays; i++) {
        const date = addDaysUTC(chartStartDate, i);
        const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
        monthMap.set(key, (monthMap.get(key) || 0) + 1);
    }
    
    return Array.from(monthMap.entries()).map(([key, dayCount]) => {
        const [year, month] = key.split('-');
        return {
            name: `${year}年 ${parseInt(month) + 1}月`,
            days: dayCount,
            width: dayCount * DAY_WIDTH,
        };
    });
  }, [chartStartDate, totalDays]);

  const handleMouseDown = (e, task, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditMode) return;
    setDraggingInfo({ task, action, initialX: e.clientX, initialStartDate: task.startDate, initialEndDate: task.endDate });
  };
  
  useEffect(() => {
    const handleMouseMove = (e) => {
        if (!draggingInfo) return;
        const deltaX = e.clientX - draggingInfo.initialX;
        const deltaDays = Math.round(deltaX / DAY_WIDTH);
        
        setTempTasks(currentTasks => currentTasks.map(t => {
            if (t.id === draggingInfo.task.id) {
                let newStartDate = new Date(draggingInfo.initialStartDate);
                let newEndDate = new Date(draggingInfo.initialEndDate);

                if (draggingInfo.action === 'move') {
                    newStartDate = addDaysUTC(draggingInfo.initialStartDate, deltaDays);
                    newEndDate = addDaysUTC(draggingInfo.initialEndDate, deltaDays);
                } else if (draggingInfo.action === 'resize-start') {
                    newStartDate = addDaysUTC(draggingInfo.initialStartDate, deltaDays);
                    if (newStartDate >= newEndDate) newStartDate = addDaysUTC(newEndDate, -1);
                } else if (draggingInfo.action === 'resize-end') {
                    newEndDate = addDaysUTC(draggingInfo.initialEndDate, deltaDays);
                    if (newEndDate <= newStartDate) newEndDate = addDaysUTC(newStartDate, 1);
                }
                return { ...t, startDate: newStartDate, endDate: newEndDate };
            }
            return t;
        }));
    };
    const handleMouseUp = () => {
        if (draggingInfo) {
            const updatedTask = tempTasks.find(t => t.id === draggingInfo.task.id);
            if(updatedTask) updateGanttTask(updatedTask);
            setDraggingInfo(null);
        }
    };
    if (draggingInfo) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingInfo, updateGanttTask, tempTasks]);
  
  const handlePrev = () => setViewDate(prev => addDaysUTC(prev, -30));
  const handleNext = () => setViewDate(prev => addDaysUTC(prev, 30));
  const handleToday = () => {
    setViewDate(addDaysUTC(MOCK_TODAY, -15));
    setIsTodayCentering(true);
  };

  const daysHeader = Array.from({ length: totalDays }, (_, i) => {
    const day = addDaysUTC(chartStartDate, i);
    const isToday = day.getUTCFullYear() === MOCK_TODAY.getUTCFullYear() && day.getUTCMonth() === MOCK_TODAY.getUTCMonth() && day.getUTCDate() === MOCK_TODAY.getUTCDate();
    return (
      React.createElement('div', { key: i, className: "flex-shrink-0 w-8 text-center border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-0.5" },
        React.createElement('div', { className: "text-xs text-gray-400" }, ['日', '一', '二', '三', '四', '五', '六'][day.getUTCDay()]),
        React.createElement('div', { className: `text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-500 text-white' : ''}` },
            day.getUTCDate()
        )
      )
    );
  });

  const AddOrEditModal = ({ task, onClose }) => {
    const [name, setName] = useState(task?.name || '');
    const [startDate, setStartDate] = useState(task ? formatDateForInput(task.startDate) : '');
    const [endDate, setEndDate] = useState(task ? formatDateForInput(task.endDate) : '');
    const [assignee, setAssignee] = useState(task?.assignee || currentUser.role);
    const [color, setColor] = useState(task?.color || COLOR_PALETTE[4]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && startDate && endDate) {
            const startParts = startDate.split('-').map(p => parseInt(p, 10));
            const startDateUTC = new Date(Date.UTC(startParts[0], startParts[1] - 1, startParts[2]));

            const endParts = endDate.split('-').map(p => parseInt(p, 10));
            const endDateUTC = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2]));

            if (endDateUTC < startDateUTC) {
                alert("結束日期不能早於開始日期。");
                return;
            }

            if (task) {
                updateGanttTask({ ...task, name, startDate: startDateUTC, endDate: endDateUTC, assignee, color });
            } else {
                addGanttTask({ name: name.trim(), startDate: startDateUTC, endDate: endDateUTC, assignee, color });
            }
            onClose();
        }
    };
    
    const handleDelete = () => {
        if(task) {
            deleteGanttTask(task.id);
            onClose();
        }
    }

    return (
        React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center", onClick: onClose },
            React.createElement('div', { className: "bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-sm", onClick: e => e.stopPropagation() },
                React.createElement('h3', { className: "text-lg font-bold mb-6" }, task ? '編輯安排' : '新增安排'),
                React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
                    React.createElement('div', null,
                        React.createElement('label', { htmlFor: "task-name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "任務名稱"),
                        React.createElement('input', { id: "task-name", type: "text", value: name, onChange: e => setName(e.target.value), required: true, className: "w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"})
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { htmlFor: "task-assignee", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "負責人"),
                        React.createElement('select', { id: "task-assignee", value: assignee, onChange: e => setAssignee(e.target.value), className: "w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md" },
                           ALL_ROLES.map(role => React.createElement('option', { key: role, value: role }, role))
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { htmlFor: "start-date", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "開始日期"),
                        React.createElement('input', { id: "start-date", type: "date", value: startDate, onChange: e => setStartDate(e.target.value), required: true, className: "w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"})
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { htmlFor: "end-date", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "結束日期"),
                        React.createElement('input', { id: "end-date", type: "date", value: endDate, onChange: e => setEndDate(e.target.value), required: true, className: "w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"})
                    ),
                     React.createElement('div', null,
                        React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300" }, "顏色"),
                        React.createElement('div', { className: "mt-2 flex flex-wrap gap-2" },
                            COLOR_PALETTE.map(c => (
                                React.createElement('button',
                                    {
                                        key: c,
                                        type: "button",
                                        onClick: () => setColor(c),
                                        className: `w-7 h-7 rounded-full border-2 transition-transform transform hover:scale-110 ${color === c ? 'border-blue-500 scale-110' : 'border-transparent'}`,
                                        style: { backgroundColor: c },
                                        "aria-label": `Select color ${c}`
                                    }
                                )
                            ))
                        )
                    ),
                    React.createElement('div', { className: "mt-8 flex justify-between items-center" },
                        React.createElement('div', null,
                            task && React.createElement('button', { type: "button", onClick: handleDelete, className: "px-4 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600" }, "刪除")
                        ),
                        React.createElement('div', { className: "flex space-x-2" },
                           React.createElement('button', { type: "button", onClick: onClose, className: "px-4 py-2 rounded-md text-sm font-semibold" }, "取消"),
                           React.createElement('button', { type: "submit", className: "px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600" }, "儲存")
                        )
                    )
                )
            )
        )
    );
  };
  
  return (
    React.createElement('div', { className: "p-4" },
      isAddModalOpen && React.createElement(AddOrEditModal, { onClose: () => setIsAddModalOpen(false) }),
      editingTask && React.createElement(AddOrEditModal, { task: editingTask, onClose: () => setEditingTask(null) }),

      React.createElement('div', { className: "flex flex-wrap justify-between items-center mb-4 gap-4" },
        React.createElement('div', null,
          React.createElement('h3', { className: "text-lg font-bold" }, "團隊甘特圖"),
          React.createElement('p', { className: "text-sm text-gray-500 dark:text-gray-400" },
            `${chartStartDate.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', timeZone: 'UTC' })} - ${chartEndDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}`
          )
        ),
        React.createElement('div', { className: "flex items-center space-x-2" },
          React.createElement('button', { onClick: handlePrev, className: "p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700", "aria-label": "Previous 30 days" }, '<'),
          React.createElement('button', { onClick: handleToday, className: "p-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-sm" }, "今天"),
          React.createElement('button', { onClick: handleNext, className: "p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700", "aria-label": "Next 30 days" }, '>')
        )
      ),

      React.createElement('div', { className: "flex items-center space-x-2 mb-4" },
          React.createElement('button', 
            { 
              onClick: () => setIsAddModalOpen(true), 
              className: "p-2 text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center transition-colors",
              "aria-label": "新增安排",
              title: "新增安排"
            },
            React.createElement(Icon, { name: "plus", className: "w-7 h-7" })
          ),
          React.createElement('button', 
            { 
              onClick: () => setIsEditMode(!isEditMode), 
              className: `p-2 rounded-full flex items-center justify-center transition-colors ${isEditMode ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`,
              "aria-label": isEditMode ? '完成編輯' : '編輯任務',
              title: isEditMode ? '完成編輯' : '編輯任務'
            },
            React.createElement(Icon, { name: "edit", className: "w-7 h-7" })
          )
      ),

      React.createElement('div', { className: "overflow-x-auto", ref: scrollContainerRef },
        React.createElement('div', { style: { width: 192 + totalDays * DAY_WIDTH }, className: "relative" },
          /* Header */
          React.createElement('div', { className: "sticky top-0 bg-white dark:bg-black z-10" },
              React.createElement('div', { className: "flex" },
                  React.createElement('div', { className: "w-48 flex-shrink-0 p-2 font-semibold border-b border-r border-gray-200 dark:border-gray-700" }, "任務"),
                  React.createElement('div', { className: "flex-grow" },
                      React.createElement('div', { className: "flex border-b border-gray-200 dark:border-gray-700" },
                          months.map((month, index) => (
                              React.createElement('div', { key: index, style: { width: month.width }, className: "p-1 text-left pl-2 font-semibold text-sm border-r border-gray-200 dark:border-gray-700" },
                                  month.name
                              )
                          ))
                      ),
                      React.createElement('div', { className: "flex" }, daysHeader)
                  )
              )
          ),
          /* Body */
          React.createElement('div', { className: "relative" },
            tempTasks.map((task) => {
              const startOffset = diffDaysUTC(task.startDate, chartStartDate);
              const endOffset = diffDaysUTC(task.endDate, chartStartDate);
              
              if (endOffset < 0 || startOffset >= totalDays) return null; // Don't render if outside view

              const left = Math.max(startOffset, 0) * DAY_WIDTH;
              const width = (Math.min(endOffset, totalDays - 1) - Math.max(startOffset, 0) + 1) * DAY_WIDTH;
              
              return (
                React.createElement('div', { key: task.id, className: "flex items-center border-b border-gray-200 dark:border-gray-700 h-12 group" },
                  React.createElement('div', { className: "w-48 flex-shrink-0 p-2 text-sm truncate border-r border-gray-200 dark:border-gray-700 flex items-center justify-between" },
                    React.createElement('span', { className: "truncate flex-grow", title: task.name }, task.name),
                    isEditMode && 
                        React.createElement('button', { onClick: () => setEditingTask(task), className: "ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700", "aria-label": `Edit task ${task.name}` }, React.createElement(Icon, { name: "edit", className: "w-4 h-4"}))
                  ),
                  React.createElement('div', { className: "flex-grow h-full relative" },
                     React.createElement('div',
                        {
                            style: { 
                                left: `${left}px`, 
                                width: `${width}px`,
                                backgroundColor: task.color || '#6b7280',
                            },
                            className: `absolute top-1/2 -translate-y-1/2 h-8 rounded flex items-center px-2 text-xs whitespace-nowrap overflow-hidden ${getTextColorForBackground(task.color)} ${!isEditMode ? 'cursor-move' : 'cursor-default'}`,
                            title: `${task.name} (${task.assignee})`,
                            onMouseDown: (e) => handleMouseDown(e, task, 'move')
                        },
                       !isEditMode && React.createElement('div', { className: "absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize", onMouseDown: (e) => handleMouseDown(e, task, 'resize-start') }),
                       React.createElement('span', { className: "px-2 truncate pointer-events-none" }, task.name),
                       !isEditMode && React.createElement('div', { className: "absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize", onMouseDown: (e) => handleMouseDown(e, task, 'resize-end') })
                      )
                  )
                )
              );
            }))
          )
        )
      )
    )
  );
};

export default GanttChart;
