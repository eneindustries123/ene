import { getSupabaseAdminClient, isSupabaseConfigured } from '../lib/supabase/admin';
import { getSupabaseAnonClient } from '../lib/supabase/client';

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
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

function mapReviewRow(row: any): Review {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    company: row.company || undefined,
    role: row.role || undefined,
    service: row.service,
    rating: Number(row.rating),
    review: row.review,
    status: (row.status as Review['status']) || 'pending',
    featured: Boolean(row.featured),
    consent: Boolean(row.consent),
    approvedAt: row.approved_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ReviewsService {
  static async getAllReviews(): Promise<Review[]> {
    const adminClient = getSupabaseAdminClient();
    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data, error } = await adminClient
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapReviewRow);
        }
      } catch (err) {
        console.warn('ReviewsService.getAllReviews error, falling back:', err);
      }
    }
    return [...inMemoryReviews];
  }

  static async getApprovedFeaturedReviews(): Promise<Review[]> {
    const supabase = getSupabaseAnonClient() || getSupabaseAdminClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('status', 'approved')
          .eq('featured', true)
          .gte('rating', 4)
          .order('created_at', { ascending: false })
          .limit(4);

        if (!error && data && data.length > 0) {
          return data.map(mapReviewRow);
        }
      } catch (err) {
        console.warn('ReviewsService.getApprovedFeaturedReviews error, falling back:', err);
      }
    }

    const all = await this.getAllReviews();
    return all.filter((r) => r.status === 'approved' && r.featured && r.rating >= 4).slice(0, 4);
  }

  static async getReviewById(id: string): Promise<Review | null> {
    const adminClient = getSupabaseAdminClient();
    if (adminClient && isSupabaseConfigured() && isValidUuid(id)) {
      try {
        const { data, error } = await adminClient
          .from('reviews')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return mapReviewRow(data);
        }
      } catch (err) {
        console.warn('ReviewsService.getReviewById error, falling back:', err);
      }
    }

    const all = await this.getAllReviews();
    return all.find((r) => r.id === id) || null;
  }

  static moderateReviewContent(input: {
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

  static async submitPublicReview(data: {
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
    const moderation = this.moderateReviewContent(data);
    const initialStatus: Review['status'] = moderation.isSpam ? 'rejected' : 'pending';

    const adminClient = getSupabaseAdminClient();
    const now = new Date().toISOString();

    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data: inserted, error } = await adminClient
          .from('reviews')
          .insert({
            name: data.name.trim(),
            email: data.email.trim(),
            company: data.company?.trim() || null,
            role: data.role?.trim() || null,
            service: data.service.trim(),
            rating: Math.max(1, Math.min(5, data.rating)),
            review: data.review.trim(),
            status: initialStatus,
            featured: false,
            consent: data.consent,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (!error && inserted) {
          const createdReview = mapReviewRow(inserted);
          inMemoryReviews.unshift(createdReview);

          const message =
            initialStatus === 'pending'
              ? 'Thank you for your feedback! Your review has been submitted for moderation.'
              : 'Your review submission was received.';

          return { success: true, reviewId: createdReview.id, status: initialStatus, message };
        } else if (error) {
          console.warn('Supabase submitPublicReview warning (falling back to in-memory):', error.message);
        }
      } catch (err: any) {
        console.warn('Failed to insert review into Supabase, falling back:', err.message);
      }
    }

    const fallbackId = `rev-${Date.now()}`;
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

    const message =
      initialStatus === 'pending'
        ? 'Thank you for your feedback! Your review has been submitted for moderation.'
        : 'Your review submission was received.';

    return { success: true, reviewId: fallbackId, status: initialStatus, message };
  }

  static async updateReviewStatus(
    id: string,
    newStatus: Review['status'],
    isFeatured?: boolean
  ): Promise<Review | null> {
    const existing = await this.getReviewById(id);
    if (!existing) return null;

    let finalFeatured = isFeatured !== undefined ? isFeatured : existing.featured;
    if (newStatus !== 'approved') {
      finalFeatured = false;
    }

    const now = new Date().toISOString();
    const approvedAtValue = newStatus === 'approved' ? existing.approvedAt || now : null;
    const adminClient = getSupabaseAdminClient();

    if (adminClient && isSupabaseConfigured() && isValidUuid(id)) {
      try {
        const { data, error } = await adminClient
          .from('reviews')
          .update({
            status: newStatus,
            featured: finalFeatured,
            approved_at: approvedAtValue,
            updated_at: now,
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const updated = mapReviewRow(data);
          const memIdx = inMemoryReviews.findIndex((r) => r.id === id);
          if (memIdx !== -1) inMemoryReviews[memIdx] = updated;
          else inMemoryReviews.unshift(updated);
          return updated;
        }
      } catch (err: any) {
        console.warn('Failed to update review status in Supabase, falling back:', err.message);
      }
    }

    const updated: Review = {
      ...existing,
      status: newStatus,
      featured: finalFeatured,
      approvedAt: newStatus === 'approved' ? existing.approvedAt || now : undefined,
      updatedAt: now,
    };

    const memIdx = inMemoryReviews.findIndex((r) => r.id === id);
    if (memIdx !== -1) inMemoryReviews[memIdx] = updated;
    else inMemoryReviews.unshift(updated);

    return updated;
  }

  static async deleteReview(id: string): Promise<boolean> {
    const adminClient = getSupabaseAdminClient();

    if (adminClient && isSupabaseConfigured() && isValidUuid(id)) {
      try {
        const { error } = await adminClient.from('reviews').delete().eq('id', id);
        if (error) {
          console.warn('Supabase deleteReview warning (falling back to in-memory):', error.message);
        }
      } catch (err: any) {
        console.warn('Failed to delete review from Supabase, falling back:', err.message);
      }
    }

    inMemoryReviews = inMemoryReviews.filter((r) => r.id !== id);
    return true;
  }
}
