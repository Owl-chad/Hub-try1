import React from 'react';

const AnalysisHouse = ({ completedBricks, totalBricks }) => {
    const progress = totalBricks > 0 ? completedBricks / totalBricks : 0;
    const isComplete = progress === 1;

    const brickWidth = 10;
    const brickHeight = 5;
    const bricksPerRow = 10;
    const houseWidth = bricksPerRow * brickWidth;
    const houseBaseHeight = 60;

    const renderBricks = () => {
        const bricks = [];
        for (let i = 0; i < completedBricks; i++) {
            const row = Math.floor(i / bricksPerRow);
            const col = i % bricksPerRow;
            bricks.push(
                React.createElement('rect', 
                    { 
                        key: i,
                        x: col * brickWidth,
                        y: houseBaseHeight - (row + 1) * brickHeight,
                        width: brickWidth - 1,
                        height: brickHeight - 1,
                        className: "fill-current text-green-500"
                    }
                )
            );
        }
        return bricks;
    };

    return (
        React.createElement('div', { className: "fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md h-32 flex justify-center items-end p-4 pointer-events-none z-20" },
            React.createElement('div', { className: "relative" },
                React.createElement('svg', { width: "120", height: "100", viewBox: "-10 -35 120 100" },
                    /* House outline */
                    React.createElement('path', 
                        { 
                            d: `M0,${houseBaseHeight} H${houseWidth} V0 L${houseWidth / 2},-30 L0,0 Z`,
                            className: `stroke-current transition-colors duration-500 ${isComplete ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-600'}`,
                            strokeWidth: "2",
                            fill: "none"
                        }
                    ),

                    /* Bricks */
                    React.createElement('g', null, renderBricks()),
                    
                    /* Roof */
                     isComplete && (
                        React.createElement('path', 
                            { 
                                d: `M-5,0 L${houseWidth/2},-35 L${houseWidth+5},0 Z`,
                                className: "fill-current text-red-500 animate-pulse"
                            }
                        )
                     )
                ),
                isComplete && React.createElement('div', { className: "absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-xs font-bold animate-bounce" }, "建成!")
            )
        )
    );
};

export default AnalysisHouse;
