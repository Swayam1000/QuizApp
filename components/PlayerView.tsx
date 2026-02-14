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

const NAME_OPTIONS = [
  'Kalgi',
  'Nikhil',
  'Vasudha',
  'Madhura',
  'Maarten',
  'Atharva',
  'Pragya'
];

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
    const takenNames = new Set(
      Object.values(gameState.players).map((p: Player) => p.name)
    );

    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex items-center justify-center p-6 text-stone-900">
        <div className="w-full max-w-sm space-y-8 glass-card p-7 rounded-3xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold display-font text-stone-900 mb-2">
              Building Superagency
            </h1>
            <p className="text-stone-500">Pick your name to join</p>
          </div>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); onJoin(name); }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              {NAME_OPTIONS.map((option) => {
                const isTaken = takenNames.has(option);
                const isSelected = name === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setName(option)}
                    disabled={isTaken}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold border transition-all ${
                      isTaken
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <button 
              type="submit"
              disabled={!name || takenNames.has(name)}
              className="w-full btn-primary font-bold py-4 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
            >
              Continue
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
                {isCorrect ? `+${10} points` : 'Better luck next time'}
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
        
        <div className={`grid gap-4 flex-1 max-h-[500px] reveal-in ${currentQuestion.options.length === 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {currentQuestion.options.map((opt, i) => (
            (() => {
              const optionText = opt.text.trim();
              const lower = optionText.toLowerCase();
              const isHuman = lower.includes('human');
              const isAI = lower === 'ai' || lower.includes(' ai') || lower.includes('ai ');
              const baseStyle = isHuman
                ? 'from-teal-600 to-emerald-600 shadow-teal-900/20'
                : isAI
                ? 'from-amber-600 to-orange-600 shadow-orange-900/20'
                : 'from-stone-700 to-stone-600 shadow-stone-900/20';

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setHasSubmitted(true);
                    onAnswer(opt.id);
                  }}
                  className={`h-full min-h-[140px] rounded-2xl flex flex-col items-start justify-center px-6 py-5 text-left transition-transform active:scale-[0.98] shadow-xl bg-gradient-to-br ${baseStyle}`}
                >
                  <span className="text-xs uppercase tracking-[0.14em] text-white/70 font-semibold mb-2">Tap to vote</span>
                  <span className="text-3xl md:text-4xl font-black text-white display-font leading-tight">{optionText}</span>
                </button>
              );
            })()
          ))}
        </div>
      </div>
    </div>
  );
};
