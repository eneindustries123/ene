import { z } from 'zod';

export const quoteRequestSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email address is required').email('Please enter a valid email address'),
  phone: z.string().trim().optional().or(z.literal('')),
  company: z.string().trim().optional().or(z.literal('')),
  country: z.string().trim().min(2, 'Country or region is required'),
  solutionType: z.string().trim().min(1, 'Solution type is required'),
  projectType: z.string().trim().min(1, 'Project environment is required'),
  estimatedCapacity: z.string().trim().optional().or(z.literal('')),
  estimatedBudget: z.string().trim().optional().or(z.literal('')),
  timeline: z.string().trim().optional().or(z.literal('')),
  message: z.string().trim().optional().or(z.literal('')),
});
