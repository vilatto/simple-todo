import { z } from 'zod';

export const createTodoSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  dueDate: z.string().datetime().optional(),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTodoSchema = z.object({
  description: z.string().min(1).max(500).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);
