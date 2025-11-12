// User Types
export interface User {
  uid: string;
  name: string;
  email: string;
  handicap?: number;
  tournaments: string[];
  createdAt?: Date;
}

// Tournament Types
export type TournamentType = 'stroke-play' | 'match-play' | 'scramble' | 'best-ball' | 'alternate-shot';
export type TournamentStatus = 'pending' | 'active' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  courseId: string;
  courseName: string;
  type: TournamentType;
  players: TournamentPlayer[];
  startDate: Date;
  holes: number;
  status: TournamentStatus;
  joinCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentPlayer {
  uid: string;
  name: string;
  handicap?: number;
  group?: number;
  teeTime?: string;
  status: 'invited' | 'joined' | 'playing' | 'finished';
}

// Score Types
export interface Score {
  id?: string;
  tournamentId: string;
  playerId: string;
  playerName: string;
  hole: number;
  strokes: number;
  par: number;
  timestamp: Date;
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  totalStrokes: number;
  totalPar: number;
  score: number; // relative to par (e.g., -2, +3)
  holes: HoleScore[];
  front9?: number;
  back9?: number;
}

export interface HoleScore {
  hole: number;
  strokes: number;
  par: number;
  relativeToPar: number;
}

// Course Types
export interface Course {
  courseId: string;
  name: string;
  location: string;
  holes: CourseHole[];
  totalPar: number;
  imageUrl?: string;
  createdAt?: Date;
}

export interface CourseHole {
  hole: number;
  par: number;
  distance: number;
  handicap?: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  totalStrokes: number;
  totalPar: number;
  score: number;
  thru: number; // holes completed
  front9?: number;
  back9?: number;
  lastHole?: HoleScore;
}

// Role Types
export type UserRole = 'host' | 'player' | 'spectator';

export interface TournamentRole {
  tournamentId: string;
  userId: string;
  role: UserRole;
}
