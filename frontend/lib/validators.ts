import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  client: z.string().min(2, 'Client name is required'),
  location: z.string().min(2, 'Location is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  category: z.string().min(2, 'Category is required'),
  completionYear: z.number().int().min(1990).max(2035),
  summary: z.string().min(10, 'Summary is required (min 10 characters)').max(500),
  fullStory: z.string().min(20, 'Full story description is required (min 20 characters)'),
  mainImage: z.string().min(1, 'Main project image URL or upload is required'),
  gallery: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
});

export const updateReviewSchema = z.object({
  id: z.string().min(1, 'Review ID required'),
  status: z.enum(['pending', 'approved', 'hidden', 'rejected']),
  featured: z.boolean().optional(),
});

export const publicReviewSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address required'),
  company: z.string().optional(),
  role: z.string().optional(),
  service: z.string().min(2, 'Service/Project type is required'),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(10, 'Review text must be at least 10 characters'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Consent is required to submit review',
  }),
  honeypot: z.string().optional(),
});
