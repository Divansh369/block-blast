import React from 'react';
import { ActivePowerUp } from '../hooks/useGameLogic';

interface PowerUpPanelProps {
    charge: number;
    threshold: number;
    isReady: boolean;
    // FIX: Allow activePowerUp to be null when no power-up is active, to match component logic.
    activePowerUp: ActivePowerUp | null;
    onActivate: (type: ActivePowerUp) => void;
}

const PowerUpButton: React.FC<{ type: ActivePowerUp, onActivate: (type: ActivePowerUp) => void, isReady: boolean, activePowerUp: ActivePowerUp | null, children: React.ReactNode }> = 
({ type, onActivate, isReady, activePowerUp, children }) => {
    const isActive = activePowerUp === type;
    return (
        <button
            onClick={() => onActivate(type)}
            disabled={!isReady}
            className={`w-24 h-24 p-2 bg-slate-800/50 rounded-lg flex flex-col items-center justify-center relative border-2 transition-all duration-300 powerup-button
                ${isReady ? 'border-yellow-400 cursor-pointer hover:bg-yellow-500/20' : 'border-slate-700'}
                ${isActive ? 'ring-4 ring-yellow-300 bg-yellow-500/30' : ''}
                ${isReady && !activePowerUp ? 'animate-pulse' : ''}
            `}
        >
            {children}
        </button>
    );
};

const PowerUpPanel: React.FC<PowerUpPanelProps> = ({ charge, threshold, isReady, activePowerUp, onActivate }) => {
    const chargePercentage = (charge / threshold) * 100;

    return (
        <div className="w-full lg:w-auto text-center">
            <h2 className="font-orbitron text-2xl mb-2 text-purple-300">Power-Ups</h2>
            <p className="text-sm text-slate-400 mb-4 h-5">{activePowerUp ? `${activePowerUp.toUpperCase()} MODE ACTIVE` : (isReady ? 'Select Power-Up!' : 'Charge Up')}</p>

            <div className="relative w-full h-4 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600 mb-4">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-500" style={{ width: `${chargePercentage}%` }}></div>
            </div>
            
            <div className="flex gap-2 justify-center">
                <PowerUpButton type="bomb" onActivate={onActivate} isReady={isReady} activePowerUp={activePowerUp}>
                    <span className="text-4xl">💣</span>
                    <span className="font-semibold text-md mt-1">Bomb</span>
                </PowerUpButton>
                <PowerUpButton type="zap" onActivate={onActivate} isReady={isReady} activePowerUp={activePowerUp}>
                    <span className="text-4xl">⚡️</span>
                    <span className="font-semibold text-md mt-1">Zap</span>
                </PowerUpButton>
                <PowerUpButton type="swap" onActivate={onActivate} isReady={isReady} activePowerUp={activePowerUp}>
                    <span className="text-4xl">🔄</span>
                    <span className="font-semibold text-md mt-1">Swap</span>
                </PowerUpButton>
            </div>
        </div>
    );
};

export default PowerUpPanel;