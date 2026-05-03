'use client';

import { TUser, UserTypeEnum } from '@repo/definitions';
import React, { createContext, useContext, useState, useCallback } from 'react';


interface AuthContextType {
  user: TUser | null;
  isAuthenticated: boolean;
  userType: UserTypeEnum | null;
  login: (user: TUser) => void;
  logout: () => void;
  register: (user: TUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const login = useCallback((userData: TUser) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const register = useCallback((userData: TUser) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    userType: user?.userType ?? null,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
