import React, { DragEvent } from 'react';
import { GridCellValue } from '../types';

interface GridCellProps {
  value: GridCellValue;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onClick: () => void;
  isHovered: boolean;
  isHinted: boolean;
  isClearing: boolean;
  isPlaced: boolean;
  isTargeted: boolean;
  isNewlyEmpty: boolean;
}

const GridCell: React.FC<GridCellProps> = ({ 
    value, 
    onDragOver, 
    onDrop, 
    onDragEnter, 
    onDragLeave, 
    onMouseEnter,
    onClick, 
    isHovered, 
    isHinted, 
    isClearing,
    isPlaced,
    isTargeted,
    isNewlyEmpty
}) => {
  const baseClass = "w-full h-full border border-slate-700/50 transition-colors duration-150";
  const filledClass = typeof value === 'string' ? `${value}` : 'bg-slate-800';
  const hoverClass = isHovered ? 'bg-green-500/50' : '';
  const hintClass = isHinted && !isHovered ? 'bg-yellow-500/40' : '';
  const clearingClass = isClearing ? 'animate-shrink-out' : '';
  const placedClass = isPlaced ? 'animate-scale-in' : '';
  const targetedClass = isTargeted ? 'bg-red-500/50 ring-2 ring-red-300' : '';
  const newlyEmptyClass = isNewlyEmpty ? 'animate-empty-fade-in' : '';

  return <div className={`${baseClass} ${filledClass} ${hoverClass} ${hintClass} ${clearingClass} ${placedClass} ${targetedClass} ${newlyEmptyClass}`} 
    onDragOver={onDragOver} 
    onDrop={onDrop}
    onDragEnter={onDragEnter}
    onDragLeave={onDragLeave}
    onMouseEnter={onMouseEnter}
    onClick={onClick}
  />;
};

export default GridCell;