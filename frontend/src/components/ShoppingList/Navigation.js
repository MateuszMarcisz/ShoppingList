// Navigation.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navigation = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav>
            <div>
                <button onClick={() => navigate('/')}>Home</button>
            </div>
            <div>
                {user ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <button onClick={() => navigate('/register')}>Register</button>
                        <button onClick={() => navigate('/login')}>Login</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
