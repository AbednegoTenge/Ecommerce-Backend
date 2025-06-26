import { body } from "express-validator";

const productValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required'),

    body('description')
        .trim()
        .optional(),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),

    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),

    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative number'),

    body('imageUrl')
        .trim()
        .optional()
        .isURL().withMessage('Image must be a valid URL')
];

export default productValidator;