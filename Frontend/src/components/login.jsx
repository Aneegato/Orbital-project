import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:5001/login', { email, password });
            console.log(result);
            if (result.data.message === "Success") {
                navigate('/home', { state: { userId: result.data.userId } });
            } else {
                setErrorMessage(result.data);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Incorrect email or password');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h1>LOGIN</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="Email" 
                            className="form-control" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Password" 
                            className="form-control" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <button type="submit" className="btn btn-primary w-100 rounded-0">
                        Login
                    </button>
                </form>
                <p>Don't Have a timeNUS Account?</p>
                <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Register
                </Link>
            </div>
        </div>
    );
}

export default Login;

