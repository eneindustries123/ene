'use server';

import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const quoteRequestSchema = z.object({
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

export async function subscribeNewsletter(email: string) {
  const result = newsletterSchema.safeParse({ email });
  if (!result.success) {
    return { success: false, message: result.error.errors[0].message };
  }

  // Simulate server/database latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Thank you for subscribing! Check your inbox for confirmation.',
  };
}

export async function submitContactForm(formData: Record<string, any>) {
  const result = contactFormSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    message: 'Your inquiry has been successfully sent. Our engineering team will get back to you within 24 hours.',
  };
}

export async function submitQuoteRequest(formData: Record<string, any>) {
  const result = quoteRequestSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: 'Quote request submitted successfully!',
  };
}
