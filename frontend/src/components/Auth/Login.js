import React, {useState, useContext} from 'react';
import {AuthContext} from '../../contexts/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            // Redirect to shopping list page
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <>
            <section className="Registration">
            <form className="RegistrationForm" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
            </section>
        </>
    );
};

export default Login;
