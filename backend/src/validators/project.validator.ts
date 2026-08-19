import { z } from 'zod';

export const isVideoUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mkv') ||
    url.startsWith('data:video/')
  );
};

export const createProjectSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  client: z.string().trim().min(2, 'Client name is required'),
  location: z.string().trim().min(2, 'Location is required'),
  capacity: z.string().trim().min(1, 'Capacity is required'),
  category: z.string().trim().min(1, 'Category is required'),
  completionYear: z.coerce
    .number()
    .int('Completion year must be an integer')
    .min(1990, 'Completion year must be 1990 or later')
    .max(2035, 'Completion year must be 2035 or earlier'),
  summary: z
    .string()
    .trim()
    .min(10, 'Summary must be at least 10 characters')
    .max(400, 'Summary must not exceed 400 characters'),
  fullStory: z.string().optional().default(''),
  mainImage: z.string().trim().min(1, 'Main image is required'),
  gallery: z
    .array(z.string().min(1))
    .min(1, 'At least 1 supporting media file is required')
    .max(3, 'Maximum 3 supporting media files allowed')
    .refine(
      (items) => items.filter(isVideoUrl).length <= 1,
      'A maximum of 1 video file is allowed in supporting media'
    ),
  isFeatured: z.boolean().optional().default(false),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
});

export const updateProjectSchema = createProjectSchema.partial();
