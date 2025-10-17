import { Block, GridType } from '../types';

export const createEmptyGrid = (width: number, height: number): GridType => {
  return Array.from({ length: height }, () => Array(width).fill(0));
};

export const canPlaceBlock = (
  grid: GridType,
  block: Block,
  startRow: number,
  startCol: number,
  gridWidth: number,
  gridHeight: number
): boolean => {
  if (startRow < 0 || startCol < 0 || startRow + block.height > gridHeight || startCol + block.width > gridWidth) {
    return false;
  }

  for (let r = 0; r < block.height; r++) {
    for (let c = 0; c < block.width; c++) {
      if (block.shape[r][c] === 1 && grid[startRow + r][startCol + c] !== 0) {
        return false;
      }
    }
  }
  return true;
};

export const placeBlock = (
  grid: GridType,
  block: Block,
  row: number,
  col: number
): GridType => {
  const newGrid = grid.map(r => [...r]);
  for (let r = 0; r < block.height; r++) {
    for (let c = 0; c < block.width; c++) {
      if (block.shape[r][c] === 1) {
        newGrid[row + r][col + c] = block.color;
      }
    }
  }
  return newGrid;
};

export const clearLines = (grid: GridType, width: number, height: number): { newGrid: GridType; clearedRows: number[]; clearedCols: number[]; linesCleared: number } => {
    let newGrid = grid.map(r => [...r]);
    const clearedRows: number[] = [];
    const clearedCols: number[] = [];

    // Check for full rows
    for (let r = 0; r < height; r++) {
        if (newGrid[r].every(cell => cell !== 0)) {
            clearedRows.push(r);
        }
    }

    // Check for full columns
    for (let c = 0; c < width; c++) {
        let isFull = true;
        for (let r = 0; r < height; r++) {
            if (newGrid[r][c] === 0) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            clearedCols.push(c);
        }
    }

    const linesCleared = clearedRows.length + clearedCols.length;
    if (linesCleared === 0) {
        return { newGrid, clearedRows: [], clearedCols: [], linesCleared: 0 };
    }

    // Clear the lines
    clearedRows.forEach(r => {
        for (let c = 0; c < width; c++) newGrid[r][c] = 0;
    });
    clearedCols.forEach(c => {
        for (let r = 0; r < height; r++) newGrid[r][c] = 0;
    });
    
    return { newGrid, clearedRows, clearedCols, linesCleared };
};


export const isGameOver = (grid: GridType, blocks: (Block | null)[], heldBlock: Block | null, width: number, height: number): boolean => {
    const allCheckableBlocks = [...blocks, heldBlock];
    for (const block of allCheckableBlocks) {
        if (block) {
            for (let r = 0; r <= height - block.height; r++) {
                for (let c = 0; c <= width - block.width; c++) {
                    if (canPlaceBlock(grid, block, r, c, width, height)) {
                        return false; // Found at least one possible move
                    }
                }
            }
        }
    }
    return true; // No blocks can be placed
};

export const explodeBomb = (grid: GridType, row: number, col: number, width: number, height: number): GridType => {
    const newGrid = grid.map(r => [...r]);
    const radius = 1; 

    for (let r = Math.max(0, row - radius); r <= Math.min(height - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(width - 1, col + radius); c++) {
            newGrid[r][c] = 0;
        }
    }
    return newGrid;
};

// New functions for Line Clear power-up
export const clearRowAndColumn = (grid: GridType, row: number, col: number, width: number, height: number): GridType => {
    const newGrid = grid.map(r => [...r]);
    // Clear row
    for (let c = 0; c < width; c++) {
        newGrid[row][c] = 0;
    }
    // Clear column
    for (let r = 0; r < height; r++) {
        newGrid[r][col] = 0;
    }
    return newGrid;
};