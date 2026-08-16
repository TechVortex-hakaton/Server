import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

export interface JwtPayload {
  id: string;
  role: Role;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
