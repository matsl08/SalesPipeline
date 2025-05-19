# Sales Pipeline System

## Setup and Running Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or accessible via connection string)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/salesPipeline
   PORT=3000
   JWT_SECRET=your_very_strong_secret_key_here
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Seed the database with sample data:
   ```
   npm run seed
   ```

5. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd ../endfront
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Access the application at: http://localhost:5173

## Troubleshooting

### API Error: "Unexpected token '<', '<!DOCTYPE '... is not valid JSON"
This error occurs when the API endpoint is returning HTML instead of JSON. Common causes:

1. **Backend server is not running**
   - Make sure the backend server is running on port 3000
   - Check for any errors in the backend console

2. **Proxy configuration issue**
   - Verify that the Vite proxy configuration is correct in `vite.config.js`
   - The proxy should be configured to forward `/api` requests to the backend server

3. **Database connection issue**
   - Ensure MongoDB is running and accessible
   - Check the MongoDB connection string in the `.env` file

4. **No data in the database**
   - Run the seed script to populate the database with sample data:
     ```
     cd backend
     npm run seed
     ```

5. **CORS issues**
   - Check that CORS is properly configured in the backend server
   - The backend should allow requests from the frontend origin

## Features
- Dashboard with analytics overview
- Sales pipeline management
- Lead tracking and management
- Interaction history
- Reporting tools
