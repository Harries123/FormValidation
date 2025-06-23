import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import FormModel from '../models/Form';

export const submitForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Validate form fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    // Check if a file was uploaded
    if (!req.file) {
      res.status(400).json({ error: 'ID proof file is required' });
      return;
    }

    const {
      name,
      email,
      phone,
      gender,
      dob,
      address,
      pincode,
      govtIdType,
      govtIdNumber,
      gstNo,
      password,
    } = req.body;

    const formData = new FormModel({
      name,
      email,
      phone,
      gender,
      dob,
      address,
      pincode,
      govtIdType,
      govtIdNumber,
      gstNo,
      password,
      idProof: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });

    await formData.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error('Error submitting form:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
