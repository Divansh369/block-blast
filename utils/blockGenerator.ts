import { GridType, Block } from '../types';
import { ALL_BLOCK_IDS, BLOCK_MAP } from '../constants';
import { canPlaceBlock, placeBlock, clearLines } from './gridUtils';

const EASY_BLOCKS = ["DOT_1", "DOT_2", "I_SHAPE_2", "I_SHAPE_HORIZONTAL_2", "SQUARE_2x2"];
const HARD_BLOCKS = [
    "L_SMALL", "L_SMALL_MIRRORED", "I_SHAPE_3", "I_SHAPE_HORIZONTAL_3", "T_SHAPE_SMALL", "CORNER_SMALL",
    "L_LARGE", "L_LARGE_MIRRORED", "Z_SHAPE", "Z_SHAPE_MIRRORED", "U_SHAPE", "SQUARE_3x3"
];

const canPlace = (grid: GridType, block: Block) => {
  const gridHeight = grid.length;
  const gridWidth = grid[0].length;
  for (let r = 0; r <= gridHeight - block.height; r++) {
    for (let c = 0; c <= gridWidth - block.width; c++) {
      if (canPlaceBlock(grid, block, r, c, gridWidth, gridHeight)) {
        return true;
      }
    }
  }
  return false;
};

const canBlockClearLine = (grid: GridType, block: Block): boolean => {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    for (let r = 0; r <= gridHeight - block.height; r++) {
        for (let c = 0; c <= gridWidth - block.width; c++) {
            if (canPlaceBlock(grid, block, r, c, gridWidth, gridHeight)) {
                const tempGrid = placeBlock(grid, block, r, c);
                const { linesCleared } = clearLines(tempGrid, gridWidth, gridHeight);
                if (linesCleared > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

export const generateNextBlocks = (grid: GridType, score: number, difficultyFactor: number): string[] => {
  const placeableBlockIds = ALL_BLOCK_IDS.filter(id => canPlace(grid, BLOCK_MAP[id]));

  if (placeableBlockIds.length < 3) {
      // Fallback if not enough blocks can be placed
      const shuffled = [...placeableBlockIds];
      while (shuffled.length < 3) {
          shuffled.push(ALL_BLOCK_IDS[Math.floor(Math.random() * ALL_BLOCK_IDS.length)]);
      }
      return shuffled.sort(() => 0.5 - Math.random()).slice(0, 3);
  }
  
  const nextBlockIds: string[] = [];

  // At low scores, try to add one helpful block
  if (score < 1000) {
      const lineClearingBlocks = placeableBlockIds.filter(id => canBlockClearLine(grid, BLOCK_MAP[id]));
      if (lineClearingBlocks.length > 0) {
          const helpfulBlock = lineClearingBlocks[Math.floor(Math.random() * lineClearingBlocks.length)];
          nextBlockIds.push(helpfulBlock);
      }
  }

  const hardBlockProbability = Math.min(0.9, (score / 2000) * 0.5 + difficultyFactor * 0.5);
  const placeableEasy = placeableBlockIds.filter(id => EASY_BLOCKS.includes(id));
  const placeableHard = placeableBlockIds.filter(id => HARD_BLOCKS.includes(id));

  while (nextBlockIds.length < 3) {
      const isHard = Math.random() < hardBlockProbability;
      let choicePool: string[];

      if (isHard && placeableHard.length > 0) {
          choicePool = placeableHard;
      } else if (placeableEasy.length > 0) {
          choicePool = placeableEasy;
      } else {
          choicePool = placeableBlockIds;
      }
      
      if (choicePool.length > 0) {
          const blockId = choicePool[Math.floor(Math.random() * choicePool.length)];
          if (!nextBlockIds.includes(blockId)) { // Avoid duplicates
              nextBlockIds.push(blockId);
          }
      } else {
           // This case should be rare, but as a safeguard:
          const randomBlock = placeableBlockIds[Math.floor(Math.random() * placeableBlockIds.length)];
           if (!nextBlockIds.includes(randomBlock)) {
              nextBlockIds.push(randomBlock);
          }
      }
  }
  
  return nextBlockIds.sort(() => 0.5 - Math.random()); // Shuffle the final list
};

const COOL_COLORS = ['bg-cyan-500', 'bg-blue-500', 'bg-teal-500'];
const WARM_COLORS = ['bg-orange-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-400'];

export const getDifficultyColor = (difficultyFactor: number): string => {
    if (difficultyFactor < 0.6) {
        return COOL_COLORS[Math.floor(Math.random() * COOL_COLORS.length)];
    }
    return WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)];
};