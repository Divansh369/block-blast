import { Block, GridType } from '../types';
import { canPlaceBlock, placeBlock, clearLines } from './gridUtils';

const calculateHeuristics = (grid: GridType, width: number, height: number, linesCleared: number) => {
    let holes = 0;
    let aggregateHeight = 0;
    let bumpiness = 0;
    const heights: number[] = [];

    for (let c = 0; c < width; c++) {
        let blockFound = false;
        let colHeight = 0;
        for (let r = 0; r < height; r++) {
            if (grid[r][c] !== 0) {
                blockFound = true;
                if (colHeight === 0) colHeight = height - r;
            } else if (blockFound) {
                holes++;
            }
        }
        heights.push(colHeight);
        aggregateHeight += colHeight;
    }

    for (let i = 0; i < heights.length - 1; i++) {
        bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }

    // Heuristic weights - prioritize clearing lines, then avoiding holes, then keeping it flat.
    const score = (linesCleared * 500) - (holes * 10) - (aggregateHeight * 2) - bumpiness;
    return score;
};

const findBestPlacementForBlock = (
    grid: GridType,
    block: Block,
    gridWidth: number,
    gridHeight: number
): { score: number, move: { row: number, col: number } } | null => {
    let bestScore = -Infinity;
    let bestPlacement: { row: number, col: number } | null = null;

    for (let r = 0; r <= gridHeight - block.height; r++) {
        for (let c = 0; c <= gridWidth - block.width; c++) {
            if (canPlaceBlock(grid, block, r, c, gridWidth, gridHeight)) {
                // Simulate the move
                const tempGrid = placeBlock(grid, block, r, c);
                const { newGrid: gridAfterClear, linesCleared } = clearLines(tempGrid, gridWidth, gridHeight);
                
                // Evaluate the resulting grid
                const score = calculateHeuristics(gridAfterClear, gridWidth, gridHeight, linesCleared);

                if (score > bestScore) {
                    bestScore = score;
                    bestPlacement = { row: r, col: c };
                }
            }
        }
    }

    if (bestPlacement) {
        return { score: bestScore, move: bestPlacement };
    }
    return null;
}

export const findBestMove = (
    grid: GridType,
    currentBlocks: (Block | null)[],
    heldBlock: Block | null,
    gridWidth: number,
    gridHeight: number
): { blockIndex: number; row: number; col: number } | null => {
    let bestScore = -Infinity;
    let bestMove: { blockIndex: number; row: number; col: number } | null = null;

    const allPlayableBlocks: { block: Block; index: number }[] = [];
    currentBlocks.forEach((block, index) => {
        if (block) allPlayableBlocks.push({ block, index });
    });
    if (heldBlock) {
        allPlayableBlocks.push({ block: heldBlock, index: -1 });
    }

    allPlayableBlocks.forEach(({ block, index }) => {
        const result = findBestPlacementForBlock(grid, block, gridWidth, gridHeight);
        if (result && result.score > bestScore) {
            bestScore = result.score;
            bestMove = { blockIndex: index, row: result.move.row, col: result.move.col };
        }
    });

    return bestMove;
};