import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import entriesRoutes from './routes/entries.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/entries', entriesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Data Management API is running');
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB - either use the provided URI or a local MongoDB instance
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/data-management');
    console.log('Connected to MongoDB');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();