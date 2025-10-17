import { useState, useEffect, useCallback, useMemo } from 'react';
import { Block, GameSettings, GridType, ScoreEntry } from '../types';
import { CLASSIC_GRID_SIZE, INTENSE_GRID_SIZE, BLOCK_MAP } from '../constants';
import { createEmptyGrid, placeBlock, clearLines, isGameOver } from '../utils/gridUtils';
import { generateNextBlocks as fallbackGenerateNextBlocks } from '../utils/blockGenerator';
import { findBestMove } from '../utils/aiPlayer';
import { audioManager } from '../utils/audioManager';
import { addScore } from '../utils/scoreManager';

// FIX: Export ActivePowerUp type for use in PowerUpDisplay component.
export type ActivePowerUp = 'bomb' | 'zap' | 'swap';

export const useGameLogic = (settings: GameSettings) => {
    const { width, height, mode } = useMemo(() => (settings.mode === 'classic' ? CLASSIC_GRID_SIZE : INTENSE_GRID_SIZE), [settings.mode]);
    
    const [grid, setGrid] = useState<GridType>(() => createEmptyGrid(width, height));
    const [score, setScore] = useState(0);
    const [currentBlocks, setCurrentBlocks] = useState<(Block | null)[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [lastScore, setLastScore] = useState<ScoreEntry | null>(null);
    
    const [hint, setHint] = useState<{ blockIndex: number, row: number, col: number } | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);

    const [clearingCells, setClearingCells] = useState<{ rows: number[], cols: number[] }>({ rows: [], cols: [] });
    const [placedCells, setPlacedCells] = useState<{ r: number; c: number }[]>([]);
    const [newlyEmptyCells, setNewlyEmptyCells] = useState<{ r: number; c: number }[]>([]);

    // Hold feature state
    const [heldBlock, setHeldBlock] = useState<Block | null>(null);
    const [hasHeldThisTurn, setHasHeldThisTurn] = useState(false);
    const [swappedBlockIndex, setSwappedBlockIndex] = useState<number | null>(null);
    const [holdAnimationTrigger, setHoldAnimationTrigger] = useState(0);

    const difficultyFactor = useMemo(() => mode === 'intense' ? 0.2 : 0, [mode]);

    const requestNextBlocks = useCallback(() => {
        setHint(null);
        const nextBlockIds = fallbackGenerateNextBlocks(grid, score, difficultyFactor);
        setCurrentBlocks(nextBlockIds.map(id => BLOCK_MAP[id] || null));
    }, [grid, score, difficultyFactor]);
    
    useEffect(() => {
        audioManager.setSoundEnabled(settings.sound);
        requestNextBlocks();
    }, [settings.sound]);

    useEffect(() => {
        if (currentBlocks.length > 0 && isGameOver(grid, currentBlocks, heldBlock, width, height)) {
            setGameOver(true);
            audioManager.playSound('gameOver');
            const savedScore = addScore(score, settings.playerName, settings.mode);
            setLastScore(savedScore);
        }
    }, [grid, currentBlocks, heldBlock, width, height, score, settings.playerName, settings.mode]);

    useEffect(() => {
        if (placedCells.length > 0) {
            const timer = setTimeout(() => setPlacedCells([]), 250); // Corresponds to animation duration
            return () => clearTimeout(timer);
        }
    }, [placedCells]);

    useEffect(() => {
        if (newlyEmptyCells.length > 0) {
            const timer = setTimeout(() => setNewlyEmptyCells([]), 400); // Corresponds to animation duration
            return () => clearTimeout(timer);
        }
    }, [newlyEmptyCells]);

    useEffect(() => {
        if (swappedBlockIndex !== null) {
            const timer = setTimeout(() => setSwappedBlockIndex(null), 300); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [swappedBlockIndex]);

    const executePlacement = useCallback((blockIndex: number, row: number, col: number) => {
        const block = blockIndex === -1 ? heldBlock : currentBlocks[blockIndex];
        if (!block) return;
        
        setHint(null);
        
        const currentPlacedCells: { r: number; c: number }[] = [];
        for (let r_offset = 0; r_offset < block.height; r_offset++) {
            for (let c_offset = 0; c_offset < block.width; c_offset++) {
                if (block.shape[r_offset][c_offset] === 1) {
                    currentPlacedCells.push({ r: row + r_offset, c: col + c_offset });
                }
            }
        }
        setPlacedCells(currentPlacedCells);

        let newGrid = placeBlock(grid, block, row, col);
        const { newGrid: gridAfterClear, clearedRows, clearedCols, linesCleared } = clearLines(newGrid, width, height);

        let points = 10 * block.shape.flat().filter(c => c === 1).length;
        if (linesCleared > 0) {
            points += Math.pow(linesCleared, 2) * 100; // Bonus for clearing lines
            audioManager.playSound('clear');
            setClearingCells({ rows: clearedRows, cols: clearedCols });
            setTimeout(() => {
                setGrid(gridAfterClear);
                setClearingCells({ rows: [], cols: [] });
                
                const emptyCellsCoords: { r: number; c: number }[] = [];
                clearedRows.forEach(r => {
                    for (let c = 0; c < width; c++) emptyCellsCoords.push({ r, c });
                });
                clearedCols.forEach(c => {
                    for (let r = 0; r < height; r++) {
                        if (!clearedRows.includes(r)) {
                            emptyCellsCoords.push({ r, c });
                        }
                    }
                });
                setNewlyEmptyCells(emptyCellsCoords);

            }, 400); // Animation time
        } else {
            setGrid(gridAfterClear);
            audioManager.playSound('place');
        }
        
        setScore(score + points);
        setHasHeldThisTurn(false); // Allow hold again on next turn

        if (blockIndex === -1) {
            setHeldBlock(null);
        } else {
            const newBlocks = [...currentBlocks];
            newBlocks[blockIndex] = null;
            setCurrentBlocks(newBlocks);
            if (newBlocks.every(b => b === null)) {
                requestNextBlocks();
            }
        }

    }, [currentBlocks, heldBlock, grid, width, height, requestNextBlocks, score]);

    const holdBlock = useCallback((blockIndex: number) => {
        if (hasHeldThisTurn || gameOver) return;

        const blockToHold = currentBlocks[blockIndex];
        if (!blockToHold) return;

        const blockFromHold = heldBlock;

        setSwappedBlockIndex(blockFromHold ? blockIndex : null);
        setHeldBlock(blockToHold);
        
        const newBlocks = [...currentBlocks];
        newBlocks[blockIndex] = blockFromHold;
        setCurrentBlocks(newBlocks);
        
        setHasHeldThisTurn(true);
        setHoldAnimationTrigger(c => c + 1);
        audioManager.playSound('powerUpUse'); // Re-using a swooshy sound
    }, [hasHeldThisTurn, gameOver, currentBlocks, heldBlock]);
    
    const requestHint = useCallback(async () => {
        if (isHintLoading || gameOver) return;
        setIsHintLoading(true);
        setTimeout(() => {
            const result = findBestMove(grid, currentBlocks, heldBlock, width, height);
            setHint(result);
            setIsHintLoading(false);
        }, 300);
    }, [grid, currentBlocks, heldBlock, width, height, isHintLoading, gameOver]);

    const restartGame = useCallback(() => {
        setGrid(createEmptyGrid(width, height));
        setScore(0);
        setGameOver(false);
        setHint(null);
        setLastScore(null);
        setHeldBlock(null);
        setHasHeldThisTurn(false);
        requestNextBlocks();
    }, [width, height, requestNextBlocks]);

    return {
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
    };
};