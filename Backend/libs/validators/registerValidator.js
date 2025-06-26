import { body } from 'express-validator';

const registerValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Username is required'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export default registerValidator;