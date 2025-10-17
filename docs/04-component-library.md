
# 4. Component Library

This document details the React components used to build the Gemini Block Blast UI.

## Root Component

### `App.tsx`
The main application component. It acts as a simple router, managing the top-level `gameState` to switch between the home screen and the game screen.

- **State**:
  - `gameState: 'home' | 'playing'`: Determines which screen is visible.
  - `gameSettings: GameSettings | null`: Stores the configuration for the current game session.
- **Responsibilities**:
  - Renders `<HomePage>` or `<GameScreen>` based on `gameState`.
  - Passes the `onStartGame` and `onGoHome` callbacks to child components.

## Screen Components

### `screens/HomePage.tsx`
The main menu and entry point for the game.

- **Purpose**: Allows the player to configure and start a new game.
- **Props**:
  - `onStartGame: (settings: GameSettings) => void`: Callback function to transition the app to the 'playing' state.
- **Responsibilities**:
  - Manages local state for player name, game mode, and settings (sound, power-ups).
  - Provides UI for players to make selections.
  - Calls `onStartGame` with the chosen `GameSettings` object.

### `screens/GameScreen.tsx`
The primary UI for the game itself. This component orchestrates all other game-related components and logic.

- **Purpose**: To display the game grid, player score, available blocks, and handle all user interactions during gameplay.
- **Props**:
  - `settings: GameSettings`: The configuration for the current game.
  - `onGoHome: () => void`: Callback to return to the home screen.
- **Responsibilities**:
  - Initializes the core game state using the `useGameLogic` hook.
  - Manages the state for drag-and-drop operations (`draggedBlockIndex`, `hoveredCell`).
  - Renders the game grid using `<GridCell>` components.
  - Renders the UI panels for `<NextBlocks>`, `<ScoreBoard>`, `<PowerUpPanel>`, and `<DifficultyIndicator>`.
  - Handles drop events on the grid to place blocks.

## UI Components

### `components/BlockDisplay.tsx`
Renders a single, draggable block shape within the "Next Blocks" panel.

- **Purpose**: To visually represent a block piece.
- **Props**: `block`, `onDragStart`, `onDragEnd`, `index`.

### `components/CustomDragLayer.tsx`
Renders the "ghost" image of a block that follows the user's cursor during a drag operation.

- **Purpose**: To provide clear visual feedback for which block is being dragged.
- **Props**: `draggedBlockInfo`.

### `components/DifficultyIndicator.tsx`
Displays the player's current difficulty level and progress to the next level.

- **Purpose**: To give players feedback on the game's adaptive difficulty.
- **Props**: `score`, `mode`.

### `components/GameOver.tsx`
A modal overlay that appears when the game ends.

- **Purpose**: To display the final score and offer options to restart or save the score.
- **Props**: `score`, `onRestart`, `onSaveScore`, `lastScore`.

### `components/GridCell.tsx`
Represents a single cell in the game grid.

- **Purpose**: The building block of the game board. It handles rendering different cell states and DOM events.
- **Props**: `value`, event handlers (`onDrop`, `onClick`, etc.), and boolean state flags (`isHovered`, `isClearing`, `isHinted`, etc.).

### `components/NextBlocks.tsx`
A container that displays the three currently available blocks.

- **Purpose**: To show the player which pieces they can use next.
- **Props**: `currentBlocks`, `draggedBlockIndex`, `onDragStart`, `onDragEnd`.

### `components/PowerUpDisplay.tsx`
The UI panel for the power-up system.

- **Purpose**: Shows the power-up charge progress and provides buttons to activate charged power-ups.
- **Props**: `charge`, `threshold`, `isReady`, `activePowerUp`, `onActivate`.

### `components/ScoreBoard.tsx`
A toggleable overlay that shows score history.

- **Purpose**: To display the top, recent, and saved scores fetched from local storage.
- **Props**: `scores`.
