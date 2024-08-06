import React, {useState, useContext, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() === '' || password.trim() === '') {
            setErrMsg('Username and password are required');
            errRef.current.focus();
            return;
        }
        try {
            await login(username, password);
            navigate('/');
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 400) {
                setErrMsg('Wrong Credentials');

            } else {
                setErrMsg('Login Failed');
            }
            setPassword('');
            errRef.current.focus();
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    }

    return (
        <>
            <section className="Registration">
                <p ref={errRef} className={errMsg ? "errmsg center-text" : "offscreen"}
                   aria-live="assertive">{errMsg}</p>
                <h1 className="center-text">Sign In</h1>
                <form className="RegistrationForm" onSubmit={handleSubmit}>
                    <label htmlFor="Username">Username:</label>
                    <input
                        type="text"
                        id="Username"
                        ref={userRef}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <label htmlFor="Password">Password:</label>
                    <input
                        type="password"
                        id="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Login</button>
                    <p className="center-text">
                        <br/>
                        Do not have account?<br/>
                        <span className="line">
                            <button className="signin-button" onClick={handleRegisterClick}>Register</button>
                        </span>
                    </p>
                </form>
            </section>
        </>
    );
};

export default Login;