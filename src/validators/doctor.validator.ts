import { z } from 'zod';

export const adminCreateDoctorSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  specialization: z.string().min(2),
  experience: z.number().int().nonnegative().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export const adminUpdateDoctorSchema = z.object({
  fullName: z.string().min(2).optional(),
  specialization: z.string().min(2).optional(),
  experience: z.number().int().nonnegative().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateDoctorProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  specialization: z.string().min(2).optional(),
  experience: z.number().int().nonnegative().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});
