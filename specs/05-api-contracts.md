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

Products are read from MongoDB. If the database is empty, callers receive an empty list and the storefront displays seed instructions.

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
- Rejects stale or unknown product IDs.
- Saves an `Order` plus `OrderItem` snapshots.

Returns:

- `orderId`
- `totals`
- `settlementCurrency: "PKR"`
- `checkoutUrl: "/checkout/success"`

## `GET /api/orders`

Query params:

- `orderId` optional

Rules:

- Requires an authenticated session.
- Returns only orders belonging to the signed-in customer.
- Supports the success page and customer order history.

## `POST /api/reviews`

Requires authenticated user. Validates rating from 1 to 5.

## `GET /api/admin/summary`

Requires admin session. Returns revenue, order count, product count, user count, and recent orders.

## `POST /api/auth/register`

Creates a customer user with hashed password and normalized email.
