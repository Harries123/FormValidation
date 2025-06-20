import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import FormModel from '../models/Form';

export const submitForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const formData = new FormModel(req.body);
    await formData.save();
    res.status(201).json({ message: 'Form submitted' });
  } catch (err) {
    console.error('Error submitting form:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
