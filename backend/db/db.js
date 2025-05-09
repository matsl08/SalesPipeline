import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Test the connection
        await mongoose.connection.db.admin().ping();
        console.log('Database ping successful');
    } catch (error) {
        console.error('MongoDB connection error:', {
            message: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
};

export default connectDatabase;