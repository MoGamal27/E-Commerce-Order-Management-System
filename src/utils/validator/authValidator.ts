const { check } = require('express-validator');
import validatorMiddleware from '../../middleware/validatorMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signupValidator = [
    check("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("provide a valid email")
        .custom(async (value: string) => {
            const userDoc = await prisma.user.findUnique({
                where: { email: value }
            });
            if (userDoc) {
                throw new Error("Email already in use");
            }
            return true;
        }),

    check("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters"),

    validatorMiddleware,
];


export const signinValidator = [
    check("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("provide a valid email"),

    check("password")
        .notEmpty()
        .withMessage("password is required"),

    validatorMiddleware,
];