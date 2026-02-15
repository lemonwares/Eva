# EVA Local — Event Vendor Atlas

A full-stack marketplace connecting clients with culturally-aware event service vendors across the UK. Built with **Next.js 16**, **Prisma 7**, **Stripe**, and **NextAuth v5**.

Live: [evalocal.com](https://evalocal.com)

---

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, Turbopack)            |
| Language   | TypeScript 5                                            |
| Styling    | Tailwind CSS v4                                         |
| Database   | PostgreSQL + Prisma ORM 7                               |
| Auth       | NextAuth v5 (Credentials + Google OAuth, JWT strategy)  |
| Payments   | Stripe Checkout + Webhooks (deposit, balance, full)     |
| Email      | ZeptoMail (transactional templates)                     |
| Images     | Cloudinary (upload, transform, optimise)                |
| Monitoring | Sentry (client, server, edge — with source maps)        |
| PWA        | next-pwa (offline support, service worker, installable) |
| Validation | Zod 4 (all API routes + forms)                          |
| Rate Limit | In-memory rate limiter on auth & sensitive routes       |
| Charts     | Recharts                                                |
| Animations | Framer Motion                                           |
| Icons      | Lucide React                                            |
| SEO        | Open Graph, Twitter Cards, JSON-LD, dynamic sitemap     |
| Logger     | Structured dev-only logger with Sentry integration      |

---

## Project Structure

