import React, { useState, useEffect } from 'react';
import { Block } from '../types';

interface CustomDragLayerProps {
  draggedBlockInfo: {
    block: Block;
    initialX: number;
    initialY: number;
  } | null;
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ draggedBlockInfo }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (draggedBlockInfo) {
      // Set initial position when a drag starts
      setPosition({ x: draggedBlockInfo.initialX, y: draggedBlockInfo.initialY });

      const handleDragOver = (e: DragEvent) => {
        // Prevent default to allow drop
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
      };
      
      document.addEventListener('dragover', handleDragOver);

      // Cleanup listener when the drag ends (prop becomes null)
      return () => {
        document.removeEventListener('dragover', handleDragOver);
      };
    }
  }, [draggedBlockInfo]); // Effect runs when a drag starts or ends

  if (!draggedBlockInfo) {
    return null;
  }

  const { block } = draggedBlockInfo;
  
  const style: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
  };

  return (
    <div style={style}>
      <div className="p-2 bg-slate-800/80 rounded-lg flex flex-col items-center justify-center ring-2 ring-yellow-400">
        {block.shape.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div key={c} className={`w-6 h-6 ${cell ? block.color : ''} ${cell ? 'border-t border-l border-white/20' : ''}`}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDragLayer;