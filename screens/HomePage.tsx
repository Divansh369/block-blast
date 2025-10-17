
import React, { useState } from 'react';
import { GameSettings, GameMode } from '../types';

interface HomePageProps {
  onStartGame: (settings: GameSettings) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const [mode, setMode] = useState<GameMode>('classic');
  const [playerName, setPlayerName] = useState('');
  const [sound, setSound] = useState(true);
  const [powerUps, setPowerUps] = useState(true);

  const handleStart = () => {
    onStartGame({
      mode,
      playerName: playerName.trim() || 'Player',
      sound, 
      theme: 'dark',
      powerUpsEnabled: powerUps,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Gemini Block Blast
        </h1>
        <p className="text-slate-400 text-lg mb-12">An AI-powered puzzle challenge.</p>
      </div>

      <div className="bg-slate-800/50 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <h2 className="font-orbitron text-3xl text-center mb-6 text-yellow-300">New Game</h2>
        
        <div className="mb-6">
          <label htmlFor="playerName" className="block text-slate-300 mb-2 font-semibold">Player Name (Optional)</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded-lg border-2 border-slate-600 focus:border-purple-500 focus:outline-none transition"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 mb-2 font-semibold">Game Mode</label>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('classic')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-left ${mode === 'classic' ? 'bg-purple-600 border-purple-400' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
            >
              <h3 className="font-bold text-lg">Classic</h3>
              <p className="text-sm text-slate-300">A relaxed 8x8 puzzle experience.</p>
            </button>
            <button
              onClick={() => setMode('intense')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-left ${mode === 'intense' ? 'bg-red-600 border-red-400' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
            >
              <h3 className="font-bold text-lg">Intense</h3>
              <p className="text-sm text-slate-300">A fast-paced 5x5 challenge.</p>
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <label className="block text-slate-300 font-semibold">Sound Effects</label>
          <button
            onClick={() => setSound(!sound)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${sound ? 'bg-green-500' : 'bg-slate-600'}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${sound ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <label className="block text-slate-300 font-semibold">Enable Power-ups</label>
          <button
            onClick={() => setPowerUps(!powerUps)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${powerUps ? 'bg-green-500' : 'bg-slate-600'}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${powerUps ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-700 transition-transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default HomePage;
