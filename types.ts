export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Only host knows this
}

export interface Question {
  id: string;
  text: string;
  options: QuizOption[];
  explanation?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  websiteUrl?: string;
  websiteLabel?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  lastAnswer?: string; // Option ID
}

export enum GameStatus {
  LOBBY = 'LOBBY',
  QUESTION_ACTIVE = 'QUESTION_ACTIVE',
  QUESTION_REVEAL = 'QUESTION_REVEAL',
  LEADERBOARD = 'LEADERBOARD',
  FINISHED = 'FINISHED'
}

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  questions: Question[];
  players: Record<string, Player>;
  joinCode: string;
}

// Events for BroadcastChannel
export type ChannelEvent = 
  | { type: 'SYNC_STATE'; payload: GameState }
  | { type: 'PLAYER_JOIN'; payload: { id: string; name: string } }
  | { type: 'PLAYER_ANSWER'; payload: { playerId: string; optionId: string } }
  | { type: 'ADMIN_RESET'; payload: undefined };
