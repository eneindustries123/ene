-- Migration: Projects and Reviews Management Schema
-- Description: Adds status fields, reviews table, and admin security constraints

-- 1. Ensure Projects table exists and support status field ('published', 'draft', 'archived')
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
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'projects' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN status TEXT DEFAULT 'published';
  END IF;
END $$;

-- 2. Create Reviews Table for Customer Reviews & Moderation Workflow
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  service TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'hidden', 'rejected'
  featured BOOLEAN NOT NULL DEFAULT false,
  consent BOOLEAN NOT NULL DEFAULT true,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint trigger / index for fast queries
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON public.reviews(featured);

-- 3. Row Level Security Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Only published projects and approved reviews)
DROP POLICY IF EXISTS "Allow public read published projects" ON public.projects;
CREATE POLICY "Allow public read published projects" ON public.projects 
  FOR SELECT USING (status = 'published' OR status IS NULL);

DROP POLICY IF EXISTS "Allow public read approved reviews" ON public.reviews;
CREATE POLICY "Allow public read approved reviews" ON public.reviews 
  FOR SELECT USING (status = 'approved');

-- Public Insert Policy for Reviews
DROP POLICY IF EXISTS "Allow public submit reviews" ON public.reviews;
CREATE POLICY "Allow public submit reviews" ON public.reviews 
  FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies
DROP POLICY IF EXISTS "Allow admin full access on projects" ON public.projects;
CREATE POLICY "Allow admin full access on projects" ON public.projects 
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin full access on reviews" ON public.reviews;
CREATE POLICY "Allow admin full access on reviews" ON public.reviews 
  FOR ALL USING (auth.role() = 'authenticated');
