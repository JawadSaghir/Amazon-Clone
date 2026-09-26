# Product Requirements

8x Marketplace is a regional ecommerce demo for shoppers in Pakistan. It combines a fast storefront, authenticated checkout, customer account tools, and an admin operating console.

## Primary Goals

- Browse a curated catalog by category, deal, search term, rating, and price.
- Display every monetary value in PKR.
- Keep existing internal `priceInr` and totals field names for compatibility while presenting PKR-only prices in the UI.
- Fetch product data from MongoDB at runtime, seeded from DummyJSON.
- Support guest browsing with local cart, wishlist, compare, and recently viewed state.
- Require authentication for checkout, dashboard, review creation, and saved addresses.
- Give admins catalog, order, user, and revenue visibility.

## Roles

- Guest: browse, search, compare, add to local cart, add to local wishlist.
- Customer: manage addresses, place orders, review products, inspect order history.
- Admin: manage products, inspect users, update orders, and view analytics.

## Acceptance Criteria

- A shopper can search for a product, open its detail page, add it to cart, and reach checkout.
- Checkout creates a saved demo order from server-trusted product data.
- Buy now adds the selected database product to cart and opens checkout.
- The same product price renders as PKR on listing, detail, cart, checkout, order, and admin views.
- Admin routes are visibly separate from customer routes.
- If no products exist in the database, the storefront shows a clear seed instruction instead of silently falling back to JSON.
