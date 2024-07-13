import ENDPOINTS from './common';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
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

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Clean up on component unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
                console.log('Socket connection closed');
            }
        };
    }, []);

    return socket;
};

export default useSocket;
