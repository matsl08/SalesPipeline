import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salesPipeline');
    console.log('Connected to MongoDB');

    // Check if test user exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await testUser.save();
    console.log('Test user created successfully');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();