import React, { useState, DragEvent, useRef, useEffect } from 'react';
import { Block, GameSettings } from '../types';
import { useGameLogic } from '../hooks/useGameLogic';
import GridCell from '../components/GridCell';
import NextBlocks from '../components/NextBlocks';
import GameOver from '../components/GameOver';
import ScoreBoard from '../components/ScoreBoard';
import CustomDragLayer from '../components/CustomDragLayer';
import PowerUpPanel from '../components/PowerUpDisplay';
import DifficultyIndicator from '../components/DifficultyIndicator';
import HoldBlock from '../components/HoldBlock';
import { loadScores, addScore } from '../utils/scoreManager';
import { canPlaceBlock } from '../utils/gridUtils';

interface GameScreenProps {
  settings: GameSettings;
  onGoHome: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ settings, onGoHome }) => {
  const {
    grid,
    width,
    height,
    score,
    currentBlocks,
    gameOver,
    lastScore,
    hint,
    isHintLoading,
    clearingCells,
    placedCells,
    newlyEmptyCells,
    heldBlock,
    hasHeldThisTurn,
    swappedBlockIndex,
    holdAnimationTrigger,
    executePlacement,
    holdBlock,
    requestHint,
    restartGame
  } = useGameLogic(settings);

  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [draggedBlockInfo, setDraggedBlockInfo] = useState<{ block: Block; index: number; initialX: number; initialY: number; } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number, col: number } | null>(null);
  const [isHoldAnimating, setIsHoldAnimating] = useState(false);
  
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (holdAnimationTrigger > 0) {
      setIsHoldAnimating(true);
      const timer = setTimeout(() => setIsHoldAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [holdAnimationTrigger]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, blockIndex: number) => {
    const block = blockIndex === -1 ? heldBlock : currentBlocks[blockIndex];
    if (!block) return;
    
    setDraggedBlockIndex(blockIndex);
    e.dataTransfer.setData('text/plain', blockIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);

    setDraggedBlockInfo({ block, index: blockIndex, initialX: e.clientX, initialY: e.clientY });
  };

  const handleDragEnd = () => {
    setDraggedBlockIndex(null);
    setHoveredCell(null);
    setDraggedBlockInfo(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, row: number, col: number) => {
    e.preventDefault();
    const blockIndexStr = e.dataTransfer.getData('text/plain');
    if (blockIndexStr === '') return;
    
    const blockIndex = parseInt(blockIndexStr, 10);
    if (isNaN(blockIndex)) return;
    
    const block = blockIndex === -1 ? heldBlock : currentBlocks[blockIndex];
    if (!block) return;

    if (canPlaceBlock(grid, block, row, col, width, height)) {
        executePlacement(blockIndex, row, col);
    }
    handleDragEnd();
  };
  
  const handleHoldDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (hasHeldThisTurn) return;

    const blockIndexStr = e.dataTransfer.getData('text/plain');
    if (blockIndexStr === '' || blockIndexStr === '-1') return; // Cannot hold the held block

    const blockIndex = parseInt(blockIndexStr, 10);
    if (isNaN(blockIndex) || currentBlocks[blockIndex] === null) return;
    
    holdBlock(blockIndex);
    handleDragEnd();
  }

  const handleSaveScore = () => {
    if (lastScore) {
        addScore(lastScore.score, lastScore.playerName, lastScore.mode, true);
        alert("Score Saved!");
    }
  };

  const isCellHovered = (r: number, c: number) => {
    if (!hoveredCell || draggedBlockIndex === null) return false;
    const block = draggedBlockIndex === -1 ? heldBlock : currentBlocks[draggedBlockIndex];
    if (!block) return false;
    
    const relativeRow = r - hoveredCell.row;
    const relativeCol = c - hoveredCell.col;

    return relativeRow >= 0 && relativeRow < block.height &&
           relativeCol >= 0 && relativeCol < block.width &&
           block.shape[relativeRow][relativeCol] === 1;
  };

  const isCellHinted = (r: number, c: number) => {
    if (!hint) return false;
    const block = hint.blockIndex === -1 ? heldBlock : currentBlocks[hint.blockIndex];
    if (!block) return false;
    
    const relativeRow = r - hint.row;
    const relativeCol = c - hint.col;

    return relativeRow >= 0 && relativeRow < block.height &&
           relativeCol >= 0 && relativeCol < block.width &&
           block.shape[relativeRow][relativeCol] === 1;
  };
  
  const isCellClearing = (r: number, c: number) => {
      return clearingCells.rows.includes(r) || clearingCells.cols.includes(c);
  };

  const isCellPlaced = (r: number, c: number) => {
    return placedCells.some(cell => cell.r === r && cell.c === c);
  };

  const isCellNewlyEmpty = (r: number, c: number) => {
    return newlyEmptyCells.some(cell => cell.r === r && cell.c === c);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 gap-8">
      <CustomDragLayer draggedBlockInfo={draggedBlockInfo ? { block: draggedBlockInfo.block, initialX: draggedBlockInfo.initialX, initialY: draggedBlockInfo.initialY } : null} />
      {gameOver && <GameOver score={score} onRestart={restartGame} onSaveScore={handleSaveScore} lastScore={lastScore} />}
      
      <div className="md:w-1/4 flex flex-col items-center gap-6 order-1 md:order-1 w-full">
        <div className="text-center">
            <h2 className="font-orbitron text-3xl text-yellow-300">Score</h2>
            <p className="font-mono text-4xl">{score}</p>
        </div>
        <DifficultyIndicator score={score} mode={settings.mode} />
        <HoldBlock 
            block={heldBlock} 
            isDisabled={hasHeldThisTurn} 
            isAnimating={isHoldAnimating}
            onDragStart={(e) => handleDragStart(e, -1)}
            onDragEnd={handleDragEnd}
            onDrop={handleHoldDrop}
            onDragOver={(e) => e.preventDefault()}
        />
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
          <button onClick={onGoHome} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 w-full">
            Main Menu
          </button>
          <button onClick={requestHint} disabled={isHintLoading || gameOver} className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-700 disabled:bg-slate-500 disabled:cursor-not-allowed w-full">
            {isHintLoading ? 'Thinking...' : 'Get Hint'}
          </button>
        </div>
      </div>

      <div 
        ref={gridRef} 
        className="order-2 md:order-2 grid border-2 border-purple-500/50 bg-slate-800/50 rounded-lg p-2" 
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
          width: 'min(80vw, 80vh)',
          height: 'min(80vw, 80vh)',
          maxWidth: '500px',
          maxHeight: '500px',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <GridCell
              key={`${r}-${c}`}
              value={cell}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, r, c)}
              onDragEnter={(e) => { e.preventDefault(); if (draggedBlockIndex !== null) setHoveredCell({row: r, col: c}); }}
              onDragLeave={() => {}}
              onMouseEnter={() => {}}
              onClick={() => {}}
              isHovered={isCellHovered(r, c)}
              isHinted={isCellHinted(r, c)}
              isClearing={isCellClearing(r,c)}
              isPlaced={isCellPlaced(r, c)}
              isTargeted={false}
              isNewlyEmpty={isCellNewlyEmpty(r,c)}
            />
          ))
        )}
      </div>

      <div className="md:w-1/4 flex flex-col items-center gap-6 order-3 md:order-3">
        <NextBlocks
          currentBlocks={currentBlocks}
          draggedBlockIndex={draggedBlockIndex}
          swappedBlockIndex={swappedBlockIndex}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <ScoreBoard scores={loadScores()} />
      </div>
    </div>
  );
};

export default GameScreen;