import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ShoppingList from './components/ShoppingList/ShoppingList';
import Logout from "./components/Auth/Logout";

function Navigation() {
    const navigate = useNavigate();

    return (
        <nav>
            <div>
                <button onClick={() => navigate('/')}>Home</button>
            </div>
            <div>
                <button onClick={() => navigate('/register')}>Register</button>
                <button onClick={() => navigate('/login')}>Login</button>
                <Logout/>
            </div>
        </nav>
    );
}

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