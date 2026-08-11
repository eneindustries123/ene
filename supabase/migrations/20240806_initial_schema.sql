-- Solix Database Migration Schema (PostgreSQL for Supabase)

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Plans
CREATE TABLE IF NOT EXISTS public.maintenance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  price_monthly NUMERIC(10, 2),
  features TEXT[] NOT NULL DEFAULT '{}',
  recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity TEXT NOT NULL,
  category TEXT NOT NULL,
  completion_year INTEGER NOT NULL,
  summary TEXT NOT NULL,
  full_story TEXT NOT NULL,
  main_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  company TEXT,
  avatar_url TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners Table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL,
  linkedin_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuing_body TEXT NOT NULL,
  badge_url TEXT NOT NULL,
  issue_year INTEGER NOT NULL
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  order_index INTEGER DEFAULT 0
);

-- Enquiries Table (Leads)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'resolved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Requests Table
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  country TEXT NOT NULL,
  solution_type TEXT NOT NULL, -- 'solar', 'wind', 'hybrid', 'maintenance'
  project_type TEXT NOT NULL, -- 'commercial', 'industrial', 'residential', 'utility'
  estimated_capacity TEXT,
  estimated_budget TEXT,
  timeline TEXT,
  message TEXT,
  attachment_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Redirects Table
CREATE TABLE IF NOT EXISTS public.redirects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_path TEXT UNIQUE NOT NULL,
  target_path TEXT NOT NULL,
  status_code INTEGER DEFAULT 301,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read published products" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read faqs" ON public.faqs FOR SELECT USING (true);

-- Public Insert Policies for Form Submissions
CREATE POLICY "Allow public submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public submit quote request" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public newsletter subscription" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies (Service Role / Auth User)
CREATE POLICY "Allow admin full access on products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on enquiries" ON public.enquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on quotes" ON public.quote_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on subscribers" ON public.newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on audit_logs" ON public.audit_logs FOR ALL USING (auth.role() = 'authenticated');
