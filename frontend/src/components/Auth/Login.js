import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);

            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setError('Login failed. Please check your credentials.');
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
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </section>
        </>
    );
};

export default Login;