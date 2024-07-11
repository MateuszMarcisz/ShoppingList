import React, {useState, useEffect, useContext} from 'react';
import axios from '../../api/axios';
import {useParams, useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';
import {FaTrashAlt} from 'react-icons/fa';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquarePlus} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

const IndividualShoppingList = () => {
    const {id} = useParams();
    const {isAuthenticated} = useContext(AuthContext);
    const [shoppingList, setShoppingList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
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

    const handleAddItem = async (e) => {
        e.preventDefault();
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

    const handleDeleteItem = async (itemId) => {
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

    const handleTogglePurchased = async (itemId, currentStatus) => {
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
            <h1 className="center-text">{shoppingList.name}</h1>
            <div className="form-container">
                <form onSubmit={handleAddItem}>
                    <label htmlFor="addItem" className="sr-only">Add Item</label>
                    <input
                        id='addItem'
                        type='text'
                        placeholder='Add Item'
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        required
                        aria-label="Item name"
                    />
                    <label htmlFor="quantity" className="sr-only">Quantity</label>
                    <input
                        id='quantity'
                        type='number'
                        min="1"
                        max="999"
                        placeholder='Quantity'
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                        required
                        className="thin-input"
                        aria-label="Item quantity"
                    />
                    <button type="submit" className="icon-button">
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </form>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Item</th>
                    <th className="width120">Quantity</th>
                    <th className="width120">Purchased</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {shoppingList.items.map(item => (
                    <tr key={item.id} className={item.purchased ? 'purchased' : ''}>
                        <td>{item.name}</td>
                        <td className="width120">{item.quantity}</td>
                        <td>
                            <input
                                className="width120"
                                type="checkbox"
                                checked={item.purchased}
                                onChange={() => handleTogglePurchased(item.id, item.purchased)}
                                aria-label={`Mark ${item.name} as purchased`}
                            />
                        </td>
                        <td>
                            <FaTrashAlt
                                className="Thrash"
                                aria-label={`Delete ${item.name}`}
                                onClick={() => handleDeleteItem(item.id)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="bottom top-margin50 list-button" onClick={() => navigate('/')}>Back to all lists</button>

        </div>
    );
};

export default IndividualShoppingList;
