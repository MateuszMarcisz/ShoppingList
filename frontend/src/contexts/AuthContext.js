import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            axios.get('/accounts/current_user/')
                .then(response => setUser(response.data))
                .catch(() => localStorage.removeItem('token'));
        }
    }, []);

    const login = (username, password) => {
        return axios.post('/accounts/login/', { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
                setUser(response.data.user);
            });
    };

    const register = (username, email, password) => {
        return axios.post('/accounts/register/', { username, email, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
                setUser(response.data.user);
            });
    };

    const logout = () => {
        return axios.post('/accounts/logout/')
            .then(() => {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            });
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

