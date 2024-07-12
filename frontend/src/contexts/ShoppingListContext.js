import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from './AuthContext';

const ShoppingListContext = createContext({});

const ShoppingListProvider = ({ children }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newListName, setNewListName] = useState('');
    const [error, setError] = useState('');
    const [shoppingList, setShoppingList] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');

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

    const fetchShoppingList = async (id) => {
        try {
            const response = await axios.get(`/shoppinglists/${id}/`);
            setShoppingList(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shopping list:', error);
            setError('Error fetching shopping list');
            setLoading(false);
        }
    };

    const addItem = async (id, newItemName, newItemQuantity) => {
        if (!newItemName || !newItemQuantity) return;

        try {
            const response = await axios.post(`/items/`, {
                name: newItemName,
                quantity: newItemQuantity,
                shopping_list: id
            });
            setShoppingList(prevList => ({
                ...prevList,
                items: [...prevList.items, response.data]
            }));
            setNewItemName('');
            setNewItemQuantity('');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`/items/${itemId}/`);
            setShoppingList(prevList => ({
                ...prevList,
                items: prevList.items.filter(item => item.id !== itemId)
            }));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const togglePurchased = async (itemId, currentStatus) => {
        try {
            const response = await axios.patch(`/items/${itemId}/`, {
                purchased: !currentStatus
            });
            setShoppingList(prevList => ({
                ...prevList,
                items: prevList.items.map(item =>
                    item.id === itemId ? response.data : item
                )
            }));
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <ShoppingListContext.Provider value={{
            shoppingLists,
            loading,
            setLoading,
            newListName,
            setNewListName,
            addList,
            deleteList,
            shoppingList,
            setShoppingList,
            fetchShoppingList,
            newItemName,
            setNewItemName,
            newItemQuantity,
            setNewItemQuantity,
            addItem,
            deleteItem,
            togglePurchased,
            error,
            setError
        }}>
            {children}
        </ShoppingListContext.Provider>
    );
};

export { ShoppingListProvider, ShoppingListContext };
