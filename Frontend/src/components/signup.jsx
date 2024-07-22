import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../axiosConfig';
import { useNavigate } from "react-router-dom";

function Signup({ onSignup }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const baseURL = process.env.VITE_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(`${baseURL}/auth/register`, { name, email, password });
            console.log(result);
            onSignup(name);
            navigate('/home');
        } catch (err) {
            console.log(err);
        }
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h1>REGISTER</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-control rounded-0">
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            placeholder="Name" 
                            className="form-control mb-3" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="Email" 
                            className="form-control mb-3" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Password" 
                            className="form-control mb-3" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <button type="submit" className="btn btn-success w-100 rounded-0">
                            Register
                        </button>
                    </div>
                </form>
                <p>Already Have an Account?</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Signup;
