import express from 'express';
import { validateForm } from '../middleware/validators';
import { submitForm } from '../controllers/formController';

const router = express.Router();


router.post('/', ...validateForm, submitForm);

export default router;
