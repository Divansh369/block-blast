import React, { DragEvent } from 'react';
import { Block } from '../types';
import BlockDisplay from './BlockDisplay';

interface NextBlocksProps {
    currentBlocks: (Block | null)[];
    draggedBlockIndex: number | null;
    swappedBlockIndex: number | null;
    onDragStart: (e: DragEvent<HTMLDivElement>, blockIndex: number) => void;
    onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
}

const NextBlocks: React.FC<NextBlocksProps> = ({ currentBlocks, draggedBlockIndex, swappedBlockIndex, onDragStart, onDragEnd }) => (
    <div className="w-full lg:w-auto">
        <h2 className="font-orbitron text-2xl text-center mb-4 text-purple-300">Next Blocks</h2>
        <div className="flex justify-center items-start gap-4 flex-wrap">
            {currentBlocks.map((block, i) => {
              const isBeingDragged = draggedBlockIndex === i;
              const isSwapped = i === swappedBlockIndex;
              return (
                <div key={i} className={`transition-opacity ${isBeingDragged ? 'opacity-30' : 'opacity-100'} ${isSwapped ? 'animate-scale-in' : ''}`}>
                  {block ? <BlockDisplay block={block} onDragStart={onDragStart} onDragEnd={onDragEnd} index={i} /> : <div className="w-24 h-24"></div>}
                </div>
              )
            })}
        </div>
    </div>
);

export default NextBlocks;