# Implementation Plan

## Phase 1

- Build project scaffold.
- Write specs.
- Add Tailwind theme and global layout.

## Phase 2

- Implement MongoDB-backed catalog, DummyJSON seed script, PKR currency helpers, filters, product cards, and detail pages.

## Phase 3

- Implement Zustand stores for cart, wishlist, compare, and recently viewed.

## Phase 4

- Add Prisma schema, NextAuth, route handlers, checkout calculation, saved demo orders, and dashboard views.

## Phase 5

- Add admin console, README, specs, and verification.

## Phase 6

- Run dependency install, Prisma generation, typecheck, production build, and local server.

## Current Checkout Completion Criteria

- `Buy now` adds a database product to cart and opens `/checkout`.
- Signed-out checkout shows the sign-in gate with `callbackUrl=/checkout`.
- Signed-in checkout creates a MongoDB-backed demo order.
- Success page reads the saved order by `orderId`.
- `/dashboard/orders` shows the created customer order.
- Empty carts, stale product IDs, invalid addresses, and unauthenticated requests return clear errors.
