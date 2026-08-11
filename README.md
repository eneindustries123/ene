# Solix — Renewable Energy Platform & Admin Dashboard

Solix is an enterprise-grade renewable energy corporate website and administration platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Supabase, Sanity CMS, and Belmo.io hosting deployment architecture.

![Solix Homepage](01-homepage-complete.png)

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3, Custom Design System Tokens, Manrope Typography
- **Animations**: Framer Motion entrance reveals, counter metrics, SVG paths
- **Database & Storage**: Supabase PostgreSQL with RLS, Supabase Storage
- **Blog CMS**: Sanity Studio embedded at `/admin/studio` with GROQ queries
- **Hosting & Backend Services**: Belmo.io deployment, background workers, scheduled jobs
- **Validation & Forms**: React Hook Form, Zod, Next.js Server Actions

---

## Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Database Setup
Apply the PostgreSQL migration script located at `supabase/migrations/20240806_initial_schema.sql` into your Supabase project.

### 5. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Route Overview

### Public Website
- `/` — Homepage (Pixel-accurate reconstruction of all 9 sections)
- `/products` & `/products/[slug]` — Hardware & Solutions Catalog
- `/maintenance` — Asset Telemetry & Maintenance Plans
- `/projects` & `/projects/[slug]` — Utility & Industrial Portfolio
- `/about` — Corporate Footprint & Leadership
- `/blog` & `/blog/[slug]` — Sanity-driven Industry Insights
- `/contact` — Headquarters Contact Form
- `/request-a-quote` — Multi-step Engineering Estimator Wizard
- `/thank-you` — Submission Confirmation
- `/privacy-policy` & `/terms-and-conditions` — Legal Compliance
- Custom `404` — Branded Not Found Page

### Administration Dashboard
- `/admin/login` — Staff Authentication
- `/admin` — Executive KPI Dashboard
- `/admin/products` — Products CMS Manager
- `/admin/projects` — Case Studies CMS Manager
- `/admin/quotes` — Lead & Quote Request Management
- `/admin/settings` — Global Configuration

---

## Testing & Quality Assurance

```bash
# Type Checking
npm run type-check

# Unit Tests
npm run test

# Production Build Validation
npm run build
```
