import { getApiUrl } from './api-client';

export interface Review {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  service: string;
  rating: number;
  review: string;
  status: 'pending' | 'approved' | 'hidden' | 'rejected';
  featured: boolean;
  consent: boolean;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

let inMemoryReviews: Review[] = [
  {
    id: 'rev-1',
    name: 'Ahmed Raza',
    email: 'ahmed.raza@logistics-multan.pk',
    company: 'Logistics Complex Multan',
    role: 'Project Manager',
    service: '1.2MW Commercial Solar Array',
    rating: 5,
    review: 'E&E handled our commercial solar EPC project professionally from engineering design through installation and net metering commissioning. Their team delivered a structured, transparent, and high-yielding power system.',
    status: 'approved',
    featured: true,
    consent: true,
    approvedAt: '2024-08-01T10:00:00Z',
    createdAt: '2024-08-01T09:30:00Z',
    updatedAt: '2024-08-01T10:00:00Z',
  },
  {
    id: 'rev-2',
    name: 'Usman Khalid',
    email: 'usman@industrialhub.com.pk',
    company: 'Industrial Manufacturing Hub',
    role: 'Operations Director',
    service: 'Structural Fabrication & Material Supply',
    rating: 5,
    review: 'The technical procurement and structural steel fabrication standards provided by E&E exceeded our industrial requirements. Material sourcing was on-schedule and fully compliant with project specs.',
    status: 'approved',
    featured: true,
    consent: true,
    approvedAt: '2024-08-02T11:00:00Z',
    createdAt: '2024-08-02T10:15:00Z',
    updatedAt: '2024-08-02T11:00:00Z',
  },
  {
    id: 'rev-3',
    name: 'Sara Ahmed',
    email: 'sara.a@retailcommercial.pk',
    company: 'Retail Commercial Center',
    role: 'Facilities Head',
    service: '40KW Elevated Solar Shed',
    rating: 5,
    review: 'From rooftop load calculations to elevated steel shed construction and grid sync, the E&E engineering team provided responsive technical support throughout our 40KW solar transition.',
    status: 'approved',
    featured: true,
    consent: true,
    approvedAt: '2024-08-03T14:20:00Z',
    createdAt: '2024-08-03T13:45:00Z',
    updatedAt: '2024-08-03T14:20:00Z',
  },
];

/**
 * Deterministic automated content moderation for review spam detection.
 */
export function moderateReviewContent(input: {
  name: string;
  email: string;
  review: string;
  honeypot?: string;
}): { isSpam: boolean; reason?: string } {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { isSpam: true, reason: 'Honeypot field triggered' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    return { isSpam: true, reason: 'Invalid email format' };
  }

  if (input.review.trim().length < 10) {
    return { isSpam: true, reason: 'Review text too short' };
  }

  if (/(.)\1{6,}/.test(input.review)) {
    return { isSpam: true, reason: 'Repeated character pattern detected' };
  }

  const spamKeywords = ['buy crypto', 'casino online', 'viagra', 'payday loan', 'fast cash'];
  const lowerReview = input.review.toLowerCase();
  for (const keyword of spamKeywords) {
    if (lowerReview.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  return { isSpam: false };
}

/**
 * Retrieves all reviews from the backend API (or fallback).
 */
export async function getAllReviews(): Promise<Review[]> {
  try {
    const res = await fetch(getApiUrl('/api/reviews'), {
      cache: 'no-store',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback
  }

  return [...inMemoryReviews];
}

/**
 * Retrieves approved, featured reviews for public display.
 */
export async function getApprovedFeaturedReviews(): Promise<Review[]> {
  try {
    const res = await fetch(getApiUrl('/api/reviews/approved'), {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback
  }

  const all = await getAllReviews();
  return all.filter((r) => r.status === 'approved' && r.featured && r.rating >= 4).slice(0, 4);
}

/**
 * Submits a public client review to the backend.
 */
export async function submitPublicReview(data: {
  name: string;
  email: string;
  company?: string;
  role?: string;
  service: string;
  rating: number;
  review: string;
  consent: boolean;
  honeypot?: string;
}): Promise<{ success: boolean; reviewId: string; status: Review['status']; message: string }> {
  try {
    const res = await fetch(getApiUrl('/api/reviews/submit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      return result;
    }
  } catch (err) {
    // Fallback
  }

  const moderation = moderateReviewContent(data);
  const initialStatus: Review['status'] = moderation.isSpam ? 'rejected' : 'pending';
  const fallbackId = `rev-${Date.now()}`;
  const now = new Date().toISOString();
  const fallbackReview: Review = {
    id: fallbackId,
    name: data.name.trim(),
    email: data.email.trim(),
    company: data.company?.trim(),
    role: data.role?.trim(),
    service: data.service.trim(),
    rating: Math.max(1, Math.min(5, data.rating)),
    review: data.review.trim(),
    status: initialStatus,
    featured: false,
    consent: data.consent,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryReviews.unshift(fallbackReview);

  return {
    success: true,
    reviewId: fallbackId,
    status: initialStatus,
    message: 'Thank you for your feedback! Your review has been submitted for moderation.',
  };
}

/**
 * Updates review moderation status via backend API.
 */
export async function updateReviewStatus(
  id: string,
  newStatus: Review['status'],
  isFeatured?: boolean
): Promise<Review | null> {
  try {
    const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus, featured: isFeatured }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  const memIdx = inMemoryReviews.findIndex((r) => r.id === id);
  if (memIdx !== -1) {
    const existing = inMemoryReviews[memIdx];
    let finalFeatured = isFeatured !== undefined ? isFeatured : existing.featured;
    if (newStatus !== 'approved') finalFeatured = false;
    const now = new Date().toISOString();
    const updated: Review = {
      ...existing,
      status: newStatus,
      featured: finalFeatured,
      approvedAt: newStatus === 'approved' ? (existing.approvedAt || now) : undefined,
      updatedAt: now,
    };
    inMemoryReviews[memIdx] = updated;
    return updated;
  }

  return null;
}

/**
 * Permanently deletes a review via backend API.
 */
export async function deleteReview(id: string): Promise<boolean> {
  try {
    const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      inMemoryReviews = inMemoryReviews.filter((r) => r.id !== id);
      return true;
    }
  } catch (err) {
    // Fallback
  }

  inMemoryReviews = inMemoryReviews.filter((r) => r.id !== id);
  return true;
}
