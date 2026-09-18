# Architecture And Runtime Flow

## Stack

- Next.js App Router for pages, layouts, route handlers, metadata, and server rendering.
- TypeScript for strict typing across UI, domain objects, validators, and API handlers.
- Tailwind CSS for a custom editorial commerce interface.
- Prisma with MongoDB for persistent users, products, orders, reviews, addresses, and coupons.
- NextAuth for credentials-based authentication and role-bearing sessions.
- Zustand for local cart, wishlist, compare, and recently viewed state.
- Stripe Checkout for test-mode payment handoff.

## Request Flow

1. A route renders through the App Router.
2. Server components request catalog data from `lib/catalog.ts`.
3. Catalog access first attempts persistence when available, then safely falls back to static demo data.
4. Client components hydrate interactive state from Zustand.
5. Mutations use route handlers in `app/api`.
6. Route handlers validate payloads with Zod, check the session, and return typed JSON.

## Checkout Flow

1. Client cart sends product IDs and quantities to `/api/checkout`.
2. Server rehydrates product prices from the catalog.
3. Server calculates subtotal, coupon, shipping, tax, and total.
4. Server creates a test checkout session shape and records the intended order contract.
5. Payment settlement is INR; UI display includes INR and PKR.

## Design Direction

The UI uses a warm bazaar-ledger aesthetic: parchment surfaces, ink-heavy typography, brass accents, dense product rows, compact controls, and operational dashboards. It should feel built for repeated shopping and selling work rather than a generic landing page.
