import { GridType, Block } from '../types';
import { canPlaceBlock } from './gridUtils';

export const findSmartPlacement = (
    grid: GridType, 
    block: Block, 
    startRow: number, 
    startCol: number, 
    width: number, 
    height: number
): { row: number; col: number } | null => {
    const MAX_SEARCH_RADIUS = Math.max(width, height);

    // First, check the exact drop location, as it's the most likely intended spot.
    if (canPlaceBlock(grid, block, startRow, startCol, width, height)) {
        return { row: startRow, col: startCol };
    }

    // If the drop spot is invalid, perform an expanding square search outwards.
    for (let radius = 1; radius <= MAX_SEARCH_RADIUS; radius++) {
        // Top & Bottom edges
        for (let c = startCol - radius; c <= startCol + radius; c++) {
            if (canPlaceBlock(grid, block, startRow - radius, c, width, height)) {
                return { row: startRow - radius, col: c };
            }
            if (canPlaceBlock(grid, block, startRow + radius, c, width, height)) {
                return { row: startRow + radius, col: c };
            }
        }
        
        // Left & Right edges (excluding corners already checked)
        for (let r = startRow - radius + 1; r < startRow + radius; r++) {
             if (canPlaceBlock(grid, block, r, startCol - radius, width, height)) {
                return { row: r, col: startCol - radius };
            }
            if (canPlaceBlock(grid, block, r, startCol + radius, width, height)) {
                return { row: r, col: startCol + radius };
            }
        }
    }
    return null;
};