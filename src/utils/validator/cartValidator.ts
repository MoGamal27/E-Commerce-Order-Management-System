const { check } = require("express-validator");
import validatorMiddleware from '../../middleware/validatorMiddleware'

export const cartValidator = [
    check("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isNumeric()
        .withMessage("User ID must be a number"),

    check("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isNumeric()
        .withMessage("Product ID must be a number"),

    check("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isNumeric()
        .withMessage("Quantity must be a number")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    validatorMiddleware
]