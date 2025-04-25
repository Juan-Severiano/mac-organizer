// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io();
      
      socket.on('connect', () => {
        setIsConnected(true);
      });
      
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const emitCurrentUserUpdate = (data: any) => {
    if (socket) {
      socket.emit('currentUserUpdated', data);
    }
  };

  //@ts-ignore
  const emitScheduleUpdate = (data: any) => {
    if (socket) {
      socket.emit('scheduleUpdate', data);
    }
  };

  return {
    socket,
    isConnected,
    emitCurrentUserUpdate,
    emitScheduleUpdate
  };
};
