# E&E Industries — Renewable Energy, EPC & Industrial Services Platform

E&E Industries is an enterprise-grade renewable energy and industrial engineering platform built with a decoupled architecture featuring a **Next.js 14 Frontend** and a **Standalone Express + TypeScript Backend API**.

---

## 🏗️ Architecture & Target Directory Structure

```text
/
├── frontend/                     # Next.js 14 Frontend & Admin Portal
│   ├── app/                      # Next.js App Router (Public pages & Admin UI)
│   ├── components/               # UI components, layout, hero, modals
│   ├── public/                   # Static assets, hero backgrounds, logos
│   ├── lib/                      # Client utilities, api-client, data stores
│   ├── styles/                   # Global CSS & Tailwind stylesheets
│   ├── package.json              # Frontend dependencies (Next, React, Tailwind, Framer)
│   ├── tsconfig.json             # TypeScript configuration for Frontend
│   ├── next.config.mjs           # Next.js configuration
│   └── .env.local                # Frontend environment variables
│
├── backend/                      # Standalone Node.js + Express REST API
│   ├── src/
│   │   ├── routes/               # Express route definitions
│   │   ├── controllers/          # Request handlers & response formatting
│   │   ├── services/             # Business logic & data access
│   │   ├── middleware/           # Auth (HMAC session), rate limit, error handler
│   │   ├── validators/           # Zod schema validation
│   │   ├── lib/
│   │   │   └── supabase/         # Supabase Admin & Anon client initialization
│   │   └── server.ts             # Express application entrypoint
│   ├── tests/                    # Vitest backend integration test suite
│   ├── package.json              # Backend dependencies (Express, Zod, Supabase, CORS)
│   ├── tsconfig.json             # TypeScript configuration for Backend
│   └── .env                      # Backend environment variables (Secrets)
│
├── supabase/
│   └── migrations/               # PostgreSQL schema & security migrations
├── package.json                  # Root monorepo workspace scripts
└── README.md
```

---

## 🔒 Security Architecture

- **Zero Privileged Key Exposure**: `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `AUTH_SECRET` are kept strictly in `backend/.env`. They are never imported or bundled in client-side code.
- **Frontend Isolation**: `frontend/.env.local` only receives public variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Authentication**: Admin session uses signed HMAC-SHA256 tokens in HTTP-only cookies with CSRF/CORS protections.
- **Rate Limiting & Anti-Spam**: Public form endpoints (`/api/enquiries`, `/api/quote-requests`, `/api/reviews/submit`) and login (`/api/auth/login`) are protected with IP-based rate limiting, honeypot fields, and automated spam heuristics.

---

## 🚀 Getting Started

### 1. Environment Setup

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=https://xnvxmolqsxizrfjysnnk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

ADMIN_EMAIL=sales@eneindustries.com
ADMIN_PASSWORD=YourSecurePassword
AUTH_SECRET=your_hmac_secret_key_minimum_32_characters
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://xnvxmolqsxizrfjysnnk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

### 2. Development

You can run both applications concurrently or independently from the project root:

```bash
# Run Backend (Express API on http://localhost:5000)
npm run dev:backend

# Run Frontend (Next.js Website & Admin on http://localhost:3000)
npm run dev:frontend
```

---

### 3. Testing & Verification

```bash
# Run all tests (Backend & Frontend)
npm run test

# Run backend test suite only
npm run test:backend

# Run frontend test suite only
npm run test:frontend

# Run TypeScript type-checking across both apps
npm run type-check

# Production build for both applications
npm run build
```

---

## 📡 Standalone Backend API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Backend health check |
| `POST` | `/api/auth/login` | Public (Rate limited) | Admin login & HMAC token issuance |
| `POST` | `/api/auth/logout` | Public | Admin session clear |
| `GET` | `/api/auth/verify` | Authenticated | Validate admin session |
| `GET` | `/api/projects` | Public | List published/all projects |
| `GET` | `/api/projects/:idOrSlug` | Public | Get single project by slug or ID |
| `POST` | `/api/projects` | Admin | Create project (Zod validated) |
| `PUT` | `/api/projects/:id` | Admin | Update project |
| `DELETE` | `/api/projects/:id` | Admin | Delete project |
| `GET` | `/api/reviews/approved` | Public | List approved featured reviews |
| `POST` | `/api/reviews/submit` | Public (Rate limited) | Submit review with spam moderation |
| `GET` | `/api/reviews` | Admin | List all reviews for moderation |
| `PATCH` | `/api/reviews/:id` | Admin | Moderate review (approve/hide/reject/feature) |
| `DELETE` | `/api/reviews/:id` | Admin | Permanently delete review |
| `POST` | `/api/enquiries` | Public (Rate limited) | Submit contact enquiry |
| `POST` | `/api/quote-requests` | Public (Rate limited) | Submit quote request estimator |
| `POST` | `/api/uploads` | Admin | Upload project media (Supabase Storage) |
