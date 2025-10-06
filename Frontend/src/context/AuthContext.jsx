import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getMe } from '../api/auth';
import Spinner from '../components/Spinner';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                    
                    const newSocket = io('http://localhost:5000', {
                        query: { userId: userData._id }
                    });
                    setSocket(newSocket);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        verifyUser();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [token]);

    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        if (socket) socket.disconnect();
    };

    if (loading) {
        return <Spinner fullscreen />;
    }

    const value = { user, token, socket, login, logout, isAuthenticated: !!user };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};