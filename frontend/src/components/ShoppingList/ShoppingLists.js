import React, {useContext, useState, useEffect} from 'react';
import axios from '../../api/axios';
import {AuthContext} from '../../contexts/AuthContext';
import {Link, useNavigate} from 'react-router-dom';


const ShoppingList = () => {
    const {isAuthenticated} = useContext(AuthContext);
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuthenticated) {
            axios.get('/shoppinglists/')
                .then(response => {
                    setShoppingLists(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching shopping lists:', error);
                    setLoading(false);
                });
        }
    }, [isAuthenticated]);

    if (!user) {
        return (
            <div className="center-text">
                <h1>Looks like you are not logged in.</h1>
                <button onClick={() => navigate('/login')}>Login</button>
            </div>)
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="Lists">
            <h2 className="center-text">Shopping Lists</h2>
            {shoppingLists.length === 0 ? (
                <p>No shopping lists found.</p>
            ) : (
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {shoppingLists.map(list => (
                        <li key={list.id} style={{marginBottom: '10px'}}>
                            <button
                                className="lists-link-button"
                                onClick={() => navigate(`/shoppinglist/${list.id}`)}
                            >
                                {list.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShoppingList;