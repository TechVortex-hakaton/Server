import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  patientId: z.string().uuid(),
  diagnosis: z.string().min(1),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
});

export const updateMedicalRecordSchema = z.object({
  diagnosis: z.string().min(1).optional(),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
});
