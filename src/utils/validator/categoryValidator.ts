const { check } = require("express-validator");
import validatorMiddleware from'../../middleware/validatorMiddleware'

export const categoryValidator = [

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

    validatorMiddleware
]

