// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../../contexts/AuthContext';
//
// const Register = () => {
//     const [username, setUsername] = useState('');
//     // const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const { register } = useContext(AuthContext);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await register(username, password);
//             // Redirect to shopping list page
//         } catch (error) {
//             console.error('Registration failed', error);
//         }
//     };
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Username"
//             />
//             {/*<input*/}
//             {/*    type="email"*/}
//             {/*    value={email}*/}
//             {/*    onChange={(e) => setEmail(e.target.value)}*/}
//             {/*    placeholder="Email"*/}
//             {/*/>*/}
//             <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//             />
//             <button type="submit">Register</button>
//         </form>
//     );
// };
//
// export default Register;

import React, {useState, useContext, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


const Register = () => {
    const navigate = useNavigate();

    const userRef = useRef(null);
    const pwdRef = useRef(null);
    const confirmPwdRef = useRef(null);
    const errRef = useRef(null);

    const {register} = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setValidUsername(USER_REGEX.test(e.target.value));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setValidPassword(PWD_REGEX.test(e.target.value));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setValidConfirmPassword(e.target.value === password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validUsername || !validPassword || !validConfirmPassword) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            await register(username, password);
            setSuccess(true);
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    };

    const handleSignInClick = () => {
        navigate('/login');
    }

    return (
        <>
            {success ? (
                <section className="Registration">
                    <h1>Success!</h1>
                    <p>
                        <a href="#" onClick={handleSignInClick}>Sign In</a>
                    </p>
                </section>
            ) : (
                <section className="Registration">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form className="RegistrationForm" onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"}/>
                            <FontAwesomeIcon icon={faTimes}
                                             className={validUsername || !username ? "hide" : "invalid"}/>
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                            aria-invalid={validUsername ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUsernameFocus(true)}
                            onBlur={() => setUsernameFocus(false)}
                        />
                        <p id="uidnote"
                           className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            4 to 24 characters.<br/>
                            Must begin with a letter.<br/>
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"}/>
                            <FontAwesomeIcon icon={faTimes}
                                             className={validPassword || !password ? "hide" : "invalid"}/>
                        </label>
                        <input
                            type="password"
                            id="password"
                            ref={pwdRef}
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            8 to 24 characters.<br/>
                            Must include uppercase and lowercase letters, a number and a special character.<br/>
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span
                            aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span
                            aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

                        <label htmlFor="confirm_password">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validConfirmPassword ? "valid" : "hide"}/>
                            <FontAwesomeIcon icon={faTimes}
                                             className={validConfirmPassword || !confirmPassword ? "hide" : "invalid"}/>
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            ref={confirmPwdRef}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            aria-invalid={validConfirmPassword ? "false" : "true"}
                            aria-describedby="confirmnotenote"
                            onFocus={() => setConfirmPasswordFocus(true)}
                            onBlur={() => setConfirmPasswordFocus(false)}
                        />
                        <p id="confirmnotenote"
                           className={confirmPasswordFocus && !validConfirmPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            Must match the password input field.
                        </p>

                        <button disabled={!validUsername || !validPassword || !validConfirmPassword}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br/>
                        <span className="line">
                            {/* Put router link here */}
                            <a href="#" onClick={handleSignInClick}>Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    );
};

export default Register;
