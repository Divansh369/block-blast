import React, { DragEvent } from 'react';
import { Block } from '../types';

interface HoldBlockProps {
  block: Block | null;
  isDisabled: boolean;
  isAnimating?: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
}

const HoldBlock: React.FC<HoldBlockProps> = ({ block, isDisabled, isAnimating, onDragStart, onDragEnd, onDrop, onDragOver }) => {
  const containerClasses = `
    w-full max-w-[200px] text-center p-2 rounded-lg border-2 border-dashed transition-all
    ${isDisabled ? 'border-slate-700 bg-slate-800/20 cursor-not-allowed' : 'border-slate-500 bg-slate-800/50 hover:border-yellow-400 hover:bg-slate-700/50'}
    ${isAnimating ? 'animate-hold-swap' : ''}
  `;
  
  return (
    <div className="w-full max-w-[200px] text-center">
      <h2 className="font-orbitron text-2xl mb-2 text-purple-300">Hold</h2>
      <div
        onDrop={isDisabled ? undefined : onDrop}
        onDragOver={isDisabled ? undefined : onDragOver}
        className={containerClasses}
        style={{ minHeight: '120px' }} 
      >
        {block ? (
          <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="inline-flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {block.shape.map((row, r) => (
              <div key={r} className="flex">
                {row.map((cell, c) => (
                  <div
                    key={c}
                    className={`w-6 h-6 ${cell ? block.color : ''} ${cell ? 'border-t border-l border-white/20' : ''}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
                <span>Drop here</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default HoldBlock;