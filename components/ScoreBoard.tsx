
import React, { useState } from 'react';
import { ScoreEntry, SavedScores } from '../types';

interface ScoreBoardProps {
    scores: SavedScores;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
    const [show, setShow] = useState(false);

    const renderScoreList = (title: string, list: ScoreEntry[]) => (
        <div className="mb-4">
            <h3 className="font-orbitron text-lg text-cyan-400 mb-2">{title}</h3>
            {list.length > 0 ? (
                <ul className="space-y-1">
                    {list.map(s => (
                        <li key={s.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                            <span className="text-slate-300">{s.score} points</span>
                            <span className="text-xs text-slate-400">{new Date(s.timestamp).toLocaleDateString()}</span>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-slate-500 italic">No scores yet.</p>}
        </div>
    );
    
    return (
      <>
        <button onClick={() => setShow(!show)} className="fixed top-4 right-4 z-50 bg-purple-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-purple-700 transition-all">
          {show ? 'Hide Scores' : 'Show Scores'}
        </button>
        {show && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md text-white">
                    <h2 className="font-orbitron text-2xl text-center mb-6 text-purple-400">Score History</h2>
                    {renderScoreList("Top 3 Scores", scores.top)}
                    {renderScoreList("Last 3 Games", scores.recent)}
                    {renderScoreList("Saved Scores", scores.saved)}
                    <button onClick={() => setShow(false)} className="mt-4 w-full bg-slate-600 text-white font-bold py-2 px-4 rounded hover:bg-slate-700 transition-all">Close</button>
                </div>
            </div>
        )}
      </>
    );
};

export default ScoreBoard;