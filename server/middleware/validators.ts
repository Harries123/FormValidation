import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const validationMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

const validateForm: RequestHandler[] = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage(
      'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, and a number'
    ),

  validationMiddleware,
];

export { validateForm };
