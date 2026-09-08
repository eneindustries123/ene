'use server';

import { z } from 'zod';
import { apiFetchWithTimeout, getApiUrl } from '../../lib/api-client';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const contactFormSchema = z.object({
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

  return {
    success: true,
    message: 'Thank you for subscribing! Check your inbox for confirmation.',
  };
}

export async function submitContactForm(formData: Record<string, any>) {
  const result = contactFormSchema.safeParse(formData);
  if (!result.success) {
    const errorMap = result.error.flatten().fieldErrors;
    const firstErrorMessage =
      Object.values(errorMap).flat()[0] || 'Please check the required fields.';
    return { success: false, message: firstErrorMessage, errors: errorMap };
  }

  try {
    const res = await apiFetchWithTimeout(
      getApiUrl('/api/enquiries'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      },
      10000
    );

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return {
        success: true,
        message:
          data.message ||
          'Your inquiry has been successfully sent. Our engineering team will get back to you within 24 hours.',
      };
    }

    let errorMessage = data.error || 'Unable to submit your enquiry right now. Please try again.';
    if (data.details && typeof data.details === 'object') {
      const firstDetail = Object.values(data.details).flat()[0];
      if (typeof firstDetail === 'string') {
        errorMessage = firstDetail;
      }
    }

    return {
      success: false,
      message: errorMessage,
      errors: data.details,
    };
  } catch (err: any) {
    console.error('Failed to submit contact enquiry to backend API:', err);
    return {
      success: false,
      message: 'Unable to submit your enquiry right now. Please try again.',
    };
  }
}

export async function submitQuoteRequest(formData: Record<string, any>) {
  const result = quoteRequestSchema.safeParse(formData);
  if (!result.success) {
    const errorMap = result.error.flatten().fieldErrors;
    const firstErrorMessage =
      Object.values(errorMap).flat()[0] || 'Invalid quote request input.';
    return { success: false, message: firstErrorMessage, errors: errorMap };
  }

  try {
    const res = await apiFetchWithTimeout(
      getApiUrl('/api/quote-requests'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      },
      10000
    );

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return {
        success: true,
        message: data.message || 'Quote request submitted successfully!',
      };
    }

    return {
      success: false,
      message:
        data.error || `Failed to submit quote request (Status ${res.status}).`,
    };
  } catch (err: any) {
    console.error('Failed to submit quote request to backend API:', err);
    return {
      success: false,
      message:
        err?.message ||
        'Network error while submitting quote request. Please try again.',
    };
  }
}
