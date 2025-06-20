import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import formRouter from './routes/formRoute';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/form', formRouter);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(5000, () => console.log('Server running on http://localhost:5000'));
});
