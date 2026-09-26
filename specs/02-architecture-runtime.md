# Architecture And Runtime Flow

## Stack

- Next.js App Router for pages, layouts, route handlers, metadata, and server rendering.
- TypeScript for strict typing across UI, domain objects, validators, and API handlers.
- Tailwind CSS for a custom editorial commerce interface.
- MongoDB for persistent products, users, orders, reviews, addresses, and coupons.
- Prisma Client for schema-backed product reads and selected read paths; native MongoDB writes are used for demo order creation so local MongoDB does not need replica-set transactions.
- NextAuth for credentials-based authentication and role-bearing sessions.
- Zustand for local cart, wishlist, compare, and recently viewed state.
- Demo checkout saves orders directly; no external payment handoff is required in this version.

## Request Flow

1. A route renders through the App Router.
2. Server components request catalog data from `lib/catalog.ts`.
3. Catalog access reads MongoDB products; `data/dummyjson-products.json` is only a seed source.
4. Client components hydrate interactive state from Zustand.
5. Mutations use route handlers in `app/api`.
6. Route handlers validate payloads with Zod, check the session, and return typed JSON.

## Checkout Flow

1. Client cart sends product IDs and quantities to `/api/checkout`.
2. Server rehydrates product prices from the catalog.
3. Server calculates subtotal, coupon, shipping, tax, and total.
4. Server resolves or creates the demo customer record.
5. Server saves `Order` and `OrderItem` documents with product title, image, quantity, and unit-price snapshots.
6. The response returns `{ orderId, totals, settlementCurrency: "PKR", checkoutUrl: "/checkout/success" }`.
7. The client clears the cart and opens the success page.

## Hydration Guard

Some browser extensions inject attributes like `bis_*`, `__processed_*`, and `fdprocessedid` before React hydrates. The root layout strips those attributes early and key controls use hydration warning suppression where extensions target form elements.

## Design Direction

The UI uses a warm bazaar-ledger aesthetic: parchment surfaces, ink-heavy typography, brass accents, dense product rows, compact controls, and operational dashboards. It should feel built for repeated shopping and selling work rather than a generic landing page.
