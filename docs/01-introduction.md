
# 1. Introduction

Welcome to the official documentation for **Gemini Block Blast**.

## Overview

Gemini Block Blast is a modern, web-based block puzzle game inspired by classics like Tetris and block-based grid puzzles. The objective is to strategically place a variety of shapes onto a grid to clear full rows and columns, aiming for the highest score possible.

The project was initially designed to leverage the Google Gemini API for dynamic block generation, creating an adaptive difficulty curve. It has since been refactored to use a sophisticated local algorithm, ensuring a complete, offline-first experience while maintaining dynamic difficulty.

## Core Features

- **Two Game Modes**: 
  - **Classic**: A standard 8x8 grid where the difficulty increases as the player's score rises.
  - **Intense**: A challenging 5x5 grid that tests spatial reasoning in a constrained environment.
- **Dynamic Difficulty**: In Classic mode, the game analyzes the player's score to adjust the complexity of the blocks it generates, providing a smooth learning curve for new players and a persistent challenge for veterans.
- **Power-Ups**: An optional system that allows players to charge a power meter by scoring points, unlocking game-changing abilities like clearing a section of the grid or swapping out difficult blocks.
- **Local AI Hint System**: An intelligent hint provider that can analyze the current game state and suggest the optimal move, helping players learn advanced strategies.
- **Score Persistence**: A robust scoring system that tracks top, recent, and player-saved scores using browser `localStorage`.
- **Asset-Free Audio**: All sound effects are generated programmatically using the Web Audio API, resulting in a lightweight and fast-loading application.

## Technology Stack

- **Framework**: [React](https://reactjs.org/) (v19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio**: Web Audio API
- **Build/Setup**: The application is designed to run in a modern browser environment that supports ES modules and `importmap`.
