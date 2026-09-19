# 8x Marketplace

8x Marketplace is a full-stack ecommerce application built from specs first. It uses Next.js App Router, TypeScript, Tailwind CSS, Prisma with MongoDB schema support, NextAuth, Zustand, Zod, and a Stripe-ready checkout boundary.

## Specs

Detailed specs are in [specs](specs/README.md):

- Product requirements
- Architecture and runtime flow
- Data model
- User journeys
- API contracts
- Security and operations
- Implementation plan

## Features

- Customer storefront with search, category filtering, sorting, deals, and product detail pages
- Cart, wishlist, compare, and recently viewed local state with Zustand
- Checkout with address, coupon, shipping, tax, and server-side total calculation
- INR base prices with PKR estimates rendered through centralized helpers
- NextAuth credentials login with customer and admin demo users
- Customer dashboard for orders, addresses, wishlist, profile, notifications, payments, and security
- Admin console for analytics, products, orders, and users
- Prisma schema for MongoDB-backed production persistence
- Static catalog fallback for local development

## Demo Login

Customer:

- `customer@8x.test`
- `8xDemo!Market2026`

Admin:

- `admin@8x.test`
- `8xDemo!Market2026`

## Setup

```bash
npm install
copy .env.example .env.local
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run build
```

## Currency Model

Catalog values are stored as INR integers. UI display uses `formatMoney()` from `lib/utils.ts` to render INR and estimated PKR. Stripe settlement can remain INR.
