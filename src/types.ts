// FIX: Removed self-import which caused declaration conflicts.
// import { Block, Shape } from './types';

export type Shape = number[][];

export interface Block {
  id: string;
  shape: Shape;
  color: string;
  height: number;
  width: number;
}

export type GridCellValue = 0 | string;
export type GridType = GridCellValue[][];

export type GameMode = 'classic' | 'intense';

export interface GameSettings {
  mode: GameMode;
  playerName: string;
  sound: boolean;
  theme: string;
  powerUpsEnabled: boolean;
}

export interface ScoreEntry {
  id: string;
  score: number;
  timestamp: number;
  playerName: string;
  mode: GameMode;
}

export interface SavedScores {
  top: ScoreEntry[];
  recent: ScoreEntry[];
  saved: ScoreEntry[];
}