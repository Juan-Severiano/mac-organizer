'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSocket } from '../hooks/use-socket';
import { Schedule } from '../types';

interface ScheduleContextType {
  schedules: Schedule[];
  isLoading: boolean;
  createSchedule: (data: { userId: number; date: string; startTime: string; endTime: string }) => Promise<{ success: boolean; error?: string }>;
  deleteSchedule: (id: number) => Promise<boolean>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { socket, emitScheduleUpdate } = useSocket();

  useEffect(() => {
    fetchSchedules();

    if (socket) {
      socket.on('scheduleUpdate', () => {
        fetchSchedules();
      });

      return () => {
        socket.off('scheduleUpdate');
      };
    }
  }, [socket]);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSchedule = async (data: { userId: number; date: string; startTime: string; endTime: string }) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error };
      }

      await fetchSchedules();
      emitScheduleUpdate({ type: 'created' });
      return { success: true };
    } catch (error) {
      console.error('Error creating schedule:', error);
      return { success: false, error: 'Failed to create schedule' };
    }
  };

  const deleteSchedule = async (id: number) => {
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return false;
      }

      await fetchSchedules();
      emitScheduleUpdate({ type: 'deleted' });
      return true;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return false;
    }
  };

  return (
    <ScheduleContext.Provider value={{ schedules, isLoading, createSchedule, deleteSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
