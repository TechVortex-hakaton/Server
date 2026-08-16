import { z } from 'zod';

export const createSportSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().optional(),
  duration: z.number().int().positive().optional(),
  difficulty: z.string().optional(),
  calories: z.number().int().positive().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSportSchema = createSportSchema.partial();
