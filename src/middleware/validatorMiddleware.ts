import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');

const validatorMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    await next();
};

export default  validatorMiddleware;