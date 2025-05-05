import React, { useState } from 'react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <>
            <nav className = "navbar">
                <h1 className = "navTitle">Sales Pipeline</h1>
            </nav>
            <div className="login-container">
                <h2 className ="header">Sales Pipeline Login</h2>
                <form onSubmit={handleSubmit} className = "form">
                    <div className = "inputGroup">
                        <label htmlFor="email" className = "label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className = "input"
                            required
                        />
                    </div>
                    <div className = "inputGroup">
                        <label htmlFor="password" className = "label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className = "input"
                            required
                        />
                    </div>
                    <button type="submit" className = "button">Login</button>
                </form>
            </div>
        </>
    );
};

export default Login;