
# 5. Core Logic & Utilities

This document explores the internal workings of the game, focusing on the main logic hook and the utility functions that support it.

## The Game Logic Hook: `hooks/useGameLogic.ts`

This custom hook is the brain of the application. It encapsulates all the state and logic required for a game session, providing a clean interface for the `GameScreen` component.

### State Management
`useGameLogic` manages the entire game state using `useState`:
- `grid: GridType`: The 2D array representing the game board.
- `score: number`: The player's current score.
- `currentBlocks: (Block | null)[]`: The array of three available blocks.
- `gameOver: boolean`: A flag indicating if the game has ended.
- `powerUpCharge: number`: The current charge level for power-ups.
- `isPowerUpReady: boolean`: True if a power-up can be activated.
- `activePowerUp: ActivePowerUp`: The currently selected power-up ('bomb', 'zap', 'swap').
- And more for animations and hints (`clearingCells`, `placedCells`, `hint`).

### Key Functions & Effects

- **`requestNextBlocks()`**:
  - Calls `utils/blockGenerator.ts` to get the next three block IDs based on the current `grid` and `score`.
  - Updates the `currentBlocks` state.

- **`useEffect` (Game Over Check)**:
  - Runs whenever the `grid` or `currentBlocks` change.
  - It calls `isGameOver()` from `gridUtils` to check if any of the current blocks can be placed.
  - If no moves are possible, it sets `gameOver` to `true`.

- **`executePlacement(...)`**:
  - The core function for placing a block on the grid.
  - It updates the grid state by calling `placeBlock()`.
  - It checks for and clears completed lines using `clearLines()`.
  - It calculates the score for the move and updates the `score` state.
  - It handles the power-up charge logic.
  - It sets the placed block in `currentBlocks` to `null`.
  - If all blocks are used, it triggers `requestNextBlocks()`.

- **`smartPlaceBlock(...)`**:
  - A user-friendly wrapper around block placement.
  - It first tries to place the block exactly where it was dropped.
  - If that fails, it uses `findSmartPlacement()` from `placementUtils` to search for the nearest valid placement spot, making the drag-and-drop feel more forgiving.

- **Power-Up Logic (`activatePowerUp`, `handleGridPowerUp`)**:
  - These functions manage the state transitions for selecting and using power-ups, interacting with the grid via functions like `explodeBomb` and `clearRowAndColumn`.

- **`restartGame()`**:
  - Resets all game-related state variables to their initial values for a new game.

## Utility Modules (`/utils`)

### `utils/gridUtils.ts`
This module contains a suite of pure functions for grid manipulation and analysis.
- `createEmptyGrid(...)`: Generates a new grid of a given size, filled with `0`.
- `canPlaceBlock(...)`: Checks if a block can be legally placed at a specific coordinate.
- `placeBlock(...)`: Returns a *new* grid with a block placed on it.
- `clearLines(...)`: Returns a *new* grid with completed rows/columns removed, along with information about what was cleared.
- `isGameOver(...)`: Determines if the game should end.
- `explodeBomb(...)` / `clearRowAndColumn(...)`: Implements the logic for power-ups.

### `utils/blockGenerator.ts`
Responsible for the procedural generation of blocks.
- `generateNextBlocks(...)`: The main function that intelligently selects three new blocks. Its logic is based on:
  1. Filtering all blocks to find ones that can be placed.
  2. If the score is low, prioritizing blocks that can clear lines.
  3. Using a probability algorithm based on score to decide between "easy" and "hard" blocks.
  4. Returning a shuffled list of three unique block IDs.

### `utils/aiPlayer.ts`
Implements the logic for the hint system.
- `findBestMove(...)`: Iterates through every possible move (each block in each valid position).
- `calculateHeuristics(...)`: For each simulated move, this function scores the resulting grid. A good score is achieved by clearing lines, creating few holes, and maintaining a low, flat stack of blocks. The move leading to the highest-scoring grid is chosen as the "best move."

### `utils/scoreManager.ts`
Handles persistence of scores.
- `loadScores()`: Reads and parses the score data from `localStorage`.
- `saveScores()`: Serializes and writes the current scores to `localStorage`.
- `addScore()`: Adds a new score entry, updates the "top" and "recent" lists, and saves the result.

### `utils/audioManager.ts`
A self-contained class for sound effects.
- It uses the Web Audio API to synthesize sounds like clicks, swooshes, and alerts from scratch. This avoids the need to load and manage external audio files, keeping the application lightweight.
