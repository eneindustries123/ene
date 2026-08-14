import { createServerSupabaseClient } from './supabase/server';

export interface Review {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  service: string;
  rating: number; // 1-5
  review: string;
  status: 'pending' | 'approved' | 'hidden' | 'rejected';
  featured: boolean;
  consent: boolean;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Initial seed reviews based on B2B testimonials
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

export async function getAllReviews(): Promise<Review[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        company: row.company || undefined,
        role: row.role || undefined,
        service: row.service,
        rating: row.rating,
        review: row.review,
        status: row.status as Review['status'],
        featured: row.featured,
        consent: row.consent,
        approvedAt: row.approved_at || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  } catch {
    // Fall back to in-memory store
  }

  return [...inMemoryReviews];
}

export async function getApprovedFeaturedReviews(): Promise<Review[]> {
  const all = await getAllReviews();
  return all
    .filter((r) => r.status === 'approved' && r.featured && r.rating >= 4)
    .slice(0, 4);
}

export async function getReviewById(id: string): Promise<Review | null> {
  const all = await getAllReviews();
  return all.find((r) => r.id === id) || null;
}

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

  // Check character repetition spam
  if (/(.)\1{6,}/.test(input.review)) {
    return { isSpam: true, reason: 'Repeated character pattern detected' };
  }

  // Common spam keyword phrases
  const spamKeywords = ['buy crypto', 'casino online', 'viagra', 'payday loan', 'fast cash'];
  const lowerReview = input.review.toLowerCase();
  for (const keyword of spamKeywords) {
    if (lowerReview.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  return { isSpam: false };
}

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
  const moderation = moderateReviewContent(data);
  const initialStatus: Review['status'] = moderation.isSpam ? 'rejected' : 'pending';

  const newId = `rev-${Date.now()}`;
  const now = new Date().toISOString();

  const newReview: Review = {
    id: newId,
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

  try {
    const supabase = createServerSupabaseClient();
    await supabase.from('reviews').insert({
      name: newReview.name,
      email: newReview.email,
      company: newReview.company,
      role: newReview.role,
      service: newReview.service,
      rating: newReview.rating,
      review: newReview.review,
      status: newReview.status,
      featured: newReview.featured,
      consent: newReview.consent,
      created_at: newReview.createdAt,
      updated_at: newReview.updatedAt,
    });
  } catch {
    // Fall back to in-memory
  }

  inMemoryReviews.unshift(newReview);

  const message = initialStatus === 'pending'
    ? 'Thank you for your feedback! Your review has been submitted for moderation.'
    : 'Your review submission was received.';

  return { success: true, reviewId: newId, status: initialStatus, message };
}

export async function updateReviewStatus(
  id: string,
  newStatus: Review['status'],
  isFeatured?: boolean
): Promise<Review | null> {
  const all = await getAllReviews();
  const existing = all.find((r) => r.id === id);
  if (!existing) return null;

  // Rule: Non-approved reviews CANNOT be featured
  let finalFeatured = isFeatured !== undefined ? isFeatured : existing.featured;
  if (newStatus !== 'approved') {
    finalFeatured = false;
  }

  const now = new Date().toISOString();
  const updated: Review = {
    ...existing,
    status: newStatus,
    featured: finalFeatured,
    approvedAt: newStatus === 'approved' ? (existing.approvedAt || now) : undefined,
    updatedAt: now,
  };

  try {
    const supabase = createServerSupabaseClient();
    await supabase
      .from('reviews')
      .update({
        status: updated.status,
        featured: updated.featured,
        approved_at: updated.approvedAt,
        updated_at: updated.updatedAt,
      })
      .eq('id', id);
  } catch {
    // Fall back to in-memory
  }

  const memIdx = inMemoryReviews.findIndex((r) => r.id === id);
  if (memIdx !== -1) {
    inMemoryReviews[memIdx] = updated;
  } else {
    inMemoryReviews.unshift(updated);
  }

  return updated;
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.from('reviews').delete().eq('id', id);
  } catch {
    // Fall back to in-memory
  }

  inMemoryReviews = inMemoryReviews.filter((r) => r.id !== id);
  return true;
}
