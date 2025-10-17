import React, { useState, useCallback } from 'react';
import HomePage from './screens/HomePage';
import GameScreen from './screens/GameScreen';
import { GameSettings } from './types';
import { audioManager } from './utils/audioManager';

export default function App() {
  const [gameState, setGameState] = useState<'home' | 'playing'>('home');
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  const handleStartGame = useCallback((settings: GameSettings) => {
    audioManager.init(); // Initialize audio context on user gesture
    setGameSettings(settings);
    setGameState('playing');
  }, []);

  const handleGoHome = useCallback(() => {
    setGameState('home');
    setGameSettings(null);
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen font-poppins">
      {gameState === 'home' && <HomePage onStartGame={handleStartGame} />}
      {gameState === 'playing' && gameSettings && (
        <GameScreen settings={gameSettings} onGoHome={handleGoHome} />
      )}
    </div>
  );
}
