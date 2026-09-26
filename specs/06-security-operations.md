# Security And Operations

## Authentication

- NextAuth credentials provider validates email and password.
- Passwords are hashed with bcrypt.
- JWT sessions carry user ID and role.

## Authorization

- Customer dashboard requires a session.
- Admin APIs require `role === "ADMIN"`.
- Server handlers never trust client totals.
- Customer order reads are scoped to the signed-in user's email/session.

## Validation

- Zod validates checkout, product queries, registration, and reviews.
- Quantities are bounded.
- Coupon values are recalculated server-side.

## Secrets

Secrets are read from environment variables and never committed.

Required local values:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`

## Operations

- Run `npm run prisma:generate`.
- Run `npm run db:seed-dummyjson` when the product database is empty.
- Run `npm run typecheck`.
- Run `npm run build`.
- Run the local app on `3001` when `.env.local` points `NEXTAUTH_URL` to `http://localhost:3001`.
- Browser extensions may inject attributes before hydration; the root layout strips known extension attributes and selected controls suppress extension-only hydration noise.
