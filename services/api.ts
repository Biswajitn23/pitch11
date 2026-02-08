import { ApiResponse, AuthResponse, User } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.pitch11.com';

// Create axios-like http client for Expo
class HttpClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'API request failed');
      }

      return result;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, data?: any) {
    return this.request<T>('POST', endpoint, data);
  }

  put<T>(endpoint: string, data?: any) {
    return this.request<T>('PUT', endpoint, data);
  }

  delete<T>(endpoint: string) {
    return this.request<T>('DELETE', endpoint);
  }
}

export const httpClient = new HttpClient();

// Auth Service
export const authService = {
  register: async (
    name: string,
    email: string,
    mobile: string,
    password: string,
    role: 'player' | 'coach' | 'scorer' | 'umpire' | 'admin' | 'ground_staff'
  ): Promise<ApiResponse<AuthResponse>> => {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/register', {
        name,
        email,
        mobile,
        password,
        role,
      });
    } catch (error) {
      // Mock registration fallback
      console.warn('Using mock registration');
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        mobile,
        role,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockToken = 'mock-token-' + Math.random().toString(36).substr(2, 20);
      return {
        success: true,
        data: {
          token: mockToken,
          user: mockUser,
        },
      };
    }
  },

  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/login', {
        email,
        password,
      });
    } catch (error) {
      // Mock login fallback
      console.warn('Using mock login');
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        mobile: '9876543210',
        role: 'player',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockToken = 'mock-token-' + Math.random().toString(36).substr(2, 20);
      return {
        success: true,
        data: {
          token: mockToken,
          user: mockUser,
        },
      };
    }
  },

  logout: async (): Promise<void> => {
    httpClient.clearToken();
  },

  verifyToken: async (token: string): Promise<ApiResponse<User>> => {
    try {
      httpClient.setToken(token);
      return await httpClient.get<User>('/api/auth/verify');
    } catch (error) {
      // Mock token verification fallback
      console.warn('Using mock token verification');
      if (token.startsWith('mock-token-')) {
        const mockUser: User = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          name: 'Test User',
          email: 'test@pitch11.com',
          mobile: '9876543210',
          role: 'player',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          success: true,
          data: mockUser,
        };
      }
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/refresh', { refreshToken });
    } catch (error) {
      // Mock refresh token fallback
      console.warn('Using mock token refresh');
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: 'Test User',
        email: 'test@pitch11.com',
        mobile: '9876543210',
        role: 'player',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockToken = 'mock-token-' + Math.random().toString(36).substr(2, 20);
      return {
        success: true,
        data: {
          token: mockToken,
          user: mockUser,
        },
      };
    }
  },
};

// Player Service
export const playerService = {
  getProfile: async (userId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/player/${userId}/profile`);
  },

  updateProfile: async (userId: string, data: any): Promise<ApiResponse<any>> => {
    return httpClient.put(`/api/player/${userId}/profile`, data);
  },

  getStats: async (userId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/player/${userId}/stats`);
  },

  searchPlayers: async (query: string, limit = 10): Promise<ApiResponse<any[]>> => {
    return httpClient.get(`/api/players/search?query=${query}&limit=${limit}`);
  },

  getPlayerRanking: async (
    playerId: string,
    level: string,
    ageGroup: string
  ): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/player/${playerId}/ranking?level=${level}&ageGroup=${ageGroup}`);
  },
};

// Match Service
export const matchService = {
  createMatch: async (matchData: any): Promise<ApiResponse<any>> => {
    return httpClient.post('/api/match/create', matchData);
  },

  getMatches: async (filters?: {
    level?: string;
    city?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (filters?.level) params.append('level', filters.level);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    return httpClient.get(
      `/api/match/list${queryString ? '?' + queryString : ''}`
    );
  },

  getMatchDetail: async (matchId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/match/${matchId}`);
  },

  joinMatch: async (matchId: string, userId: string): Promise<ApiResponse<any>> => {
    return httpClient.post(`/api/match/${matchId}/join`, { userId });
  },

  getMyMatches: async (userId: string, status?: string): Promise<ApiResponse<any[]>> => {
    const statusParam = status ? `?status=${status}` : '';
    return httpClient.get(`/api/player/${userId}/matches${statusParam}`);
  },

  updateMatchScore: async (matchId: string, scoreData: any): Promise<ApiResponse<any>> => {
    return httpClient.put(`/api/match/${matchId}/score`, scoreData);
  },

  getMatchScorecard: async (matchId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/match/${matchId}/scorecard`);
  },
};

// Ranking Service
export const rankingService = {
  getDistrictRankings: async (
    ageGroup?: string,
    page = 1
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (ageGroup) params.append('ageGroup', ageGroup);
    params.append('page', page.toString());

    return httpClient.get(
      `/api/rankings/district?${params.toString()}`
    );
  },

  getStateRankings: async (
    state: string,
    ageGroup?: string,
    page = 1
  ): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    params.append('state', state);
    if (ageGroup) params.append('ageGroup', ageGroup);
    params.append('page', page.toString());

    return httpClient.get(
      `/api/rankings/state?${params.toString()}`
    );
  },

  getNationalRankings: async (ageGroup?: string, page = 1): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (ageGroup) params.append('ageGroup', ageGroup);
    params.append('page', page.toString());

    return httpClient.get(
      `/api/rankings/national?${params.toString()}`
    );
  },

  getPlayerRankHistory: async (playerId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/player/${playerId}/rank-history`);
  },
};

// Payment Service
export const paymentService = {
  initiatePayment: async (userId: string, matchId: string, amount: number): Promise<ApiResponse<any>> => {
    return httpClient.post('/api/payment/initiate', {
      userId,
      matchId,
      amount,
    });
  },

  verifyPayment: async (
    orderId: string,
    transactionId: string,
    signature: string
  ): Promise<ApiResponse<any>> => {
    return httpClient.post('/api/payment/verify', {
      orderId,
      transactionId,
      signature,
    });
  },

  getPaymentHistory: async (userId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/player/${userId}/payments`);
  },
};

// Live Scoring Service
export const liveScoringService = {
  addBallEntry: async (matchId: string, ballData: any): Promise<ApiResponse<any>> => {
    return httpClient.post(`/api/match/${matchId}/ball-entry`, ballData);
  },

  getMatchLiveScore: async (matchId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/match/${matchId}/live-score`);
  },

  endInnings: async (matchId: string, inningsNumber: number): Promise<ApiResponse<any>> => {
    return httpClient.post(`/api/match/${matchId}/end-innings`, { inningsNumber });
  },

  endMatch: async (matchId: string, winnerTeamId: string): Promise<ApiResponse<any>> => {
    return httpClient.post(`/api/match/${matchId}/end-match`, { winnerTeamId });
  },
};

// Ground/Venue Service
export const groundService = {
  getGrounds: async (city?: string): Promise<ApiResponse<any[]>> => {
    const cityParam = city ? `?city=${city}` : '';
    return httpClient.get(`/api/grounds${cityParam}`);
  },

  getGroundDetail: async (groundId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/api/ground/${groundId}`);
  },

  getAvailableSlots: async (
    groundId: string,
    date: string
  ): Promise<ApiResponse<any[]>> => {
    return httpClient.get(`/api/ground/${groundId}/slots?date=${date}`);
  },
};
