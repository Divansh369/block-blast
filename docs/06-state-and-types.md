
# 6. State & Data Structures

This document defines the core data structures, TypeScript types, and constants that shape the application's state.

## Core Type Definitions (`types.ts`)

Understanding these types is essential to understanding the flow of data through the application.

- **`Shape: number[][]`**
  - The fundamental representation of a block's form. It's a 2D array of `0`s and `1`s.
  - Example `L_SMALL`: `[[1, 0], [1, 1]]`

- **`Block`**
  - The primary object representing a playable piece.
  ```typescript
  interface Block {
    id: string;      // Unique identifier, e.g., "SQUARE_2x2"
    shape: Shape;    // The shape matrix
    color: string;   // A Tailwind CSS background color class, e.g., "bg-yellow-400"
    height: number;  // The height of the shape matrix
    width: number;   // The width of the shape matrix
  }
  ```

- **`GridCellValue: 0 | string`**
  - Defines the content of a single cell on the game grid.
  - `0`: The cell is empty.
  - `string`: The cell is filled, and the string contains the color class of the block that filled it.

- **`GridType: GridCellValue[][]`**
  - The 2D array that represents the entire game board.

- **`GameMode: 'classic' | 'intense'`**
  - A union type for the two available game modes.

- **`GameSettings`**
  - An object that holds all the configuration options for a game session, selected on the home screen.
  ```typescript
  interface GameSettings {
    mode: GameMode;
    playerName: string;
    sound: boolean;
    powerUpsEnabled: boolean;
    // ... other settings
  }
  ```

- **`ScoreEntry` & `SavedScores`**
  - These interfaces define the structure for storing and retrieving score data from local storage.
  ```typescript
  interface ScoreEntry {
    id: string;
    score: number;
    timestamp: number;
    playerName: string;
    mode: GameMode;
  }

  interface SavedScores {
    top: ScoreEntry[];
    recent: ScoreEntry[];
    saved: ScoreEntry[];
  }
  ```

## Game Constants (`constants.ts`)

This file centralizes static configuration data, making it easy to tweak the game's balance and content.

- **`CLASSIC_GRID_SIZE` & `INTENSE_GRID_SIZE`**
  - Objects defining the `width` and `height` for each game mode.

- **`BLOCK_DEFINITIONS`**
  - The master "database" of all blocks in the game. It's an object where each key is a block's ID and the value contains its `shape` and `color`. This is the single source of truth for block design.

- **`BLOCKS: Block[]`**
  - An array of `Block` objects. This is generated at runtime by processing `BLOCK_DEFINITIONS` and adding calculated `height` and `width` properties.

- **`BLOCK_MAP: Record<string, Block>`**
  - A key-value map created from the `BLOCKS` array for O(1) lookup of a block by its `id`. This is used frequently by the game logic to retrieve block data.

- **`ALL_BLOCK_IDS: string[]`**
  - An array containing all the keys from `BLOCK_DEFINITIONS`, used by the block generator to know the full pool of available blocks.
