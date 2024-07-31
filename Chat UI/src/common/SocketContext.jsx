// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ENDPOINTS from './common';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const newSocket = io(ENDPOINTS.socketConnection, {
      auth: { token }
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    // newSocket.on('disconnect', () => {
    //   console.log('Disconnected from socket server');
    // });

    // return () => {
    //   if (newSocket) {
    //     newSocket.disconnect();
    //     console.log('Socket connection closed');
    // }
    // }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

