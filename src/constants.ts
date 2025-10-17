import { Block, Shape } from './types';

export const CLASSIC_GRID_SIZE = { width: 8, height: 8, mode: 'classic' as const };
export const INTENSE_GRID_SIZE = { width: 5, height: 5, mode: 'intense' as const };

export const BLOCK_DEFINITIONS: Record<string, { shape: Shape, color: string }> = {
  // Dots
  DOT_1: { shape: [[1]], color: 'bg-cyan-500' },
  DOT_2: { shape: [[1, 1]], color: 'bg-cyan-500' },
  // L-Shapes
  L_SMALL: { shape: [[1, 0], [1, 1]], color: 'bg-orange-500' },
  L_SMALL_MIRRORED: { shape: [[0, 1], [1, 1]], color: 'bg-orange-500' },
  L_LARGE: { shape: [[1, 0], [1, 0], [1, 1]], color: 'bg-orange-500' },
  L_LARGE_MIRRORED: { shape: [[0, 1], [0, 1], [1, 1]], color: 'bg-orange-500' },
  // Square
  SQUARE_2x2: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400' },
  SQUARE_3x3: { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], color: 'bg-yellow-400' },
  // I-Shapes
  I_SHAPE_2: { shape: [[1], [1]], color: 'bg-red-500' },
  I_SHAPE_3: { shape: [[1], [1], [1]], color: 'bg-red-500' },
  I_SHAPE_HORIZONTAL_2: { shape: [[1, 1]], color: 'bg-red-500' },
  I_SHAPE_HORIZONTAL_3: { shape: [[1, 1, 1]], color: 'bg-red-500' },
  // T-Shapes
  T_SHAPE_SMALL: { shape: [[1, 1, 1], [0, 1, 0]], color: 'bg-purple-500' },
  // Z-Shapes
  Z_SHAPE: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-green-500' },
  Z_SHAPE_MIRRORED: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  // U-Shape
  U_SHAPE: { shape: [[1, 0, 1], [1, 1, 1]], color: 'bg-blue-500' },
  // Corner
  CORNER_SMALL: { shape: [[1, 1], [1, 0]], color: 'bg-blue-500' },
};

export const BLOCKS: Block[] = Object.entries(BLOCK_DEFINITIONS).map(([id, { shape, color }]) => ({
  id,
  shape,
  color,
  height: shape.length,
  width: shape[0].length,
}));

export const BLOCK_MAP: Record<string, Block> = BLOCKS.reduce((acc, block) => {
    acc[block.id] = block;
    return acc;
}, {} as Record<string, Block>);

export const ALL_BLOCK_IDS = Object.keys(BLOCK_DEFINITIONS);