import React, { DragEvent } from 'react';
import { Block } from '../types';

interface BlockDisplayProps {
  block: Block;
  onDragStart: (e: DragEvent<HTMLDivElement>, blockIndex: number) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  index: number;
}

const BlockDisplay: React.FC<BlockDisplayProps> = ({ block, onDragStart, onDragEnd, index }) => {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    onDragStart(e, index);
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="p-2 bg-slate-800/50 rounded-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-700/50 transition-colors border-2 border-dashed border-slate-600"
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
  );
};

export default BlockDisplay;