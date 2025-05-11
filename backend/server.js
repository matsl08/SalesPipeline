import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';    
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDatabase from './db/db.js';
import interactionRoutes from './routes/interactionRoutes.js';
import userRoute from './routes/userRoute.js';
import leadRoute from './routes/leadRoutes.js';
import analyticsRoute from './routes/analyticsRoute.js';
import authRoute from './routes/authRoute.js';


dotenv.config();

connectDatabase();
const app = express();
const PORT = process.env.PORT || 3000;



// const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/salesPipeline';

// app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Add this before your routes
app.use((req, res, next) => {
    console.log( `${req.method} ${req.url}`);
    next();
});
//routes
app.use('/api/interactions', interactionRoutes);
app.use('/api/users', userRoute);
app.use('/api/leads', leadRoute);
app.use('/api/analytics', analyticsRoute);
app.use('/api/auth', authRoute);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

export default app;
