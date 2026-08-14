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
});

