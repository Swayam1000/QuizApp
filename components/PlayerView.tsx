import React, { useState, useEffect } from 'react';
import { GameState, GameStatus, Player } from '../types';
import { Loader2, Check, X, Coffee, Crown, RefreshCw } from 'lucide-react';

interface PlayerViewProps {
  gameState: GameState;
  playerId: string;
  isConnected: boolean; // New prop
  onJoin: (name: string) => void;
  onAnswer: (optionId: string) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({ gameState, playerId, isConnected, onJoin, onAnswer }) => {
  const [name, setName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const player = gameState.players[playerId];

  // Reset local submission state when question changes
  useEffect(() => {
    if (gameState.status === GameStatus.QUESTION_ACTIVE) {
      if (!player?.lastAnswer) {
        setHasSubmitted(false);
      }
    }
  }, [gameState.currentQuestionIndex, gameState.status, player]);

  // 0. Connection Loading Screen
  if (!isConnected) {
    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col items-center justify-center p-8 text-center space-y-6 text-stone-900">
        <Loader2 className="w-12 h-12 text-stone-400 animate-spin" />
        <h2 className="text-2xl font-bold">Connecting to Host...</h2>
        <p className="text-stone-500 max-w-xs">
          If this takes too long, ensure your phone and the host computer are on the same Wi-Fi, or check the URL.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  // 1. Join Screen
  if (!player) {
    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex items-center justify-center p-6 text-stone-900">
        <div className="w-full max-w-sm space-y-8 glass-card p-7 rounded-3xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold display-font text-stone-900 mb-2">
              Building Superagency
            </h1>
            <p className="text-stone-500">Enter your nickname to join</p>
          </div>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); onJoin(name); }}
            className="space-y-4"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nickname"
              className="w-full bg-white border-2 border-stone-200 rounded-2xl px-6 py-4 text-center text-xl font-bold text-stone-900 focus:border-stone-500 focus:outline-none transition-colors shadow-sm"
              maxLength={12}
              required
            />
            <button 
              type="submit"
              disabled={!name.trim()}
              className="w-full btn-primary font-bold py-4 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
            >
              Join Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Waiting Room / Lobby
  if (gameState.status === GameStatus.LOBBY) {
    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col items-center justify-center p-8 text-center space-y-6 text-stone-900">
        <div className="w-20 h-20 bg-white border border-stone-200 rounded-full flex items-center justify-center animate-bounce shadow-md">
          <Coffee className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-bold">You're in, {player.name}!</h2>
        <p className="text-stone-500">Watch the host screen. The game will start soon.</p>
        <div className="inline-block px-4 py-2 bg-stone-200 rounded-full text-xs font-mono text-stone-600 mt-8">
          ID: {playerId.slice(0,4)}
        </div>
      </div>
    );
  }

  // 3. Game Over
  if (gameState.status === GameStatus.FINISHED) {
    const isWinner = (Object.values(gameState.players) as Player[]).sort((a: Player, b: Player) => b.score - a.score)[0]?.id === playerId;
    
    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col items-center justify-center p-8 text-center text-stone-900">
        {isWinner ? (
          <div className="space-y-6">
            <Crown className="w-24 h-24 text-amber-500 mx-auto animate-pulse" />
            <h1 className="text-4xl font-black text-amber-600">VICTORY!</h1>
            <p className="text-stone-500">You scored {player.score} points.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">🏁</div>
            <h1 className="text-3xl font-bold">Quiz Over</h1>
            <p className="text-xl text-stone-600 font-bold">{player.score} points</p>
            <p className="text-stone-400">Good game!</p>
          </div>
        )}
      </div>
    );
  }

  // 4. Question Active
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  
  // Guard clause for invalid state (missing questions)
  if (!currentQuestion) {
      return (
        <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-8 h-8 text-stone-400 animate-spin mb-4" />
            <p className="text-stone-500">Waiting for quiz data...</p>
        </div>
      );
  }

  const letters = ['A', 'B', 'C', 'D'];
  const colors = [
    'bg-red-500 hover:bg-red-400',
    'bg-blue-500 hover:bg-blue-400',
    'bg-yellow-500 hover:bg-yellow-400',
    'bg-green-500 hover:bg-green-400'
  ];

  if (gameState.status === GameStatus.QUESTION_REVEAL) {
      const myAnswerId = player.lastAnswer;
      const correctOptionId = currentQuestion.options.find(o => o.isCorrect)?.id;
      const isCorrect = myAnswerId === correctOptionId;
      
      return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center ${isCorrect ? 'bg-emerald-600' : 'bg-red-500'}`}>
            <div className="bg-white/20 backdrop-blur-md rounded-full p-8 mb-6">
                {isCorrect ? <Check className="w-16 h-16 text-white" /> : <X className="w-16 h-16 text-white" />}
            </div>
            <h2 className="text-4xl font-black text-white mb-2">{isCorrect ? 'Correct!' : 'Wrong!'}</h2>
            <p className="text-white/90 font-medium text-lg">
                {isCorrect ? `+${100} points` : 'Better luck next time'}
            </p>
            <div className="mt-12 text-white/60 text-sm">
                Wait for the next question...
            </div>
        </div>
      )
  }

  if (hasSubmitted) {
    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col items-center justify-center p-8 text-center text-stone-900">
        <Loader2 className="w-12 h-12 text-stone-400 animate-spin mb-4" />
        <h3 className="text-xl font-bold">Answer Submitted</h3>
        <p className="text-stone-500 mt-2">Waiting for everyone else...</p>
      </div>
    );
  }

  return (
    <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col text-stone-900">
      <div className="p-4 border-b border-stone-200 bg-white/75 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10 shadow-sm">
         <span className="font-bold text-stone-700">{player.name}</span>
         <span className="bg-stone-100 px-3 py-1 rounded-full text-xs font-mono text-stone-600">{player.score} pts</span>
      </div>

      <div className="flex-1 flex flex-col p-4 justify-center gap-4 max-w-md mx-auto w-full">
        <div className="mb-4">
             <h2 className="text-stone-600 text-lg font-medium leading-snug text-center mb-8">
               Select the correct option on the host screen
             </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 flex-1 max-h-[500px] reveal-in">
          {currentQuestion.options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => {
                setHasSubmitted(true);
                onAnswer(opt.id);
              }}
              className={`${colors[i]} h-full rounded-2xl flex flex-col items-center justify-center p-4 transition-transform active:scale-95 shadow-lg`}
            >
              <span className="text-4xl font-black text-white/30 mb-2">{letters[i]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
