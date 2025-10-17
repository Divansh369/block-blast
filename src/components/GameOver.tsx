import React from 'react';
import { ScoreEntry } from '../types';

interface GameOverProps {
    score: number;
    onRestart: () => void;
    onSaveScore: () => void;
    lastScore: ScoreEntry | null;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onSaveScore, lastScore }) => (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
        <h2 className="text-4xl font-orbitron font-bold text-red-500">Game Over</h2>
        <p className="text-xl mt-2">Final Score: {score}</p>
        <div className="flex gap-4 mt-6">
            <button onClick={onRestart} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-transform hover:scale-105">
                Play Again
            </button>
            {lastScore && (
                <button onClick={onSaveScore} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105">
                    Save Score
                </button>
            )}
        </div>
    </div>
);

export default GameOver;