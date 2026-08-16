import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiResponse';

export const adminMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new AppError(403, 'Admin access required');
  }
  next();
};
