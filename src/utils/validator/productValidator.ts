const { check } = require("express-validator");
import validatorMiddleware from '../../middleware/validatorMiddleware'

export const productValidator = [
    check("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .isLength({ max: 32 })
        .withMessage("Title must be less than 32 characters"),

    check("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 3 })
        .withMessage("Description must be at least 3 characters"),

    check("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),

    check("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isNumeric()
        .withMessage("Stock must be a number"),

    check("categoryId")
        .notEmpty()
        .withMessage("Category ID is required")
        .isNumeric()
        .withMessage("Category ID must be a number"),

    validatorMiddleware
]