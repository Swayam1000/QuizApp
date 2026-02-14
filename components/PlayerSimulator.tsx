import React, { useState } from 'react';
import { GameState } from '../types';
import { PlayerView } from './PlayerView';
import { X } from 'lucide-react';

interface PlayerSimulatorProps {
  gameState: GameState;
  onClose: () => void;
  // Direct callbacks to host logic
  onJoin: (name: string, id: string) => void;
  onAnswer: (optionId: string, id: string) => void;
}

export const PlayerSimulator: React.FC<PlayerSimulatorProps> = ({ gameState, onClose, onJoin, onAnswer }) => {
  // Unique simulator ID
  const [simulatorId] = useState(() => 'sim_' + Math.random().toString(36).substr(2, 5));

  const handleJoin = (name: string) => {
    onJoin(name, simulatorId);
  };

  const handleAnswer = (optionId: string) => {
    onAnswer(optionId, simulatorId);
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] h-[600px] bg-white border border-stone-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-stone-100 p-3 flex justify-between items-center border-b border-stone-200 cursor-move">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Player Simulator</span>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 scale-[0.9] origin-top">
          <PlayerView 
            gameState={gameState} 
            playerId={simulatorId}
            isConnected={true} // Simulator is always connected
            onJoin={handleJoin} 
            onAnswer={handleAnswer} 
          />
        </div>
      </div>
    </div>
  );
};