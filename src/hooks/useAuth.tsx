import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/socket-contract';
import { MOCK_USERS, generateTempUserId } from '@/data/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: (name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('chatVidUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('chatVidUser');
      }
    } else {
      // Auto-login as demo user for messaging functionality
      const demoUser: User = {
        id: 'demo',
        name: 'Demo User',
        email: 'demo@example.com',
        isPrivate: false,
        savedRooms: [],
        friends: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      setUser(demoUser);
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find mock user by email
    const mockUser = MOCK_USERS.find(u => u.email === email);
    
    if (mockUser) {
      const loginUser = {
        ...mockUser,
        lastActive: new Date().toISOString(),
      };
      
      setUser(loginUser);
      localStorage.setItem('chatVidUser', JSON.stringify(loginUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `uid_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      isPrivate: false,
      savedRooms: [],
      friends: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('chatVidUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  // Guest login function
  const loginAsGuest = async (name: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const guestUser: User = {
      id: generateTempUserId(),
      name: name || 'Guest User',
      isPrivate: false,
      savedRooms: [],
      friends: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    setUser(guestUser);
    localStorage.setItem('chatVidUser', JSON.stringify(guestUser));
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatVidUser');
  };

  const value = {
    user,
    login,
    signup,
    loginAsGuest,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}