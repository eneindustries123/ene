import { getSupabaseAdminClient, isSupabaseConfigured } from '../lib/supabase/admin';

export interface ContactEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  serviceRequired: string;
  monthlyBill?: string;
  solarType?: string;
  subject?: string;
  message: string;
  createdAt: string;
}

let inMemoryEnquiries: ContactEnquiry[] = [];

export class EnquiriesService {
  static async submitEnquiry(data: {
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    address?: string;
    serviceRequired: string;
    monthlyBill?: string;
    solarType?: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; message: string; id: string }> {
    const adminClient = getSupabaseAdminClient();
    const now = new Date().toISOString();

    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data: inserted, error } = await adminClient
          .from('enquiries')
          .insert({
            full_name: data.fullName,
            email: data.email,
            phone: data.phone || null,
            city: data.city || null,
            address: data.address || null,
            service_required: data.serviceRequired,
            monthly_bill: data.monthlyBill || null,
            solar_type: data.solarType || null,
            subject: data.subject || `Enquiry for ${data.serviceRequired}`,
            message: data.message,
            created_at: now,
          })
          .select()
          .single();

        if (!error && inserted) {
          return {
            success: true,
            id: inserted.id,
            message:
              'Your enquiry has been successfully sent. Our engineering team will get back to you within 24 hours.',
          };
        }
      } catch (err) {
        console.error('Failed to insert enquiry into Supabase:', err);
      }
    }

    const fallbackId = `enq-${Date.now()}`;
    inMemoryEnquiries.unshift({
      id: fallbackId,
      ...data,
      createdAt: now,
    });

    return {
      success: true,
      id: fallbackId,
      message:
        'Your enquiry has been successfully sent. Our engineering team will get back to you within 24 hours.',
    };
  }

  static async getAllEnquiries(): Promise<ContactEnquiry[]> {
    const adminClient = getSupabaseAdminClient();
    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data, error } = await adminClient
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((row: any) => ({
            id: row.id,
            fullName: row.full_name,
            email: row.email,
            phone: row.phone,
            city: row.city,
            address: row.address,
            serviceRequired: row.service_required,
            monthlyBill: row.monthly_bill,
            solarType: row.solar_type,
            subject: row.subject,
            message: row.message,
            createdAt: row.created_at,
          }));
        }
      } catch (err) {
        console.error('Failed to get enquiries from Supabase:', err);
      }
    }

    return [...inMemoryEnquiries];
  }
}
