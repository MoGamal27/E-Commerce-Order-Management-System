import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

const roleAuth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.currentUser?.role)) {
      return next(new AppError("You don't have permission to perform this action", 403));
    }
    next();
  };
};

export default roleAuth;
