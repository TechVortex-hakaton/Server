import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const authMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }

    const token = header.slice(7);
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      throw new AppError(401, 'Invalid or expired token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) {
      throw new AppError(401, 'User not found or inactive');
    }

    req.user = { id: user.id, role: user.role };
    next();
  }
);
