import { z } from 'zod';

export const quoteRequestSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone number is required'),
  company: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  solutionType: z.string().min(1, 'Solution type is required'),
  projectType: z.string().min(1, 'Project type is required'),
  estimatedCapacity: z.string().optional(),
  estimatedBudget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
});
