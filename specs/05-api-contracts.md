# API Contracts

## `GET /api/products`

Query params:

- `q`
- `category`
- `deal`
- `sort`

Returns:

- `products`
- `count`

## `GET /api/products/[slug]`

Returns one product or `404`.

## `POST /api/checkout`

Body:

- `items`: `{ productId: string; quantity: number }[]`
- `couponCode`
- `address`

Rules:

- Requires a customer session for a real order.
- Recalculates every price server-side.
- Returns order totals and a checkout URL placeholder if Stripe keys are not configured.

## `POST /api/reviews`

Requires authenticated user. Validates rating from 1 to 5.

## `GET /api/admin/summary`

Requires admin session. Returns revenue, order count, product count, user count, and recent orders.

## `POST /api/auth/register`

Creates a customer user with hashed password and normalized email.
