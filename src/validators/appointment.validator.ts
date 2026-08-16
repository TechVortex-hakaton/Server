import { z } from 'zod';

export const createAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  date: z.string().min(1, 'date is required'),
  time: z.string().min(1, 'time is required'),
  reason: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
});
