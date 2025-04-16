import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');

const validatorMiddleware = (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    next();
};

export default validatorMiddleware;