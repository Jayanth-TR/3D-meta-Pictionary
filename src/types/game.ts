export type GameState = 'SETUP' | 'READY' | 'PLAYING' | 'CORRECT' | 'TIMEOUT';

export interface TimelineEvent {
  id: string;
  type: 'WRONG' | 'CORRECT';
  remainingSeconds: number;
  elapsedSeconds: number;
  timestamp: number;
}

export interface RoundConfig {
  teamName: string;
  playerName: string;
  players?: string[];
  durationSeconds: number;
}

export interface ActiveRoundState {
  config: RoundConfig;
  remainingSeconds: number;
  elapsedSeconds: number;
  events: TimelineEvent[];
  isTimerRunning: boolean;
  score: number;
}

export interface SessionRecord {
  id: string;
  teamName: string;
  playerName: string;
  players?: string[];
  result: 'CORRECT' | 'TIMEOUT';
  elapsedSeconds: number;
  attempts: number;
  score: number;
  timestamp: string;
}

