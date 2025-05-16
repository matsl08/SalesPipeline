import express from 'express';
import { loginUser } from '../controllers/authController.js';
import { auth } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', loginUser);

// Test route to verify authentication
router.get('/verify', auth, (req, res) => {
  res.status(200).json({ 
    valid: true, 
    user: req.user 
  });
});

// Route to create a test user
router.post('/create-test-user', async (req, res) => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      return res.status(200).json({ 
        message: 'Test user already exists',
        email: 'test@example.com',
        password: 'password123'
      });
    }
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    
    await testUser.save();
    
    res.status(201).json({
      message: 'Test user created successfully',
      email: 'test@example.com',
      password: 'password123'
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ 
      message: 'Error creating test user', 
      error: error.message 
    });
  }
});

export default router;