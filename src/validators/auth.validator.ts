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
