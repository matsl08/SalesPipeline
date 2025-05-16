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

        // Decode the simple token
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const userId = decoded.split('-')[0];
        
        // Find user by id
        const user = await User.findById(userId)
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