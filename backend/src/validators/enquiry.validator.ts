import { z } from 'zod';

export const contactEnquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email address is required').email('Please enter a valid email address'),
  phone: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  serviceRequired: z.string().trim().min(2, 'Please select a service'),
  monthlyBill: z.string().trim().optional().or(z.literal('')),
  solarType: z.string().trim().optional().or(z.literal('')),
  subject: z.string().trim().optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Project details must contain at least 10 characters'),
});
