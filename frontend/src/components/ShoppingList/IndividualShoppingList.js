import React, {useEffect, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';
import {ShoppingListContext} from '../../contexts/ShoppingListContext';
import {FaTrashAlt} from 'react-icons/fa';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

const IndividualShoppingList = () => {
    const {id} = useParams();
    const {isAuthenticated} = useContext(AuthContext);
    const {
        shoppingList,
        fetchShoppingList,
        newItemName,
        setNewItemName,
        newItemQuantity,
        setNewItemQuantity,
        addItem,
        deleteItem,
        togglePurchased,
        loading,
        setLoading,
        error,
        setError
    } = useContext(ShoppingListContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchShoppingList(id);
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, id, setLoading]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        await addItem(id, newItemName, newItemQuantity);
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

    const sortedItems = shoppingList.items.slice().sort((a, b) => {return a.id - b.id;});

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
                        maxLength={100}
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
                    <th className="width120">Delete</th>
                </tr>
                </thead>
                <tbody>
                {sortedItems.map(item => (
                    <tr key={item.id} className={item.purchased ? 'purchased' : ''}>
                        <td>{item.name}</td>
                        <td className="width120">{item.quantity}</td>
                        <td>
                            <input
                                className="width120"
                                type="checkbox"
                                checked={item.purchased}
                                onChange={() => togglePurchased(item.id, item.purchased)}
                                aria-label={`Mark ${item.name} as purchased`}
                            />
                        </td>
                        <td>
                            <FaTrashAlt
                                className="Thrash width120"
                                aria-label={`Delete ${item.name}`}
                                onClick={() => deleteItem(item.id)}
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
