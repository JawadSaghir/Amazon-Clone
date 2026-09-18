# Security And Operations

## Authentication

- NextAuth credentials provider validates email and password.
- Passwords are hashed with bcrypt.
- JWT sessions carry user ID and role.

## Authorization

- Customer dashboard requires a session.
- Admin APIs require `role === "ADMIN"`.
- Server handlers never trust client totals.

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
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Operations

- Run `npm run prisma:generate`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Use Stripe test mode during local development.
