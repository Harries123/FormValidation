import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import formRouter from './routes/formRoute';
import path from 'path';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Your Next.js frontend URL
  credentials: true,
}));

// Serve uploaded files statically (if needed)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Don't use express.json() for file uploads (handled by multer)
app.use('/api/form', formRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });

  


