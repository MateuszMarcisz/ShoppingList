import React from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ShoppingList from './components/ShoppingList/ShoppingList';
import Navigation from "./components/ShoppingList/Navigation";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Navigation/>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/" element={<ShoppingList/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;