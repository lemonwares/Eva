<img src="https://evalocal.com/_next/image?url=%2Fimages%2Fbrand%2Feva-logo-light.png&w=128&q=75" width="160" alt="Eva Logo">

# Eva (Evalocal) — Event Vendor Atlas

A full-stack marketplace connecting clients with culturally-aware event service vendors across the UK.

[Live Website →](https://evalocal.com)

---

## About Eva

Eva is a comprehensive platform that simplifies event planning by connecting clients with verified vendors for various services (weddings, parties, corporate events, etc.). It features advanced search with culture tags, seamless booking flows, Stripe payments, and powerful dashboards for all user types.

Built from the ground up with modern technologies and production best practices.

## Key Features

### For Clients
- Search & browse vendors by category, location, and culture tags
- View detailed vendor profiles with portfolios, reviews & availability
- Send inquiries and receive custom quotes
- Secure booking with Stripe (full payment, deposit + balance, or cash)
- Track bookings with real-time status and timeline
- Client dashboard for managing bookings, favorites, and reviews

### For Vendors
- Guided onboarding wizard
- Manage service listings with multiple images and pricing tiers
- Respond to inquiries and send itemised quotes
- Availability calendar and team management
- Revenue analytics and performance charts
- SEO-optimized public vendor profiles

### For Admins
- Full vendor & user moderation
- Booking, quote, and review oversight
- Category, subcategory, and culture tag management
- Platform analytics and audit logs

## Technical Skills / Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

**Other Tools**: NextAuth v5, Cloudinary, Sentry, ZeptoMail, Recharts, Framer Motion, Zod, next-pwa, Docker-ready

## Local Setup

```bash
git clone https://github.com/lemonwares/Eva.git
```

```bash
cd Eva
```

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npx prisma migrate dev
```

```bash
npm run dev
```

## Challenges & Learnings
- Built a complex multi-role platform (Client + Vendor + Admin) with proper authorization and data isolation.
- Implemented secure payment flows with Stripe webhooks and partial payments.
- Designed a flexible category + culture tag system for multicultural events in the UK.
- Set up comprehensive monitoring with Sentry across client, server, and edge runtimes.
- Optimized for SEO with dynamic sitemaps, JSON-LD, and Open Graph metadata.
- Maintained clean architecture while scaling to 23+ API modules.

#### This project significantly improved my ability to build large-scale marketplaces with real payment and user management systems.


