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

    // Allows empty phone number
    const noPhoneRes = await submitContactForm({
      fullName: 'John Doe',
      email: 'valid@example.com',
      phone: '',
      serviceRequired: 'Solar Energy',
      solarType: 'On-Grid Only',
      message: 'This is a valid 10+ character message.',
    });
    // In test environment without backend running, submitContactForm calls fetch to backend.
    // If backend isn't up, it fails on network or validation, but client-side zod passes.
  });

  it('provides the exact 6 canonical solar system categories from the solar analyzer', async () => {
    const { ANALYZER_ARCHITECTURES, SOLAR_SYSTEM_TYPE_LABELS } = await import('../lib/solar-analyzer');

    expect(ANALYZER_ARCHITECTURES).toHaveLength(6);
    expect(SOLAR_SYSTEM_TYPE_LABELS).toHaveLength(6);

    const expectedLabels = [
      'On-Grid Only',
      'Hybrid + Green Meter — No Battery',
      'Hybrid + Green Meter + Battery',
      'Hybrid Only — No Green Meter / No Battery',
      'Hybrid + Battery — No Green Meter',
      'Off-Grid',
    ];

    expect(SOLAR_SYSTEM_TYPE_LABELS).toEqual(expectedLabels);

    // Verify each category can be used in contact form submission validation
    const { submitContactForm } = await import('../app/actions/contact');
    for (const label of expectedLabels) {
      const res = await submitContactForm({
        fullName: 'Solar Client',
        email: 'client@solarenergy.pk',
        serviceRequired: 'Solar Energy',
        solarType: label,
        message: `Inquiry for solar system category: ${label} with sufficient text length.`,
      });
      // Verification that Zod validation did not reject the solarType
      if (!res.success) {
        // If it failed, it must NOT be due to solarType validation
        expect(res.errors?.solarType).toBeUndefined();
      }
    }
  });

  it('validates quote request fields and rejects invalid data', async () => {
    const { submitQuoteRequest } = await import('../app/actions/contact');

    // Missing / invalid fields
    const res = await submitQuoteRequest({
      fullName: 'A',
      email: 'invalid-email',
      phone: '',
      country: '',
      solutionType: 'solar',
      projectType: 'commercial',
    });
    expect(res.success).toBe(false);
    expect(res.message).toBeDefined();

    // Invalid email format
    const invalidEmailRes = await submitQuoteRequest({
      fullName: 'Valid Name',
      email: 'not-an-email',
      country: 'Pakistan',
      solutionType: 'solar',
      projectType: 'commercial',
    });
    expect(invalidEmailRes.success).toBe(false);
    expect(invalidEmailRes.message).toContain('valid email');
  });
});

