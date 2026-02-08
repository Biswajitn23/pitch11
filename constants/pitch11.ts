// Pitch11 Application Constants and Configuration

export const APP_NAME = 'PITCH11';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'Cricket Excellence';

// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.pitch11.com';
export const API_TIMEOUT = 30000; // 30 seconds

// Match Levels
export const MATCH_LEVELS = ['district', 'state', 'national', 'academy', 'local'] as const;

// Age Groups
export const AGE_GROUPS = ['u13', 'u16', 'u19', 'u23', 'senior'] as const;

// Match Formats
export const MATCH_FORMATS = ['T20', 'ODI', '4-overs', '6-overs'] as const;

// User Roles
export const USER_ROLES = ['player', 'coach', 'scorer', 'umpire', 'admin', 'ground_staff'] as const;

// Batting Styles
export const BATTING_STYLES = ['right', 'left'] as const;

// Bowling Styles
export const BOWLING_STYLES = [
  'right-arm-fast',
  'right-arm-medium',
  'right-arm-off-break',
  'right-arm-leg-break',
  'left-arm-fast',
  'left-arm-medium',
  'left-arm-off-break',
  'left-arm-leg-break',
  'none',
] as const;

// Wicket Modes
export const WICKET_MODES = [
  'bowled',
  'caught',
  'lbw',
  'run-out',
  'stumped',
  'hit-wicket',
] as const;

// Payment Gateways
export const PAYMENT_GATEWAYS = ['razorpay', 'paypal', 'stripe'] as const;

// Application Colors (Primary Theme)
export const COLORS = {
  primary: '#1976d2',
  primaryLight: '#E3F2FD',
  primaryDark: '#1565C0',
  accent: '#FF6F00',
  success: '#4CAF50',
  error: '#D32F2F',
  warning: '#FFC107',
  info: '#2196F3',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#DDDDDD',
  divider: '#F0F0F0',
};

// Default Match Search Filters
export const DEFAULT_MATCH_FILTERS = {
  status: 'upcoming' as const,
  page: 1,
  limit: 20,
};

// Default Rankings Filters
export const DEFAULT_RANKING_FILTERS = {
  level: 'district' as const,
  ageGroup: 'all' as const,
  page: 1,
  limit: 10,
};

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  REFRESH_TOKEN: 'refreshToken',
  RECENT_SEARCHES: 'recentSearches',
  USER_PREFERENCES: 'userPreferences',
  CACHED_RANKINGS: 'cachedRankings',
  CACHED_MATCHES: 'cachedMatches',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_VERIFY: '/api/auth/verify',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGOUT: '/api/auth/logout',

  // Players
  PLAYER_PROFILE: '/api/player/:userId/profile',
  PLAYER_STATS: '/api/player/:userId/stats',
  PLAYER_RANKINGS: '/api/player/:userId/ranking',
  PLAYER_MATCHES: '/api/player/:userId/matches',
  PLAYER_PAYMENTS: '/api/player/:userId/payments',
  PLAYERS_SEARCH: '/api/players/search',

  // Matches
  MATCH_CREATE: '/api/match/create',
  MATCH_LIST: '/api/match/list',
  MATCH_DETAIL: '/api/match/:matchId',
  MATCH_JOIN: '/api/match/:matchId/join',
  MATCH_SCORE: '/api/match/:matchId/score',
  MATCH_SCORECARD: '/api/match/:matchId/scorecard',
  MATCH_LIVE_SCORE: '/api/match/:matchId/live-score',

  // Live Scoring
  LIVE_BALL_ENTRY: '/api/match/:matchId/ball-entry',
  LIVE_END_INNINGS: '/api/match/:matchId/end-innings',
  LIVE_END_MATCH: '/api/match/:matchId/end-match',

  // Rankings
  RANKINGS_DISTRICT: '/api/rankings/district',
  RANKINGS_STATE: '/api/rankings/state',
  RANKINGS_NATIONAL: '/api/rankings/national',
  RANK_HISTORY: '/api/player/:playerId/rank-history',

  // Payments
  PAYMENT_INITIATE: '/api/payment/initiate',
  PAYMENT_VERIFY: '/api/payment/verify',

  // Grounds
  GROUNDS_LIST: '/api/grounds',
  GROUND_DETAIL: '/api/ground/:groundId',
  GROUND_SLOTS: '/api/ground/:groundId/slots',
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  MOBILE_MIN_LENGTH: 10,
  MOBILE_MAX_LENGTH: 13,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MOBILE_REGEX: /^[0-9+\-\s()]+$/,
};

// Default Pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
};

// Feature Flags
export const FEATURE_FLAGS = {
  LIVE_SCORING: process.env.EXPO_PUBLIC_ENABLE_LIVE_SCORING === 'true',
  COACH_MARKETPLACE: process.env.EXPO_PUBLIC_ENABLE_COACH_MARKETPLACE === 'true',
  VIDEO_REVIEWS: process.env.EXPO_PUBLIC_ENABLE_VIDEO_REVIEWS === 'true',
};

// Match Duration (in minutes)
export const MATCH_DURATION = {
  'T20': 180,
  'ODI': 300,
  '4-overs': 90,
  '6-overs': 120,
};

// Indian States (for state rankings)
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
  'Ladakh',
];
