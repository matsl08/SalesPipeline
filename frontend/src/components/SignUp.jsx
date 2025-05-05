import React, { useState } from 'react';
import './Login.css';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Add signup logic here
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <>
            <nav className="navbar">
                <h1 className="navTitle">Sales Pipeline</h1>
            </nav>
            <div className="signup-container">
                <h2 className="header">Sales Pipeline Sign Up</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="name" className="label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="email" className="label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="password" className="label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="confirmPassword" className="label">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                    <button type="submit" className="button">Sign Up</button>
                </form>
            </div>
        </>
    );
};

export default SignUp;