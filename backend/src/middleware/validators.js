/**
 * Request validation middleware
 */

const { body } = require('express-validator');

/**
 * Validation rules for creating a product
 */
exports.validateCreateProduct = [
  body('asin')
    .notEmpty().withMessage('ASIN is required')
    .trim()
    .isLength({ min: 10, max: 10 }).withMessage('ASIN must be 10 characters')
    .isAlphanumeric().withMessage('ASIN must be alphanumeric'),

  body('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  body('price.amount')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01, max: 100000 }).withMessage('Price must be between 0.01 and 100000'),

  body('price.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'INR', 'AUD', 'MXN', 'BRL']).withMessage('Invalid currency'),

  body('category')
    .optional()
    .trim(),

  body('brand')
    .optional()
    .trim(),

  body('images.primary')
    .optional()
    .isURL().withMessage('Primary image must be a valid URL'),

  body('submittedBy.email')
    .optional()
    .isEmail().withMessage('Invalid email format')
];

/**
 * Validation rules for updating a product
 */
exports.validateUpdateProduct = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  body('price.amount')
    .optional()
    .isFloat({ min: 0.01, max: 100000 }).withMessage('Price must be between 0.01 and 100000'),

  body('images.primary')
    .optional()
    .isURL().withMessage('Primary image must be a valid URL')
];
