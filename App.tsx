import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameStatus, ChannelEvent, Player, Question } from './types';
import { Lobby, STATIC_QUIZ } from './components/Lobby';
import { HostView } from './components/HostView';
import { PlayerView } from './components/PlayerView';
import { PlayerSimulator } from './components/PlayerSimulator';
import { Peer, DataConnection } from 'peerjs';

// Helper for initial state
const getInitialState = (): GameState => ({
  status: GameStatus.LOBBY,
  currentQuestionIndex: 0,
  questions: [],
  players: {},
  joinCode: ''
});

const App: React.FC = () => {
  // --- Routing ---
  // We now expect #join=<hostId> for players
  const [view, setView] = useState<'host' | 'player' | 'landing'>('landing');
  const [hostId, setHostId] = useState<string>(''); // For players to know who to connect to
  const [myPeerId, setMyPeerId] = useState<string>(''); // The Host's actual ID
  
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [showSimulator, setShowSimulator] = useState(false);
  const [isConnectedToHost, setIsConnectedToHost] = useState(false); // New connection state
  
  const [localPlayerId, setLocalPlayerId] = useState<string>(() => {
    const saved = localStorage.getItem('quiz_player_id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('quiz_player_id', newId);
    return newId;
  });

  // --- PeerJS Refs ---
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<DataConnection[]>([]); // HOST: List of connected players
  const hostConnectionRef = useRef<DataConnection | null>(null); // PLAYER: Connection to host

  // --- Initialization & Routing ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#join=')) {
        const id = hash.split('=')[1];
        if (id) {
          setHostId(id);
          setView('player');
        }
      } else if (hash === '#host') {
        setView('host');
      } else {
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- HOST LOGIC ---
  useEffect(() => {
    if (view !== 'host') return;

    // If host view is opened directly (refresh/hash link), recover with default quiz data.
    setGameState(prev => {
      if (prev.questions.length > 0) return prev;
      return {
        ...prev,
        status: GameStatus.LOBBY,
        currentQuestionIndex: 0,
        questions: STATIC_QUIZ,
        players: {}
      };
    });

    // cleanup previous peer if exists
    if (peerRef.current) peerRef.current.destroy();

    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (id) => {
      console.log('HOST: Peer ID is', id);
      setMyPeerId(id);
      setGameState(prev => ({ ...prev, joinCode: id }));
    });

    peer.on('connection', (conn) => {
      console.log('HOST: Player connected', conn.peer);
      connectionsRef.current.push(conn);

      conn.on('open', () => {
        // Send current state immediately to the new player
        conn.send({ type: 'SYNC_STATE', payload: gameState });
      });

      conn.on('data', (data: unknown) => {
        const event = data as ChannelEvent;
        handleHostReceiveData(event);
      });

      conn.on('close', () => {
        connectionsRef.current = connectionsRef.current.filter(c => c !== conn);
      });
    });

    return () => {
      peer.destroy();
      peerRef.current = null;
      connectionsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]); // Only re-run if view changes to host

  // Helper to process incoming data as Host
  const handleHostReceiveData = (event: ChannelEvent) => {
    if (event.type === 'PLAYER_JOIN') {
      setGameState(prev => {
        const newState = {
          ...prev,
          players: {
            ...prev.players,
            [event.payload.id]: { id: event.payload.id, name: event.payload.name, score: 0 }
          }
        };
        broadcastState(newState);
        return newState;
      });
    } else if (event.type === 'PLAYER_ANSWER') {
      setGameState(prev => {
        const player = prev.players[event.payload.playerId];
        if (!player || player.lastAnswer) return prev; // Ignore if already answered or invalid

        const newState = {
          ...prev,
          players: {
            ...prev.players,
            [event.payload.playerId]: { ...player, lastAnswer: event.payload.optionId }
          }
        };
        broadcastState(newState);
        return newState;
      });
    }
  };

  // Helper to broadcast state to all connected players
  const broadcastState = (state: GameState) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) {
        conn.send({ type: 'SYNC_STATE', payload: state });
      }
    });
  };

  // --- PLAYER LOGIC ---
  useEffect(() => {
    if (view !== 'player' || !hostId) return;

    if (peerRef.current) peerRef.current.destroy();

    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
      console.log('PLAYER: Connected to network');
      // Connect to host
      const conn = peer.connect(hostId);
      hostConnectionRef.current = conn;

      conn.on('open', () => {
        console.log('PLAYER: Connected to Host');
        setIsConnectedToHost(true);
      });

      conn.on('close', () => {
        console.log('PLAYER: Disconnected from Host');
        setIsConnectedToHost(false);
      });

      conn.on('error', () => {
        console.error('PLAYER: Connection Error');
        setIsConnectedToHost(false);
      });

      conn.on('data', (data: unknown) => {
        const event = data as ChannelEvent;
        if (event.type === 'SYNC_STATE') {
          setGameState(event.payload);
        } else if (event.type === 'ADMIN_RESET') {
          setGameState(getInitialState());
        }
      });
    });

    return () => {
      peer.destroy();
      peerRef.current = null;
      hostConnectionRef.current = null;
    };
  }, [view, hostId]);


  // --- Actions ---

  const handleQuizGenerated = (questions: Question[]) => {
    const newState: GameState = {
      ...gameState,
      status: GameStatus.LOBBY,
      questions,
      currentQuestionIndex: 0,
      players: {} 
    };
    setGameState(newState);
    // Note: We don't broadcast here because we haven't started Host Peer yet. 
    // The state will be initial state for the Host when it mounts.
    window.location.hash = '#host';
  };

  const handleNextStage = () => {
    setGameState(prev => {
      if (!prev.questions || prev.questions.length === 0) {
        return prev;
      }

      let nextState = { ...prev };

      if (prev.status === GameStatus.LOBBY) {
        nextState.status = GameStatus.QUESTION_ACTIVE;
      } else if (prev.status === GameStatus.QUESTION_ACTIVE) {
        // Calculate Scores
        const currentQ = prev.questions[prev.currentQuestionIndex];
        const correctOptId = currentQ.options.find(o => o.isCorrect)?.id;
        
        const updatedPlayers: Record<string, Player> = {};
        Object.values(prev.players).forEach((p: Player) => {
           const isCorrect = p.lastAnswer === correctOptId;
           updatedPlayers[p.id] = {
             ...p,
             score: isCorrect ? p.score + 100 : p.score
           };
        });

        nextState.players = updatedPlayers;
        nextState.status = GameStatus.QUESTION_REVEAL;

      } else if (prev.status === GameStatus.QUESTION_REVEAL) {
        if (prev.currentQuestionIndex >= prev.questions.length - 1) {
          nextState.status = GameStatus.FINISHED;
        } else {
          nextState.currentQuestionIndex = prev.currentQuestionIndex + 1;
          nextState.status = GameStatus.QUESTION_ACTIVE;
          const resetPlayers: Record<string, Player> = {};
          Object.values(prev.players).forEach((p: Player) => {
            resetPlayers[p.id] = { ...p, lastAnswer: undefined };
          });
          nextState.players = resetPlayers;
        }
      }
      
      broadcastState(nextState);
      return nextState;
    });
  };

  const handleReset = () => {
    window.location.hash = ''; 
    const newState = getInitialState();
    setGameState(newState);
    
    // Notify players to reset
    connectionsRef.current.forEach(conn => {
       if (conn.open) conn.send({ type: 'ADMIN_RESET', payload: undefined });
    });

    setShowSimulator(false);
  };

  // --- Player Actions (Networked) ---
  const handlePlayerJoin = (name: string) => {
    if (hostConnectionRef.current?.open) {
      hostConnectionRef.current.send({ 
        type: 'PLAYER_JOIN', 
        payload: { id: localPlayerId, name } 
      });
    }
  };

  const handlePlayerAnswer = (optionId: string) => {
    if (hostConnectionRef.current?.open) {
      hostConnectionRef.current.send({ 
        type: 'PLAYER_ANSWER', 
        payload: { playerId: localPlayerId, optionId } 
      });
    }
  };

  // --- Simulator Actions (Direct Local Loopback) ---
  const handleSimJoin = (name: string, simId: string) => {
      // Directly call the host handler logic
      handleHostReceiveData({ 
        type: 'PLAYER_JOIN', 
        payload: { id: simId, name } 
      });
  };

  const handleSimAnswer = (optionId: string, simId: string) => {
      handleHostReceiveData({ 
        type: 'PLAYER_ANSWER', 
        payload: { playerId: simId, optionId } 
      });
  };

  // --- Render ---

  if (view === 'player') {
    return (
      <PlayerView 
        gameState={gameState} 
        playerId={localPlayerId}
        isConnected={isConnectedToHost} // Pass the status
        onJoin={handlePlayerJoin} 
        onAnswer={handlePlayerAnswer} 
      />
    );
  }

  if (view === 'host') {
    return (
      <>
        <HostView 
          gameState={gameState} 
          hostId={myPeerId} // Pass peer ID to HostView for QR code
          onNext={handleNextStage} 
          onReset={handleReset}
          onToggleSimulator={() => setShowSimulator(!showSimulator)}
          showSimulator={showSimulator}
        />
        {showSimulator && (
          <PlayerSimulator 
            gameState={gameState} 
            onClose={() => setShowSimulator(false)} 
            onJoin={handleSimJoin} // Pass direct handlers
            onAnswer={handleSimAnswer}
          />
        )}
      </>
    );
  }

  return <Lobby onQuizGenerated={handleQuizGenerated} />;
};

export default App;
