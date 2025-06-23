import express from 'express';
import multer from 'multer';
import path from 'path';
import { validateForm } from '../middleware/validators';
import { submitForm } from '../controllers/formController';

const router = express.Router();

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Use `upload.single('idProof')` middleware to handle file
router.post('/', upload.single('idProof'), validateForm, submitForm);

export default router;
