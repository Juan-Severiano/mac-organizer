'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { CurrentUser } from '../types';
import { useSocket } from '@/hooks/use-socket';

interface CurrentUserContextType {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  setCurrentUser: (userId: number) => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { socket, emitCurrentUserUpdate } = useSocket();

  useEffect(() => {
    fetchCurrentUser();

    if (socket) {
      socket.on('currentUserUpdated', (data) => {
        setCurrentUserState(data);
      });

      return () => {
        socket.off('currentUserUpdated');
      };
    }
  }, [socket]);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/current-user');
      const data = await response.json();
      setCurrentUserState(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentUser = async (userId: number) => {
    try {
      const response = await fetch('/api/current-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setCurrentUserState(data);
      emitCurrentUserUpdate(data);
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoading, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};
