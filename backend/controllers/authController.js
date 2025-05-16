import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const loginUser = async (req, res) => {
    try {
        console.log('Login attempt received:', req.body.email);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user by email (case insensitive)
        const user = await User.findOne({ 
            email: { $regex: new RegExp('^' + email + '$', 'i') } 
        });
        
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ 
                message: 'Invalid email or password. Please check your credentials and try again.' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password does not match for user:', email);
            return res.status(401).json({ 
                message: 'Invalid email or password. Please check your credentials and try again.' 
            });
        }

        // Create a simple auth token
        const simpleToken = Buffer.from(`${user._id}-${Date.now()}`).toString('base64');

        // Send response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'employee'
        };
        
        console.log('Login successful for user:', email);
        
        res.status(200).json({
            token: simpleToken,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message 
        });
    }
};