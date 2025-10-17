
# 2. Project Structure

This document provides a breakdown of the directory and file structure of the Gemini Block Blast application. Understanding this structure is key to navigating the codebase.

```
/
├── components/
│   ├── BlockDisplay.tsx
│   ├── CustomDragLayer.tsx
│   ├── DifficultyIndicator.tsx
│   ├── GameOver.tsx
│   ├── GridCell.tsx
│   ├── NextBlocks.tsx
│   ├── PowerUpDisplay.tsx
│   └── ScoreBoard.tsx
├── docs/
│   ├── 01-introduction.md
│   ├── 02-project-structure.md
│   ├── ... (all documentation files)
├── hooks/
│   └── useGameLogic.ts
├── screens/
│   ├── GameScreen.tsx
│   └── HomePage.tsx
├── services/
│   └── geminiService.ts
├── utils/
│   ├── aiPlayer.ts
│   ├── audioManager.ts
│   ├── blockGenerator.ts
│   ├── gridUtils.ts
│   ├── placementUtils.ts
│   └── scoreManager.ts
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
└── types.ts
```

## Root Directory

- **`index.html`**: The main HTML entry point for the application. It includes the import map for dependencies and the root element where the React app is mounted.
- **`index.tsx`**: The top-level script that renders the React application into the `root` element in `index.html`.
- **`App.tsx`**: The root React component. It manages the primary application state (which screen is active) and acts as a router between the `HomePage` and `GameScreen`.
- **`constants.ts`**: Contains all static, game-wide constants, such as grid sizes and the master definitions for every block shape (`BLOCK_DEFINITIONS`).
- **`types.ts`**: Centralized location for all TypeScript type and interface definitions used throughout the project.
- **`metadata.json`**: Configuration file for the hosting environment, defining the app's name and description.

## Directories

### `/components`
Contains reusable React components that make up the game's UI. These are generally "dumb" components that receive props and render UI elements.

- **`BlockDisplay.tsx`**: Renders a single block in the "Next Blocks" area.
- **`CustomDragLayer.tsx`**: Renders the visual representation of a block being dragged by the user.
- **`DifficultyIndicator.tsx`**: The UI for showing the current difficulty level in Classic mode.
- **`GameOver.tsx`**: The modal that appears when the game ends.
- **`GridCell.tsx`**: A single cell within the game grid.
- **`NextBlocks.tsx`**: The container for the three available blocks.
- **`PowerUpDisplay.tsx`**: The panel showing power-up charge and activation buttons.
- **`ScoreBoard.tsx`**: The pop-up UI for displaying score history.

### `/hooks`
Home to custom React hooks that encapsulate complex state and logic.

- **`useGameLogic.ts`**: The core of the application. This hook manages the entire game state, including the grid, score, blocks, game over status, and all game actions.

### `/screens`
Top-level components that represent a full screen or view in the application.

- **`GameScreen.tsx`**: The main game view, combining the grid, score, blocks, and other UI elements into a cohesive experience.
- **`HomePage.tsx`**: The application's main menu and new game configuration screen.

### `/services`
Intended for modules that handle communication with external APIs.

- **`geminiService.ts`**: This file is intentionally blank. It previously contained the Gemini API integration, which has been removed in favor of a local block generation algorithm.

### `/utils`
Contains pure functions and helper modules that perform specific tasks for the game logic.

- **`aiPlayer.ts`**: Implements the local AI for the hint system.
- **`audioManager.ts`**: A class that generates all sound effects using the Web Audio API.
- **`blockGenerator.ts`**: The algorithm for generating new blocks based on score and grid state.
- **`gridUtils.ts`**: A collection of pure functions for manipulating and analyzing the game grid.
- **`placementUtils.ts`**: Helper functions for the "smart" block placement logic.
- **`scoreManager.ts`**: Functions for saving, loading, and updating scores in `localStorage`.
