import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'fullName must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'password is required'),
});

export const updateMeSchema = z.object({
  fullName: z.string().min(2, 'fullName must be at least 2 characters').optional(),
  email: z.string().email('Invalid email').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'newPassword must be at least 6 characters').optional(),
});
