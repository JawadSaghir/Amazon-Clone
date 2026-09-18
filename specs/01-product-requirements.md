# Product Requirements

8x Marketplace is a regional ecommerce application for shoppers in India and Pakistan. It combines a fast storefront, authenticated checkout, customer account tools, and an admin operating console.

## Primary Goals

- Browse a curated catalog by category, deal, search term, rating, and price.
- Display every monetary value in INR and an estimated PKR equivalent.
- Keep base catalog prices in INR so checkout and accounting have one settlement source.
- Support guest browsing with local cart, wishlist, compare, and recently viewed state.
- Require authentication for checkout, dashboard, review creation, and saved addresses.
- Give admins catalog, order, user, and revenue visibility.

## Roles

- Guest: browse, search, compare, add to local cart, add to local wishlist.
- Customer: manage addresses, place orders, review products, inspect order history.
- Admin: manage products, inspect users, update orders, and view analytics.

## Acceptance Criteria

- A shopper can search for a product, open its detail page, add it to cart, and reach checkout.
- Checkout creates an order payload from server-trusted product data.
- The same product price renders as INR plus PKR estimate on listing, detail, cart, checkout, order, and admin views.
- Admin routes are visibly separate from customer routes.
- Static catalog data renders if no database connection is configured.
