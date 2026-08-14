import { describe, it, expect } from 'vitest';
import {
  getAllReviews,
  getApprovedFeaturedReviews,
  submitPublicReview,
  updateReviewStatus,
  moderateReviewContent,
} from '../lib/reviews-store';

describe('Admin Reviews & Spam Moderation Unit Tests', () => {
  it('loads initial reviews', async () => {
    const reviews = await getAllReviews();
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0]).toHaveProperty('review');
    expect(reviews[0]).toHaveProperty('rating');
  });

  it('filters approved featured reviews for homepage', async () => {
    const featured = await getApprovedFeaturedReviews();
    expect(featured.length).toBeGreaterThan(0);
    featured.forEach((r) => {
      expect(r.status).toBe('approved');
      expect(r.featured).toBe(true);
      expect(r.rating).toBeGreaterThanOrEqual(4);
    });
  });

  it('detects spam content deterministically', () => {
    const spamHoneypot = moderateReviewContent({
      name: 'Bot',
      email: 'bot@spam.com',
      review: 'Valid length review string here...',
      honeypot: 'filled_by_bot',
    });
    expect(spamHoneypot.isSpam).toBe(true);

    const spamInvalidEmail = moderateReviewContent({
      name: 'User',
      email: 'not-an-email',
      review: 'Valid length review string here...',
    });
    expect(spamInvalidEmail.isSpam).toBe(true);

    const spamKeyword = moderateReviewContent({
      name: 'User',
      email: 'user@test.com',
      review: 'Check out buy crypto now for fast profits!',
    });
    expect(spamKeyword.isSpam).toBe(true);

    const clean = moderateReviewContent({
      name: 'Ali Khan',
      email: 'ali@enterprise.com',
      review: 'E&E delivered our rooftop solar project efficiently with high quality panels.',
    });
    expect(clean.isSpam).toBe(false);
  });

  it('submits a public review and assigns initial status', async () => {
    const result = await submitPublicReview({
      name: 'Test Reviewer',
      email: 'reviewer@test.com',
      service: '50KW Commercial Solar',
      rating: 5,
      review: 'Great EPC execution and technical support from E&E team.',
      consent: true,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
  });

  it('enforces non-approved reviews cannot be featured rule', async () => {
    const reviews = await getAllReviews();
    const target = reviews[0];

    // Try to feature a hidden review
    const updated = await updateReviewStatus(target.id, 'hidden', true);
    expect(updated?.status).toBe('hidden');
    expect(updated?.featured).toBe(false); // Forced to false
  });
});
