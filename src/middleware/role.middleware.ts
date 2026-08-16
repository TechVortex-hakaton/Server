import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../utils/apiResponse';

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, 'Insufficient permissions');
    }
    next();
  };
};

export const doctorMiddleware = requireRole('DOCTOR');
export const patientMiddleware = requireRole('PATIENT');
