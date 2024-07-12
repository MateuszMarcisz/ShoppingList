import React, {createContext, useState, useEffect} from 'react';
import axios from '../api/axios';

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            axios.get('/accounts/current_user/')
                .then(response => {
                    setUser(response.data);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                });
        } else {
            setUser(null);
            setIsAuthenticated(false);

        }
    }, [isAuthenticated]);

    const login = async (username, password) => {
        const response = await axios.post('/accounts/login/', {username, password});
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        const userResponse = await axios.get('/accounts/current_user/');
        console.log(userResponse.data);
        const loggedUser = userResponse.data;
        setUser(loggedUser);
        // setUser(response.data.user);
        // console.log(response.data.user);
        setIsAuthenticated(true);
    };

    const register = async (username, password) => {
        try {
            const response = await axios.post('/accounts/register/', {username, password});
            setUser(response.data.user);
            // localStorage.setItem('token', response.data.token);
            // axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        } catch (error) {
            console.error('Registration failed', error);
            throw error
        }
    };

    const logout = async () => {
        await axios.post('/accounts/logout/');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};

