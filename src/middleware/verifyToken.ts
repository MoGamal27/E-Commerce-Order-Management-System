import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError} from '../utils/appError';
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request type to include currentUser
declare global {
  namespace Express {
    interface Request {
      currentUser?: jwt.JwtPayload;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return next(new AppError('No token provided', 401));
  }

  const token = (authHeader as string).split(' ')[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;
    req.currentUser = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
};

export default verifyToken;
