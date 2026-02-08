import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { authService, httpClient } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    mobile: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore token from AsyncStorage on app launch
  const restoreToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('authToken');
      if (savedToken) {
        setToken(savedToken);
        httpClient.setToken(savedToken);

        // Verify token is still valid
        try {
          const response = await authService.verifyToken(savedToken);
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            await AsyncStorage.removeItem('authToken');
            setToken(null);
          }
        } catch (error) {
          console.log('Token verification failed, clearing');
          await AsyncStorage.removeItem('authToken');
          setToken(null);
        }
      }
    } catch (error) {
      console.error('Failed to restore token:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    restoreToken();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        httpClient.setToken(newToken);
        await AsyncStorage.setItem('authToken', newToken);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    mobile: string,
    password: string,
    role: string
  ) => {
    setLoading(true);
    try {
      const response = await authService.register(
        name,
        email,
        mobile,
        password,
        role as any
      );
      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        httpClient.setToken(newToken);
        await AsyncStorage.setItem('authToken', newToken);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      httpClient.clearToken();
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    restoreToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
