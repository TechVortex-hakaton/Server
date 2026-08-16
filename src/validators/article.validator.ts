import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  content: z.string().min(1),
  image: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export const updateArticleSchema = createArticleSchema.partial();
