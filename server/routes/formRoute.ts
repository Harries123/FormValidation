import express from 'express';
import multer from 'multer';
import path from 'path';
import { validateForm } from '../middleware/validators';
import { submitForm } from '../controllers/formController';

const router = express.Router();

// File storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1000000000)}-${file.originalname}`);
  },
});


const upload = multer({ storage });

// Use `upload.single('idProof')` middleware to handle file
router.post('/', upload.single('idProof'), validateForm, submitForm);

export default router;
