// User Roles
export type UserRole = 'player' | 'coach' | 'scorer' | 'umpire' | 'admin' | 'ground_staff';

export type AgeGroup = 'u13' | 'u16' | 'u19' | 'u23' | 'senior';
export type MatchLevel = 'district' | 'state' | 'national' | 'academy' | 'local';

// User Model
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Player Profile Model
export interface PlayerProfile {
  id: string;
  userId: string;
  ageGroup: AgeGroup;
  academy?: string;
  jerseyNumber?: number;
  battingStyle: 'right' | 'left';
  bowlingStyle?: 'right-arm-fast' | 'right-arm-medium' | 'right-arm-off-break' | 'right-arm-leg-break' | 'left-arm-fast' | 'left-arm-medium' | 'left-arm-off-break' | 'left-arm-leg-break' | 'none';
  height?: number;
  weight?: number;
  bio?: string;
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
}

// Player Statistics
export interface PlayerStats {
  matchesPlayed: number;
  runsScored: number;
  wicketsTaken: number;
  fifties: number;
  centuries: number;
  highestScore: number;
  bestBowling: string;
  average: number;
  strikeRate: number;
}

// Match Model
export interface Match {
  id: string;
  title: string;
  level: MatchLevel;
  venue: string;
  city: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  format: 'T20' | 'ODI' | '4-overs' | '6-overs';
  team1: MatchTeam;
  team2: MatchTeam;
  registrationFee: number;
  spotsAvailable: number;
  groundId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Match Team
export interface MatchTeam {
  id: string;
  name: string;
  players: string[]; // User IDs
  totalRuns?: number;
  totalWickets?: number;
}

// Scorecard Model
export interface Scorecard {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  inningsNumber: 1 | 2;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  wicket?: {
    bowledBy: string;
    mode: 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket';
    bowlerName: string;
  };
  strikeRate: number;
  createdAt: string;
  updatedAt: string;
}

// Bowling Card
export interface BowlingCard {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  inningsNumber: 1 | 2;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  createdAt: string;
  updatedAt: string;
}

// Ranking Model
export interface Ranking {
  id: string;
  playerId: string;
  playerName: string;
  level: MatchLevel;
  ageGroup: AgeGroup;
  points: number;
  position: number;
  matchesPlayed: number;
  lastUpdated: string;
}

// Payment Model
export interface Payment {
  id: string;
  userId: string;
  matchId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  orderId?: string;
  transactionId?: string;
  paymentGateway: 'razorpay' | 'paypal' | 'stripe';
  createdAt: string;
  updatedAt: string;
}

// Match Participation
export interface MatchParticipation {
  id: string;
  matchId: string;
  userId: string;
  teamId: string;
  status: 'registered' | 'confirmed' | 'checked-in' | 'cancelled';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Response
export interface AuthResponse {
  token: string;
  user: User;
}

// API Request/Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Ground/Venue Model
export interface Ground {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  capacity: number;
  image?: string;
  facilities: string[];
  createdAt: string;
  updatedAt: string;
}

// Live Scoring Ball
export interface BallEntry {
  id: string;
  matchId: string;
  overNumber: number;
  ballNumber: number;
  batsmanId: string;
  bowlerId: string;
  runs: number;
  type: 'normal' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  isWicket: boolean;
  wicketInfo?: {
    mode: string;
    fielderId?: string;
  };
  createdAt: string;
}
