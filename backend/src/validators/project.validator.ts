import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  client: z.string().min(2, 'Client name is required'),
  location: z.string().min(2, 'Location is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  category: z.string().min(1, 'Category is required'),
  completionYear: z.string().min(4, 'Completion year is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  fullStory: z.string().min(20, 'Full story must be at least 20 characters'),
  mainImage: z.string().min(1, 'Main image URL is required'),
  gallery: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
});

export const updateProjectSchema = createProjectSchema.partial();
