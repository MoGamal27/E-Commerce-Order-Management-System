import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

interface ErrorResponse {
  status: string;
  message: string;
  error?: any;
  stack?: string;
}

const sendErrorForDev = (err: any, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  } as ErrorResponse);
};

const sendErrorForProd = (err: any, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  } as ErrorResponse);
};

const handleJWTInvalidSignature = (): AppError => 
  new AppError('Invalid token, please login again...', 401);

const handleJWTTokenExpiredError = (): AppError => 
  new AppError('Token expired, please login again...', 401);

const globalError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else {
    if (err.name === 'JsonWebTokenError') err = handleJWTInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleJWTTokenExpiredError();
    sendErrorForProd(err, res);
  }
};

export default globalError;