import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { GameState, GameStatus, Player } from '../types';
import { Users, ArrowRight, RotateCcw, Award, CheckCircle2, ExternalLink, Smartphone, Copy, Loader2, Settings, Globe, Maximize2, X } from 'lucide-react';

interface HostViewProps {
  gameState: GameState;
  hostId: string; // Peer ID
  onNext: () => void;
  onReset: () => void;
  onToggleSimulator: () => void;
  showSimulator: boolean;
}

export const HostView: React.FC<HostViewProps> = ({ gameState, hostId, onNext, onReset, onToggleSimulator, showSimulator }) => {
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const playerCount = Object.keys(gameState.players).length;
  
  // URL State
  const [baseUrl, setBaseUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Automatically detect the correct URL for Cloud Run / Production
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    setBaseUrl(url);
    
    // Check if we are in development/localhost
    const hostname = window.location.hostname;
    setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.'));
  }, []);

  useEffect(() => {
    if (!fullscreenImageUrl) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFullscreenImageUrl(null);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [fullscreenImageUrl]);

  const chartData = useMemo(() => {
    if (!currentQuestion) return [];
    
    const counts: Record<string, number> = {};
    currentQuestion.options.forEach(opt => counts[opt.id] = 0);

    Object.values(gameState.players).forEach((p: Player) => {
      if (p.lastAnswer && counts[p.lastAnswer] !== undefined) {
        counts[p.lastAnswer]++;
      }
    });

    return currentQuestion.options.map((opt, index) => ({
      name: String.fromCharCode(65 + index),
      text: opt.text,
      votes: counts[opt.id],
      isCorrect: opt.isCorrect,
      id: opt.id
    }));
  }, [gameState.players, currentQuestion]);

  // Construct the Join URL
  const joinUrl = hostId && baseUrl
    ? `${baseUrl}#join=${hostId}`
    : '';
    
  // Using API is more reliable than client-side generation without bundlers
  // Optimization for scannability:
  // 1. ecc=M (Medium) reduces density compared to High, making dots larger and easier to scan
  // 2. color=000000 (Black) ensures maximum contrast
  // 3. size=1000x1000 ensures high resolution source for larger display
  const qrCodeUrl = joinUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(joinUrl)}&color=000000&bgcolor=ffffff&qzone=4&ecc=M`
    : '';

  const copyLink = () => {
    if (joinUrl) {
      navigator.clipboard.writeText(joinUrl);
      alert('Link copied to clipboard!');
    }
  };

  const openPlayerView = () => {
    if (joinUrl) window.open(joinUrl, '_blank');
  };

  const openWebsiteDemo = () => {
    if (currentQuestion?.websiteUrl) {
      window.open(currentQuestion.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const openImageFullscreen = (url: string) => {
    setFullscreenImageUrl(url);
  };

  const closeImageFullscreen = () => {
    setFullscreenImageUrl(null);
  };

  const renderHeader = () => (
    <div className="p-6 flex justify-between items-center border-b border-stone-200 bg-white/70 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
      <h2 className="text-xl font-bold text-stone-600 display-font">
        Question {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
      </h2>
      <div className="flex items-center gap-4">
         <button 
            onClick={onToggleSimulator}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${showSimulator ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-700 border-stone-200 hover:bg-amber-50'}`}
         >
           <Smartphone className="w-4 h-4" />
           Test Player
         </button>
         <div className="flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-200 rounded-full">
            <Users className="w-4 h-4 text-stone-500" />
            <span className="font-mono text-stone-900 font-bold">{playerCount}</span>
         </div>
      </div>
    </div>
  );

  if (gameState.status === GameStatus.LOBBY) {
    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] text-stone-900 flex flex-col items-center justify-center p-8">
        <div className="max-w-6xl w-full text-center space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-6xl font-black display-font text-stone-900 tracking-tight">
              Join the Quiz
            </h1>
            <p className="text-2xl text-stone-500 font-light">
              Scan the code to join on your phone
            </p>
          </div>

          {!hostId ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 shadow-xl">
              <Loader2 className="w-12 h-12 animate-spin text-stone-400 mb-4" />
              <p className="text-stone-500">Connecting to Game Network...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[460px_minmax(0,1fr)] items-start justify-center gap-8">
              {/* QR Code Card */}
              <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center gap-6 relative overflow-hidden group">
                 <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] bg-white rounded-xl p-4 shadow-inner border border-stone-100">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img 
                      src={qrCodeUrl} 
                      alt="Join QR Code" 
                      className="w-full h-full object-contain" 
                      style={{ imageRendering: 'pixelated' }}
                   />
                 </div>
                 
                 <div className="space-y-1">
                   <p className="text-stone-900 font-black text-xl tracking-tight">SCAN ME</p>
                 </div>
              </div>

              {/* Methods Card */}
              <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-5 text-left">
                
                {/* Network Status / URL */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-stone-500 font-bold">
                        <Globe className="w-4 h-4" />
                        <span className="uppercase text-xs tracking-wider">Join Link</span>
                      </div>
                      
                      {/* Only show settings toggle if on Localhost to avoid confusion in prod */}
                      {isLocalhost && (
                        <button 
                          onClick={() => setShowSettings(!showSettings)} 
                          className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-stone-200 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                          title="Debug Connection URL"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                   </div>
                   
                   {showSettings && isLocalhost ? (
                     <div className="space-y-2 animate-in slide-in-from-top-2">
                       <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                         ⚠ <strong>Localhost Warning:</strong> Replace 'localhost' with your computer's IP (e.g., 192.168.1.5) so phones can connect.
                       </p>
                       <input 
                          type="text" 
                          value={baseUrl}
                          onChange={(e) => setBaseUrl(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 font-mono focus:border-stone-500 focus:outline-none"
                        />
                     </div>
                   ) : (
                     <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-stone-200 group cursor-pointer hover:border-stone-300 transition-colors" onClick={copyLink}>
                        <p className="flex-1 font-mono text-stone-600 text-sm truncate">{joinUrl}</p>
                        <Copy className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <button 
                    onClick={openPlayerView}
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-stone-50 hover:bg-stone-100 rounded-xl transition-all border border-stone-200"
                   >
                     <ExternalLink className="w-6 h-6 text-stone-600" />
                     <span className="text-sm font-bold text-stone-600">Open New Tab</span>
                   </button>

                   <button 
                    onClick={onToggleSimulator}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all border border-stone-200 ${showSimulator ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                   >
                     <Smartphone className="w-6 h-6" />
                     <span className="text-sm font-bold">{showSimulator ? 'Close Sim' : 'Test Player'}</span>
                   </button>
                 </div>

                <div className="flex items-center gap-4 bg-stone-50 px-6 py-4 rounded-xl border border-stone-200 w-full">
                  <div className="bg-white p-2 rounded-lg border border-stone-100 shadow-sm">
                    <Users className="w-6 h-6 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900 leading-none">{playerCount}</p>
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-bold mt-1">Players Ready</p>
                  </div>
                </div>

                <div className="text-xs text-stone-500 bg-white/60 border border-stone-200 rounded-xl px-4 py-3">
                  Tip: open the website in full screen and keep this join screen visible before starting.
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={onNext}
            disabled={!hostId}
            className="px-20 py-6 btn-primary rounded-full font-bold text-2xl hover:scale-105 transition-transform shadow-xl shadow-stone-900/20 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          >
            {hostId ? 'Start Quiz' : 'Waiting for Network...'}
          </button>
        </div>
      </div>
    );
  }

  if (gameState.status === GameStatus.FINISHED) {
    const sortedPlayers = (Object.values(gameState.players) as Player[]).sort((a: Player, b: Player) => b.score - a.score);
    const winner = sortedPlayers[0];
    const maxScore = winner?.score ?? 0;
    const podium = [sortedPlayers[1], sortedPlayers[0], sortedPlayers[2]];

    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden relative text-stone-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-0 left-1/4 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
             <div className="absolute top-10 right-1/4 w-3 h-3 bg-stone-500 rounded-full animate-pulse" />
        </div>

        <div className="z-10 w-full max-w-6xl space-y-8 reveal-in">
          <div className="text-center">
            <Award className="w-20 h-20 text-amber-500 mx-auto drop-shadow-xl mb-3" />
            <h1 className="text-5xl md:text-6xl font-black display-font text-stone-900">Final Leaderboard</h1>
            <p className="text-stone-500 mt-2">Top performers and full rankings</p>
          </div>

          {!winner ? (
            <p className="text-xl text-stone-400 text-center">No players joined.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-end">
              {podium.map((player, idx) => {
                if (!player) return <div key={`podium-empty-${idx}`} className="hidden md:block" />;

                const position = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                const heightClass = idx === 1 ? 'min-h-[240px]' : 'min-h-[200px]';
                const topClass = idx === 1 ? 'leaderboard-podium-first' : 'leaderboard-podium';

                return (
                  <div key={player.id} className={`${topClass} ${heightClass} rounded-3xl p-6 text-center flex flex-col justify-end`}>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">#{position}</p>
                    <p className="text-2xl md:text-3xl display-font font-extrabold text-stone-900 truncate">{player.name}</p>
                    <p className="text-sm text-stone-500 mt-2">Score</p>
                    <p className="text-3xl font-black text-amber-700">{player.score}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="glass-card rounded-3xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl display-font font-bold text-stone-900">Rankings</h2>
              <span className="text-xs uppercase tracking-[0.16em] text-stone-500">{sortedPlayers.length} players</span>
            </div>

            <div className="space-y-3">
              {sortedPlayers.map((p, i) => {
                const scorePct = maxScore > 0 ? Math.max(8, Math.round((p.score / maxScore) * 100)) : 0;
                return (
                  <div key={p.id} className="leaderboard-row">
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-bold text-sm flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-stone-800">{p.name}</span>
                    </div>
                    <div className="relative z-10 flex items-center gap-3">
                      <span className="font-mono text-stone-600 text-sm">{p.score} pts</span>
                    </div>
                    <div className="leaderboard-fill" style={{ width: `${scorePct}%` }} />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 mx-auto px-8 py-3 rounded-full btn-primary transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }
  
  // Guard clause for missing question data (e.g. refresh on host page)
  if (!currentQuestion) {
    return (
      <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">No Quiz Data Found</h1>
        <p className="text-stone-500 mb-6">It looks like the quiz data was lost or hasn't been generated.</p>
        <button 
          onClick={onReset}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold shadow-lg"
        >
          Create New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex flex-col text-stone-900">
      {renderHeader()}

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
        
        {/* Left: Question & Media */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight display-font text-stone-900">
            {currentQuestion.text}
          </h1>

          {/* Media Rendering */}
          {currentQuestion.mediaUrl && (
            <div className={`w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200 ${currentQuestion.mediaType === 'audio' ? 'bg-white p-6' : 'aspect-video bg-black'}`}>
              {currentQuestion.mediaType === 'video' ? (
                <video 
                  src={currentQuestion.mediaUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  autoPlay={false}
                />
              ) : currentQuestion.mediaType === 'audio' ? (
                <audio
                  src={currentQuestion.mediaUrl}
                  controls
                  preload="metadata"
                  className="w-full"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={currentQuestion.mediaUrl} 
                  alt="Question Media" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}
          {currentQuestion.mediaType === 'image' && currentQuestion.mediaUrl && (
            <div className="flex justify-end">
              <button
                onClick={() => openImageFullscreen(currentQuestion.mediaUrl as string)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-semibold"
              >
                <Maximize2 className="w-4 h-4" />
                Full Screen
              </button>
            </div>
          )}
          {currentQuestion.websiteUrl && (
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Website Demo</p>
                <p className="text-lg font-semibold text-stone-900">{currentQuestion.websiteLabel || currentQuestion.websiteUrl}</p>
                <p className="text-sm text-stone-500 truncate max-w-[420px]">{currentQuestion.websiteUrl}</p>
              </div>
              <button
                onClick={openWebsiteDemo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-sm font-semibold whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4" />
                Open Website
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
             {currentQuestion.options.map((opt, i) => {
               const letter = String.fromCharCode(65 + i);
               const isReveal = gameState.status === GameStatus.QUESTION_REVEAL;
               const isCorrect = opt.isCorrect;
               
               let styleClass = "border-stone-200 bg-white";
               if (isReveal && isCorrect) styleClass = "border-emerald-500 bg-emerald-50";
               if (isReveal && !isCorrect) styleClass = "border-stone-200 opacity-50";

               return (
                 <div key={opt.id} className={`flex items-center p-4 rounded-xl border-2 transition-all shadow-sm ${styleClass}`}>
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl mr-4 ${isReveal && isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                     {letter}
                   </div>
                   <span className="text-lg md:text-xl font-medium text-stone-800">{opt.text}</span>
                   {isReveal && isCorrect && <CheckCircle2 className="ml-auto text-emerald-600 w-6 h-6" />}
                 </div>
               );
             })}
          </div>

        </div>

        {/* Right: Real-time Chart */}
        <div className="flex-1 glass-card rounded-3xl p-8 flex flex-col">
           <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#a8a29e" tick={{ fontSize: 14, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f5f5f4' }}
                    contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="votes" radius={[8, 8, 8, 8]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={gameState.status === GameStatus.QUESTION_REVEAL 
                           ? (entry.isCorrect ? '#059669' : '#d6d3d1') // Green or gray
                           : '#44403c'} // Dark Stone
                      />
                    ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
           
           <div className="mt-8 flex justify-center">
             <button 
               onClick={onNext}
               className="group flex items-center gap-2 px-8 py-4 btn-primary rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-stone-900/20"
             >
               {gameState.status === GameStatus.QUESTION_ACTIVE ? 'Reveal Answer' : 'Next Question'}
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>
      </div>
      {fullscreenImageUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeImageFullscreen}
            className="absolute top-5 right-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullscreenImageUrl}
            alt="Fullscreen Question Media"
            className="max-w-[98vw] max-h-[92vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};
