# 8x Marketplace

8x Marketplace is a full-stack ecommerce demo built from specs first. It uses Next.js App Router, TypeScript, Tailwind CSS, MongoDB, Prisma schema support, NextAuth, Zustand, Zod, and a saved demo-order checkout flow.

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
- Checkout with address, coupon, shipping, tax, server-side total calculation, and saved demo orders
- PKR-only price display rendered through centralized helpers
- NextAuth credentials login with customer and admin demo users
- Customer dashboard for orders, addresses, wishlist, profile, notifications, payments, and security
- Admin console for analytics, products, orders, and users
- MongoDB-backed DummyJSON catalog seeded with `npm run db:seed-dummyjson`
- Native MongoDB order writes for local checkout compatibility without requiring a replica set
- Browser-extension hydration cleanup for injected attributes such as `bis_*` and `fdprocessedid`

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
npm run db:seed-dummyjson
npm run dev -- -p 3001
```

Open `http://localhost:3001`.

## Verification

```bash
npm run typecheck
npm run build
```

## Catalog And Currency Model

Catalog values keep the existing internal `priceInr` and totals field names for compatibility, but the storefront displays PKR only through `formatMoney()` in `lib/utils.ts`. Products are read from MongoDB at runtime; `data/dummyjson-products.json` is a seed source, not the runtime catalog.

## Checkout Model

Checkout is a demo saved-order flow, not a real payment gateway. The server requires a signed-in customer, re-reads product prices from MongoDB, validates address and quantities, recalculates totals, saves `Order` and `OrderItem` documents, and redirects to `/checkout/success?orderId=...`.
