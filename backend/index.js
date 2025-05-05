import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';    
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDatabase from './db/db.js';

// import userRoute from './routes/userRoute.js';


const app = express();
dotenv.config();

connectDatabase();

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

// mongoose.connect (MONGODB_URL). then (() => {
//     console.log('MongoDB connected successfully');
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     })
// }) .catch ((error) => {
//     console.error('MongoDB connection error:', error);
// });


// app.use('/api/users', userRoute);