```
Eva/
├── app/                        # Next.js App Router pages & API routes
│   ├── admin/                  # Admin dashboard
│   │   ├── analytics/          # Platform analytics & charts
│   │   ├── audit-logs/         # Activity audit trail
│   │   ├── bookings/           # Booking management & oversight
│   │   ├── categories/         # Category CRUD with subcategories
│   │   ├── cities/             # City management & geolocation
│   │   ├── notifications/      # Admin notifications
│   │   ├── quotes/             # Quote oversight
│   │   ├── reviews/            # Review moderation (approve, flag, reject)
│   │   ├── settings/           # Admin profile & security settings
│   │   ├── tags/               # Culture tag management
│   │   ├── users/              # User CRUD, roles, suspend/verify
│   │   └── vendors/            # Vendor moderation & verification
│   ├── api/                    # REST API routes (23 modules)
│   │   ├── admin/              # Admin-only endpoints
│   │   ├── auth/               # Login, register, verify, reset-password, delete-account
│   │   ├── bookings/           # Booking CRUD, cancel, complete, timeline
│   │   ├── categories/         # Category & subcategory queries
│   │   ├── checkout/           # Stripe checkout sessions
│   │   ├── cities/             # City data
│   │   ├── contact/            # Contact form submissions
│   │   ├── culture-tags/       # Culture tag queries
│   │   ├── favorites/          # Favourite vendor toggling
│   │   ├── inquiries/          # Client-vendor messaging threads
│   │   ├── listings/           # Public listing queries
│   │   ├── notifications/      # Notification management
│   │   ├── providers/          # Provider public profiles
│   │   ├── quotes/             # Quote creation, acceptance, decline
│   │   ├── reviews/            # Review CRUD & public display
│   │   ├── search/             # Full-text search & suggestions
│   │   ├── slugs/              # Slug validation
│   │   ├── stripe/             # Stripe webhooks
│   │   ├── subcategories/      # Subcategory queries
│   │   ├── tags/               # Tag management
│   │   ├── upload/             # Cloudinary image uploads
│   │   ├── users/              # User profile endpoints
│   │   └── vendor/             # Vendor profile, listings, analytics
│   ├── auth/                   # Auth pages (login, register, verify, reset)
│   ├── categories/             # Category browsing with filters
│   ├── dashboard/              # Client dashboard
│   │   ├── bookings/           # Booking list + detail view
│   │   ├── favorites/          # Saved vendors
│   │   ├── inquiries/          # Message threads
│   │   ├── quotes/             # Received quotes
│   │   ├── reviews/            # Written reviews
│   │   └── settings/           # Account settings
│   ├── search/                 # Search results with filters
│   ├── vendor/                 # Vendor dashboard
│   │   ├── analytics/          # Revenue & performance charts
│   │   ├── bookings/           # Booking management
│   │   ├── calendar/           # Availability calendar
│   │   ├── inquiries/          # Client inquiries
│   │   ├── onboarding/         # Guided setup wizard
│   │   ├── payments/           # Payment history & payouts
│   │   ├── profile/            # Business profile editor
│   │   ├── quotes/             # Quote management
│   │   ├── reviews/            # Review responses
│   │   ├── settings/           # Vendor settings
│   │   └── team/               # Team management
│   ├── vendors/                # Public vendor profiles
│   │   └── [id]/               # Individual vendor page (JSON-LD, OG)
│   ├── about/                  # About page
│   ├── contact/                # Contact form
│   ├── faq/                    # FAQ page
│   ├── how-it-works/           # How It Works page
│   ├── locations/              # Location browsing
│   ├── privacy/                # Privacy policy
│   ├── terms/                  # Terms of service
│   ├── cookies/                # Cookie policy
│   ├── offline/                # PWA offline fallback
│   ├── robots.ts               # Dynamic robots.txt
│   └── sitemap.ts              # Dynamic sitemap generation
├── components/                 # Reusable UI components
│   ├── admin/                  # Admin-specific components & modals
│   ├── auth/                   # Auth forms (login, register)
│   ├── common/                 # Navbar, Footer, ShareButton, etc.
│   ├── dashboard/              # Client dashboard shell & sidebar
│   ├── modals/                 # Confirmation & action modals
│   ├── pages/                  # Page-level landing sections
│   ├── providers/              # Context providers (session, theme)
│   ├── sections/               # Homepage sections (Hero, Testimonials)
│   ├── ui/                     # Primitives (buttons, inputs, cards)
│   └── vendor/                 # Vendor dashboard layout & components
├── hooks/                      # Custom React hooks
│   └── use-auth.ts             # Auth state hook
├── lib/                        # Server utilities & shared logic
│   ├── api-response.ts         # Standardised API response helpers
│   ├── auth-client.ts          # Client-side auth helpers
│   ├── auth-rsc.ts             # Server component auth helpers
│   ├── cloudinary.ts           # Cloudinary upload config
│   ├── constants.ts            # App constants
│   ├── email.ts                # Email sending (ZeptoMail)
│   ├── formatters.ts           # Currency, date, time formatters
│   ├── logger.ts               # Structured logger (dev: debug/info, prod: error/warn)
│   ├── mail.ts                 # Mail transport
│   ├── notifications.ts        # Notification helpers
│   ├── prisma.ts               # Prisma client singleton
│   ├── prisma-server.ts        # Server-only Prisma helpers
│   ├── rate-limit.ts           # In-memory rate limiter
│   ├── stripe.ts               # Stripe server helpers
│   ├── types.ts                # Shared TypeScript types
│   ├── upload.ts               # Upload utilities
│   ├── validations.ts          # Zod schemas for all API routes
│   └── templates/              # Email HTML template functions
├── prisma/
│   ├── schema.prisma           # Database schema (32 models)
│   ├── seed.ts                 # Database seeder
│   └── migrations/             # Migration history
├── templates/                  # Email HTML templates
│   ├── contactsupport.html
│   ├── resetaccountpassword.html
│   ├── verifyaccount.html
│   ├── welcomeaccount.html
│   └── templateLoader.ts       # Template engine
├── types/
│   └── next-auth.d.ts          # NextAuth type augmentations (Session, User, JWT)
├── auth.ts                     # NextAuth v5 configuration
├── proxy.ts                    # Edge proxy — role-based route protection
├── instrumentation.ts          # Sentry server/edge instrumentation
├── sentry.client.config.ts     # Sentry browser config
├── sentry.server.config.ts     # Sentry Node.js config
├── sentry.edge.config.ts       # Sentry Edge runtime config
├── next.config.ts              # Next.js + PWA + Sentry config
└── public/
    ├── manifest.json           # PWA manifest with maskable icons
    └── images/brand/           # Logo assets (dark, light, icon, apple)
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** running locally or remotely
- **Stripe CLI** (optional, for local webhook testing)

### 1. Clone & Install

```bash
git clone https://github.com/lemonwares/Eva.git
cd Eva
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`:

| Variable                 | Required | Description                                                   |
| ------------------------ | -------- | ------------------------------------------------------------- |
| `DATABASE_URL`           | Yes      | PostgreSQL connection string                                  |
| `AUTH_SECRET`            | Yes      | Generate with `openssl rand -base64 32`                       |
| `NEXTAUTH_SECRET`        | Yes      | Can be the same as AUTH_SECRET                                |
| `AUTH_URL`               | Yes      | `http://localhost:3000` for local dev                         |
| `NEXT_PUBLIC_BASE_URL`   | Yes      | `http://localhost:3000` or production URL                     |
| `STRIPE_SECRET_KEY`      | Yes      | From [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PUBLISHABLE_KEY` | Yes      | Public Stripe key                                             |
| `STRIPE_WEBHOOK_SECRET`  | Yes      | From Stripe webhook setup or CLI                              |
| `CLOUDINARY_CLOUD_NAME`  | Yes      | From [Cloudinary Console](https://cloudinary.com/console)     |
| `CLOUDINARY_API_KEY`     | Yes      | Cloudinary API key                                            |
| `CLOUDINARY_API_SECRET`  | Yes      | Cloudinary API secret                                         |
| `NEXT_PUBLIC_SENTRY_DSN` | No       | Sentry DSN for error tracking                                 |
| `ZEPTOMAIL_TOKEN`        | No       | ZeptoMail API token for emails                                |
| `ZEPTOMAIL_FROM_EMAIL`   | No       | Sender email address                                          |
| `AUTH_GOOGLE_ID`         | No       | Google OAuth client ID                                        |
| `AUTH_GOOGLE_SECRET`     | No       | Google OAuth client secret                                    |

### 3. Database Setup

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe Webhooks (Local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `npm run dev`            | Start dev server (Webpack mode)                    |
| `npm run build`          | Production build (Prisma generate + Next.js build) |
| `npm run build:debug`    | Build with debug output                            |
| `npm run start`          | Start production server                            |
| `npm run lint`           | Run ESLint                                         |
| `npx prisma studio`      | Open Prisma database GUI                           |
| `npx prisma migrate dev` | Run pending migrations                             |
| `npx prisma db seed`     | Seed database with sample data                     |

---

## Key Features

### For Clients

- Browse and search event vendors by category, location, and culture tags
- View vendor profiles with portfolios, reviews, pricing, and availability
- Send inquiries and receive custom quotes
- Accept quotes and book services with Stripe payments (full, deposit + balance, or cash)
- Track booking lifecycle with real-time status updates and timeline
- View individual booking details with payment breakdown
- Manage bookings, reviews, and favourites from a themed dashboard
- Dark mode support across the client dashboard

### For Vendors

- Guided onboarding wizard (business info → first listing → availability)
- Manage service listings with multiple images and pricing tiers
- Respond to inquiries and send itemised custom quotes
- Track bookings with cancel/complete actions and email notifications
- Revenue analytics, performance charts, and payment history
- Availability calendar and team management
- SEO-optimised public profile page with JSON-LD structured data

### For Admins

- Full vendor moderation (approve, reject, suspend, verify, feature)
- User management with role assignment and account actions
- Category and subcategory management with slug support
- Culture tag management for multicultural event filtering
- City management with geolocation data
- Booking oversight, quote tracking, and platform analytics
- Review moderation (approve, flag, reject)
- Audit logs and notification management
- Dark mode support across the admin dashboard

### Platform & Infrastructure

- **SEO**: Dynamic sitemap, robots.txt, Open Graph metadata, Twitter Cards, JSON-LD structured data (Organization + LocalBusiness schemas)
- **PWA**: Offline fallback, installable, service worker with runtime caching (including OpenStreetMap geocoding)
- **Security**: Edge proxy with role-based route protection, server-side auth guards on all protected layouts (admin, vendor, dashboard), Zod validation on all API routes, rate limiting on auth and sensitive endpoints, security headers
- **Performance**: Skeleton loading states on all major routes (14 loading.tsx files), image optimisation via Cloudinary and Next.js Image
- **Monitoring**: Sentry error tracking across client, server, and edge runtimes with source maps
- **Email**: Transactional HTML templates for verification, welcome, password reset, contact support, booking confirmations, and booking status changes (cancelled, completed)
- **Auth**: JWT strategy with 30-day sessions, Google OAuth + credentials, email verification flow, type-safe token augmentation, Edge-compatible proxy guards
- **Theming**: Independent dark mode for admin, vendor, and client dashboards
- **Accessibility**: Focus-visible keyboard navigation styles, semantic HTML
- **Mobile**: Fully responsive across all dashboards with mobile bottom navigation

---

## Architecture Decisions

| Decision                               | Rationale                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Edge proxy for route protection        | Runs before any page renders; uses `getToken()` from next-auth/jwt (Edge-compatible, no Prisma import chain) |
| Server-side auth guards on layouts     | Defence-in-depth — layouts re-check auth even if proxy is bypassed; prevents flash of protected content      |
| Client Shell pattern for dashboard     | Server layout checks auth, then renders a client component shell for interactive theme/sidebar state         |
| In-memory rate limiter                 | Simple and zero-dependency; suitable for single-instance deployments (upgrade to Redis for multi-instance)   |
| Structured logger over console         | Dev-only debug/info, always-on error/warn; integrates with Sentry for production error capture               |
| Skeleton loading states                | Route-level loading.tsx files provide instant visual feedback before data loads                              |
| Layout-based metadata for client pages | Client components can't export metadata, so parent layout.tsx provides Open Graph and SEO tags               |

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy — Prisma migrations run automatically via `postinstall`

### Other Platforms

```bash
npm run build
npm run start
```

Ensure `DATABASE_URL` points to a production PostgreSQL instance and all required env vars are set.

---

## License

Private — [Lemonwares](https://github.com/lemonwares)
