// import React, {useContext, useState, useEffect} from 'react';
// import axios from '../../api/axios';
// import {AuthContext} from '../../contexts/AuthContext';
// import {useNavigate} from 'react-router-dom';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faPlus} from "@fortawesome/free-solid-svg-icons";
// import {FaTrashAlt} from "react-icons/fa";
//
//
// const ShoppingList = () => {
//     const {isAuthenticated} = useContext(AuthContext);
//     const [shoppingLists, setShoppingLists] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const {user} = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [newListName, setNewListName] = useState('');
//
//
//     useEffect(() => {
//         if (isAuthenticated) {
//             axios.get('/shoppinglists/')
//                 .then(response => {
//                     setShoppingLists(response.data);
//                     setLoading(false);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching shopping lists:', error);
//                     setLoading(false);
//                 });
//         }
//     }, [isAuthenticated]);
//
//     const handleAddList = async (e) => {
//         e.preventDefault();
//         if (!newListName) return;
//
//         try {
//             const response = await axios.post(`/shoppinglists/`, {
//                 name: newListName,
//                 user: user.id,
//             });
//             setShoppingLists(prevLists => [...prevLists, response.data]);
//             setNewListName('');
//         } catch (error) {
//             console.log(user);
//             console.error('Error adding list:', error);
//             //  Add later user-friendly error handling here
//         }
//     };
//
//     const handleDeleteList = async (listId) => {
//         try {
//             await axios.delete(`/shoppinglists/${listId}/`);
//             setShoppingLists(prevLists => prevLists.filter(list => list.id !== listId));
//         } catch (error) {
//             console.error('Error deleting list:', error);
//             // Add later user-friendly error handling here
//         }
//     };
//
//
//     if (!user) {
//         return (
//             <div className="center-text">
//                 <h1>Looks like you are not logged in.</h1>
//                 <button onClick={() => navigate('/login')}>Login</button>
//             </div>)
//     }
//
//     if (loading) {
//         return <p>Loading...</p>;
//     }
//
//     return (
//         <div className="Lists">
//             <h1 className="center-text">Shopping Lists</h1>
//
//             <div className="form-container top-margin50">
//                 <form onSubmit={handleAddList}>
//                     <label htmlFor="addItem" className="sr-only">Add Item</label>
//                     <input
//                         id='addItem'
//                         type='text'
//                         placeholder='Add New Shopping List'
//                         maxLength={100}
//                         value={newListName}
//                         onChange={(e) => setNewListName(e.target.value)}
//                         required
//                         aria-label="List name"
//                     />
//                     <button type="submit" className="icon-button">
//                         <FontAwesomeIcon icon={faPlus}/>
//                     </button>
//                 </form>
//             </div>
//
//             {shoppingLists.length === 0 ? (
//                 <p>No shopping lists found.</p>
//             ) : (
//                 <ul style={{listStyleType: 'none', padding: 0}}>
//                     {shoppingLists.map(list => (
//                         <li key={list.id} style={{marginBottom: '10px', position: 'relative'}}>
//                             <button
//                                 className="lists-link-button"
//                                 onClick={() => navigate(`/shoppinglist/${list.id}`)}
//                             >
//                                 {list.name}
//                             </button>
//                             <FaTrashAlt
//                                 className="Thrash right-margin0"
//                                 aria-label={`Delete ${list.name}`}
//                                 onClick={() => handleDeleteList(list.id)}
//                                 style={{position: 'absolute', right: '10px', top: '50%', fontSize: '1.2rem'}}
//                             />
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };
//
// export default ShoppingList;
//

// src/components/shoppingList/ShoppingList.js

import React, { useContext } from 'react';
import { ShoppingListContext } from '../../contexts/ShoppingListContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaTrashAlt } from "react-icons/fa";

const ShoppingList = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const { shoppingLists, loading, newListName, setNewListName, addList, deleteList } = useContext(ShoppingListContext);
    const navigate = useNavigate();

    const handleAddList = async (e) => {
        e.preventDefault();
        await addList(newListName);
    };

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
            <h1 className="center-text">Shopping Lists</h1>

            <div className="form-container top-margin50">
                <form onSubmit={handleAddList}>
                    <label htmlFor="addItem" className="sr-only">Add Item</label>
                    <input
                        id='addItem'
                        type='text'
                        placeholder='Add New Shopping List'
                        maxLength={100}
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        required
                        aria-label="List name"
                    />
                    <button type="submit" className="icon-button">
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </form>
            </div>

            {shoppingLists.length === 0 ? (
                <p>No shopping lists found.</p>
            ) : (
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {shoppingLists.map(list => (
                        <li key={list.id} style={{marginBottom: '10px', position: 'relative'}}>
                            <button
                                className="lists-link-button"
                                onClick={() => navigate(`/shoppinglist/${list.id}`)}
                            >
                                {list.name}
                            </button>
                            <FaTrashAlt
                                className="Thrash right-margin0"
                                aria-label={`Delete ${list.name}`}
                                onClick={() => deleteList(list.id)}
                                style={{position: 'absolute', right: '10px', top: '50%', fontSize: '1.2rem' }}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShoppingList;
