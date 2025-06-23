import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestHandler } from 'express';


// Middleware to handle validation errors
const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};


// Validation rules for form submission
const validateForm: RequestHandler[] = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid phone number'),

  body('gender')
    .isIn(['male', 'female', 'prefer not to say'])
    .withMessage('Select a valid gender'),

  body('dob')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const d = today.getDate() - dob.getDate();

      const is18OrOlder = age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
      if (isNaN(dob.getTime()) || !is18OrOlder) {
        throw new Error('You must be at least 18 years old');
      }
      return true;
    }),

  body('address')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters'),

  body('pincode')
    .matches(/^\d{6}$/)
    .withMessage('Invalid pincode'),

  body('govtIdType')
    .isIn(['Aadhar', 'PAN', 'Driving License', 'Passport'])
    .withMessage('Invalid Govt ID Type'),

  body('govtIdNumber')
    .isLength({ min: 5 })
    .withMessage('Enter a valid ID number'),

  // gstNo is optional but must match format if provided
  body('gstNo')
    .optional({ checkFalsy: true })
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid GSTIN format'),

  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage('Password must include uppercase, lowercase, and number'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  validationMiddleware,
];

export { validateForm };
