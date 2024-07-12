import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ShoppingLists from './components/ShoppingList/ShoppingLists';
import Navigation from './components/ShoppingList/Navigation';
import IndividualShoppingList from "./components/ShoppingList/IndividualShoppingList";
import {ShoppingListProvider} from "./contexts/ShoppingListContext";

function App() {
    return (
        <AuthProvider>
            <ShoppingListProvider>
            <Router>
                <Navigation/>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/" element={<ShoppingLists/>}/>
                    <Route path="/shoppinglist/:id" element={<IndividualShoppingList />} />
                </Routes>
            </Router>
                </ShoppingListProvider>
        </AuthProvider>
    );
}

export default App;