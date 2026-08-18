import { getSupabaseAdminClient, isSupabaseConfigured } from '../lib/supabase/admin';

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  solutionType: string;
  projectType: string;
  estimatedCapacity?: string;
  estimatedBudget?: string;
  timeline?: string;
  message?: string;
  status: string;
  createdAt: string;
}

let inMemoryQuotes: QuoteRequest[] = [];

export class QuotesService {
  static async submitQuoteRequest(data: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    country: string;
    solutionType: string;
    projectType: string;
    estimatedCapacity?: string;
    estimatedBudget?: string;
    timeline?: string;
    message?: string;
  }): Promise<{ success: boolean; message: string; id: string }> {
    const adminClient = getSupabaseAdminClient();
    const now = new Date().toISOString();

    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data: inserted, error } = await adminClient
          .from('quote_requests')
          .insert({
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            company: data.company || null,
            country: data.country,
            solution_type: data.solutionType,
            project_type: data.projectType,
            estimated_capacity: data.estimatedCapacity || null,
            estimated_budget: data.estimatedBudget || null,
            timeline: data.timeline || null,
            message: data.message || null,
            status: 'pending',
            created_at: now,
          })
          .select()
          .single();

        if (!error && inserted) {
          return {
            success: true,
            id: inserted.id,
            message: 'Quote request submitted successfully!',
          };
        }
      } catch (err) {
        console.error('Failed to insert quote request into Supabase:', err);
      }
    }

    const fallbackId = `quote-${Date.now()}`;
    inMemoryQuotes.unshift({
      id: fallbackId,
      ...data,
      status: 'pending',
      createdAt: now,
    });

    return {
      success: true,
      id: fallbackId,
      message: 'Quote request submitted successfully!',
    };
  }

  static async getAllQuotes(): Promise<QuoteRequest[]> {
    const adminClient = getSupabaseAdminClient();
    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data, error } = await adminClient
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((row: any) => ({
            id: row.id,
            fullName: row.full_name,
            email: row.email,
            phone: row.phone,
            company: row.company,
            country: row.country,
            solutionType: row.solution_type,
            projectType: row.project_type,
            estimatedCapacity: row.estimated_capacity,
            estimatedBudget: row.estimated_budget,
            timeline: row.timeline,
            message: row.message,
            status: row.status,
            createdAt: row.created_at,
          }));
        }
      } catch (err) {
        console.error('Failed to get quotes from Supabase:', err);
      }
    }

    return [...inMemoryQuotes];
  }
}
