import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import '../db/db.js'; // Import your database connection file

// Middleware to check if the user is added to the database after signing up
export const checkUserInDatabase = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            console.log(`User ${user.email} found in database`);
            return next(); // Proceed if user is found
        } else {
            return res.status(404).json({ message: 'User not found in the database after registration' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error checking user in database', error: 'Internal Server Error' });
    }
};

// Register a new user
export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //"username" is changed to "name" in the request body
    const { name, email, password, profileImage } = req.body;

    try {
        console.log('Checking if user exists...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password...');
        const hashPassword = await bcrypt.hash(password, 10);

        console.log('Saving user to database...');
        const newUser = new User({
            name,
            email,
            password,
            profileImage: profileImage || null,
        });

        await newUser.save();
        console.log('User registered successfully:', newUser);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal Server Error', error: 'An error occurred during registration' });
    }
};
// helper function 
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '2h' }
  );
};

// Update the loginUser function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Compare password using bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token and send response
    const token = generateToken(user);
    
    // Remove password from user object
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    res.status(200).json({
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fetch all users
export const fetchUsers = async (req, res) => {
    try {
        const userData = await User.find();
        res.status(200).json(userData);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Internal Server Error', error: 'An error occurred while fetching users' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        // Validate if id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Find user first using ObjectId
        const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare update object
        const updateData = {};
        if (username) updateData.name = username;
        if (email) {
            // Check if new email already exists for another user
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            updateData.email = email;
        }
        
        // If password is being updated, hash it
        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            updateData.password = hashPassword;
        }

        // Update user with validation and return new document
        const updatedUser = await User.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        );

        console.log('User updated successfully:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: 'An error occurred while updating the user' 
        });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Internal Server Error', error: 'An error occurred while deleting the user' });
    }
};
