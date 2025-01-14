import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';

const Navigation = () => {
    const navigate = useNavigate();
    const {isAuthenticated, user, logout} = useContext(AuthContext);

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
                {isAuthenticated ? (
                    <>
                        <button className="hello">Hello, {user.username}!</button>
                        <button onClick={handleLogout}>Logout</button>
                    </>
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