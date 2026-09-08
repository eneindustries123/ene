import { describe, it, expect } from 'vitest';
import { subscribeNewsletter } from '../app/actions/contact';
import { formatCurrency, formatDate } from '../lib/utils';

describe('Solix Unit Tests', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(6000000)).toBe('$6,000,000');
  });

  it('formats dates correctly', () => {
    const formatted = formatDate('2024-08-05');
    expect(formatted).toContain('August');
    expect(formatted).toContain('2024');
  });

  it('handles invalid email newsletter subscription', async () => {
    const invalidRes = await subscribeNewsletter('invalid-email');
    expect(invalidRes.success).toBe(false);
  });

  it('handles valid email newsletter subscription', async () => {
    const validRes = await subscribeNewsletter('investor@cleanenergy.com');
    expect(validRes.success).toBe(true);
  });

  it('validates contact form fields and rejects invalid data', async () => {
    const { submitContactForm } = await import('../app/actions/contact');

    // Missing full name
    const missingNameRes = await submitContactForm({
      fullName: '',
      email: 'valid@example.com',
      serviceRequired: 'Solar Energy',
      message: 'This is a valid 10+ character message.',
    });
    expect(missingNameRes.success).toBe(false);
    expect(missingNameRes.message).toContain('Full name');

    // Missing email
    const missingEmailRes = await submitContactForm({
      fullName: 'John Doe',
      email: '',
      serviceRequired: 'Solar Energy',
      message: 'This is a valid 10+ character message.',
    });
    expect(missingEmailRes.success).toBe(false);
    expect(missingEmailRes.message).toContain('Email address');

    // Invalid email
    const invalidEmailRes = await submitContactForm({
      fullName: 'John Doe',
      email: 'not-an-email',
      serviceRequired: 'Solar Energy',
      message: 'This is a valid 10+ character message.',
    });
    expect(invalidEmailRes.success).toBe(false);
    expect(invalidEmailRes.message).toContain('valid email');

    // Missing service
    const missingServiceRes = await submitContactForm({
      fullName: 'John Doe',
      email: 'valid@example.com',
      serviceRequired: '',
      message: 'This is a valid 10+ character message.',
    });
    expect(missingServiceRes.success).toBe(false);
    expect(missingServiceRes.message).toContain('select a service');

    // Missing / too short message
    const shortMessageRes = await submitContactForm({
      fullName: 'John Doe',
      email: 'valid@example.com',
      serviceRequired: 'Solar Energy',
      message: 'Short',
    });
    expect(shortMessageRes.success).toBe(false);
    expect(shortMessageRes.message).toContain('10 characters');
  });

  it('validates quote request fields and rejects invalid data', async () => {
    const { submitQuoteRequest } = await import('../app/actions/contact');
    const res = await submitQuoteRequest({
      fullName: 'A',
      email: 'invalid-email',
      phone: '123',
    });
    expect(res.success).toBe(false);
    expect(res.message).toBeDefined();
  });
});

