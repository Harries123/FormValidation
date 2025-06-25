import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import formRouter from './routes/formRoute';
import path from 'path';

dotenv.config();

const app = express();


app.use(cors({
  origin: ['http://localhost:5000', "https://formvalidation-76l6.onrender.com"], 
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
    app.listen(5000, () => console.log('Server running on https://formvalidation-server-ko5b.onrender.com'));
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });
  


  


