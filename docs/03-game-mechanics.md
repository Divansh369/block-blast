
# 3. Game Mechanics

This document explains the rules, systems, and core mechanics of Gemini Block Blast from a player's perspective.

## Game Objective

The primary goal is to score as many points as possible by placing blocks on a grid. When a full row or a full column is completed, the line is cleared, freeing up space on the grid and awarding bonus points. The game ends when the player can no longer place any of the three available blocks.

## Game Modes

Players can choose between two distinct modes on the home screen:

- **Classic Mode**:
  - **Grid Size**: 8x8
  - **Difficulty**: Adaptive. The game starts with simpler blocks and gradually introduces more complex shapes as the player's score increases. This mode is designed for a longer, more strategic session.

- **Intense Mode**:
  - **Grid Size**: 5x5
  - **Difficulty**: Consistently high. The smaller grid makes every placement critical, and the block generation algorithm does not give players "easy" blocks. This mode is for a quick, challenging puzzle experience.

## Scoring System

Points are awarded for two main actions:

1.  **Placing a Block**: The player receives 10 points for each individual cell in a placed block. (e.g., placing a 2x2 square awards 40 points).
2.  **Clearing Lines**: A significant bonus is awarded for clearing rows or columns. The formula is `(linesCleared ^ 2) * 100`.
    - 1 line: 100 bonus points
    - 2 lines: 400 bonus points
    - 3 lines: 900 bonus points
    - and so on...

## Difficulty Scaling (Classic Mode)

The game's difficulty is not static. It is visualized by the **Difficulty Indicator** on the game screen, which progresses through several ranks:

- **Rookie**: 0 - 999 points
- **Adept**: 1000 - 2499 points
- **Veteran**: 2500 - 4999 points
- **Elite**: 5000 - 9999 points
- **Master**: 10,000+ points

This progression is directly tied to the block generation logic in `utils/blockGenerator.ts`. As the score increases, the probability of receiving larger, more complex blocks (like the U-shape or 3x3 square) increases, while the probability of simple blocks (like dots) decreases.

## Block Generation

- The game presents the player with three blocks at a time.
- The generation algorithm ensures that at least one placement is possible for every block it provides.
- **Early Game Assistance (Score < 1000)**: The algorithm actively tries to provide at least one block that can help the player clear an existing line, creating a more forgiving start to the game.

## Power-Ups

If enabled on the home screen, players can use special abilities.

- **Charging**: The power-up meter is filled by scoring points. A full charge is reached at **1500 points**. Once charged, the meter stops until a power-up is used.
- **Activation**: Once the meter is full, the player can click one of the three power-up buttons.

### Power-Up Types

1.  **Bomb 💣**: After activation, the player clicks on a grid cell. This clears a 3x3 area centered on the clicked cell.
2.  **Zap ⚡️**: After activation, the player clicks on a grid cell. This clears the entire row and column that intersect at the clicked cell.
3.  **Swap 🔄**: This is an instant-use power-up. It discards the current three blocks and generates a new set of three.

Using any power-up consumes the full charge, and the player must score another 1500 points to use another one.

## Hint System

The "Get Hint" button uses a local AI (`utils/aiPlayer.ts`) to find the best possible move. The AI simulates placing each of the three available blocks in every valid position on the grid. It evaluates the resulting board state using a heuristic that rewards:
1.  Clearing lines (highest priority).
2.  Minimizing the number of "holes" (empty cells under filled ones).
3.  Keeping the overall height of blocks low and the surface "flat" (low bumpiness).

The best-scoring move is then highlighted on the grid for the player.
