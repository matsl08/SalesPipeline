import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by id
        const user = await User.findById(decoded.userId)
            .select('-password'); // Exclude password
        
        if (!user) {
            throw new Error('User not found');
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ 
            message: 'Invalid token', 
            error: error.message 
        });
    }
};