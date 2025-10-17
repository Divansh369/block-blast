import React from 'react';
import { GameMode } from '../types';

interface DifficultyIndicatorProps {
  score: number;
  mode: GameMode;
}

const DIFFICULTY_LEVELS = [
  { threshold: 0, name: 'Rookie', color: 'bg-cyan-500' },
  { threshold: 1000, name: 'Adept', color: 'bg-green-500' },
  { threshold: 2500, name: 'Veteran', color: 'bg-yellow-500' },
  { threshold: 5000, name: 'Elite', color: 'bg-orange-500' },
  { threshold: 10000, name: 'Master', color: 'bg-red-500' },
];

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({ score, mode }) => {
  if (mode === 'intense') {
    return (
      <div className="text-center w-full max-w-[200px]">
        <h2 className="font-orbitron text-2xl text-red-400">Difficulty</h2>
        <p className="font-mono text-xl tracking-widest">INTENSE</p>
      </div>
    );
  }
  
  const currentLevelIndex = DIFFICULTY_LEVELS.slice().reverse().findIndex(level => score >= level.threshold);
  const currentLevel = DIFFICULTY_LEVELS[DIFFICULTY_LEVELS.length - 1 - currentLevelIndex];
  const nextLevel = DIFFICULTY_LEVELS[DIFFICULTY_LEVELS.length - currentLevelIndex];

  let progress = 0;
  if (nextLevel) {
    const range = nextLevel.threshold - currentLevel.threshold;
    const currentProgress = score - currentLevel.threshold;
    progress = Math.min(100, (currentProgress / range) * 100);
  } else {
    progress = 100; // Max level
  }
  
  return (
    <div className="text-center w-full max-w-[200px]">
      <h2 className="font-orbitron text-2xl text-purple-300">Difficulty</h2>
      <p className={`font-mono text-xl tracking-widest mb-2 ${currentLevel.color.replace('bg-','text-')}`}>{currentLevel.name}</p>
      <div className="relative w-full h-4 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
        <div 
          className={`absolute top-0 left-0 h-full ${currentLevel.color} rounded-full transition-all duration-500 ease-out`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
       {nextLevel && <p className="text-xs text-slate-400 mt-1">Next: {nextLevel.threshold}pts</p>}
    </div>
  );
};

export default DifficultyIndicator;
