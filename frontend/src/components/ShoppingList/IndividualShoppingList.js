import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import {FaTrashAlt} from 'react-icons/fa'

const IndividualShoppingList = () => {
    const { id } = useParams();
    const { isAuthenticated } = useContext(AuthContext);
    const [shoppingList, setShoppingList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            axios.get(`/shoppinglists/${id}/`)
                .then(response => {
                    setShoppingList(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching shopping list:', error);
                    setError('Error fetching shopping list');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, id]);

    if (!isAuthenticated) {
        return (
            <div className="center-text">
                <h1>Looks like you are not logged in.</h1>
                <button onClick={() => navigate('/login')}>Login</button>
            </div>
        );
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!shoppingList) {
        return <p>Shopping list not found.</p>;
    }

    return (
        <div className="Lists">
            <h2 className="center-text">List: {shoppingList.name}</h2>
            <table>
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Purchased</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {shoppingList.items.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.purchased ? 'Yes' : 'No'}</td>
                        <td><FaTrashAlt className="Thrash" aria-label={`Delete ${item.name}`} /></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/')}>Back to all lists</button>
        </div>
    );
};

export default IndividualShoppingList;
