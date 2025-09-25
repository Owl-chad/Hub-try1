
import React from 'react';

interface AnalysisHouseProps {
    completedBricks: number;
    totalBricks: number;
}

const AnalysisHouse: React.FC<AnalysisHouseProps> = ({ completedBricks, totalBricks }) => {
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
                <rect 
                    key={i}
                    x={col * brickWidth}
                    y={houseBaseHeight - (row + 1) * brickHeight}
                    width={brickWidth - 1}
                    height={brickHeight - 1}
                    className="fill-current text-green-500"
                />
            );
        }
        return bricks;
    };

    return (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md h-32 flex justify-center items-end p-4 pointer-events-none z-20">
            <div className="relative">
                <svg width="120" height="100" viewBox="-10 -35 120 100">
                    {/* House outline */}
                    <path 
                        d={`M0,${houseBaseHeight} H${houseWidth} V0 L${houseWidth / 2},-30 L0,0 Z`}
                        className={`stroke-current transition-colors duration-500 ${isComplete ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-600'}`}
                        strokeWidth="2"
                        fill="none"
                    />

                    {/* Bricks */}
                    <g>{renderBricks()}</g>
                    
                    {/* Roof */}
                     {isComplete && (
                        <path 
                            d={`M-5,0 L${houseWidth/2},-35 L${houseWidth+5},0 Z`}
                            className="fill-current text-red-500 animate-pulse"
                        />
                     )}
                </svg>
                {isComplete && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-xs font-bold animate-bounce">建成!</div>}
            </div>
        </div>
    );
};

export default AnalysisHouse;
