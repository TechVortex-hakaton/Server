import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/apiResponse';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = err.meta?.target;
      const field = Array.isArray(target) ? target.join(', ') : 'Field';
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    return res.status(400).json({ success: false, message: 'Database request error' });
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    return res.status(400).json({ success: false, message });
  }

  if (err instanceof Error && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};
