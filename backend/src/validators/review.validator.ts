import { z } from 'zod';

export const submitReviewSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  role: z.string().optional(),
  service: z.string().min(2, 'Service name is required'),
  rating: z.number().min(1).max(5),
  review: z.string().min(10, 'Review must be at least 10 characters'),
  consent: z.boolean().refine((val) => val === true, 'Consent is required'),
  honeypot: z.string().optional(),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'hidden', 'rejected']),
  featured: z.boolean().optional(),
});
