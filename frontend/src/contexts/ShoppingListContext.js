// src/contexts/ShoppingListContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from './AuthContext';

const ShoppingListContext = createContext();

const ShoppingListProvider = ({ children }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newListName, setNewListName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchShoppingLists();
        }
    }, [isAuthenticated]);

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get('/shoppinglists/');
            setShoppingLists(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
            setLoading(false);
        }
    };

    const addList = async (newListName) => {
        if (!newListName) return;

        try {
            const response = await axios.post(`/shoppinglists/`, {
                name: newListName,
                user: user.id,
            });
            setShoppingLists(prevLists => [...prevLists, response.data]);
            setNewListName('');
        } catch (error) {
            console.error('Error adding list:', error);
        }
    };

    const deleteList = async (listId) => {
        try {
            await axios.delete(`/shoppinglists/${listId}/`);
            setShoppingLists(prevLists => prevLists.filter(list => list.id !== listId));
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    return (
        <ShoppingListContext.Provider value={{ shoppingLists, loading, newListName, setNewListName, addList, deleteList }}>
            {children}
        </ShoppingListContext.Provider>
    );
};

export { ShoppingListProvider, ShoppingListContext };
