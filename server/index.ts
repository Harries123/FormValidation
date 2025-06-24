import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import formRouter from './routes/formRoute';
import path from 'path';

dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
}));


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.get("/", (req: any, res: any) => {
  return res.json({
    success: true,
    message: "hello world"
  });
});

app.use('/api/form', formRouter);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });
  

  


