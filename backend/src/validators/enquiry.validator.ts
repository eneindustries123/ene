import { z } from 'zod';

export const contactEnquirySchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  serviceRequired: z.string().min(2, 'Service is required'),
  monthlyBill: z.string().optional(),
  solarType: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
