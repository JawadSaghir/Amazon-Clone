# Data Model

## Product

- `id`, `slug`, `title`, `brand`, `category`
- `description`, `images`, `tags`
- `priceInr`, `mrpInr`, `stock`, `rating`, `reviewCount`
- `seller`, `isDeal`, `isFeatured`, `createdAt`, `updatedAt`

Products are seeded from DummyJSON into MongoDB with `npm run db:seed-dummyjson`. Runtime storefront reads come from the database, not from the JSON file.

## User

- `id`, `name`, `email`, `passwordHash`, `role`
- `addresses`, `orders`, `reviews`

Roles are `CUSTOMER` and `ADMIN`.

## Address

- `id`, `userId`, `label`, `fullName`, `phone`
- `line1`, `line2`, `city`, `region`, `postalCode`, `country`
- `isDefault`

## Order

- `id`, `userId`, `status`, `paymentStatus`
- `subtotalInr`, `discountInr`, `shippingInr`, `taxInr`, `totalInr`
- `currency`, `addressSnapshot`, `items`, `createdAt`

Order currency is `PKR`. The `*Inr` field names remain for compatibility with earlier code, but displayed values are converted and rendered as PKR.

## Order Item

- `id`, `orderId`, `productId`
- `titleSnapshot`, `quantity`, `unitPriceInr`, `image`

Order items store snapshots so past orders remain readable even if product titles, images, or prices change later.

## Coupon

- `code`, `kind`, `value`, `minimumSubtotalInr`, `active`

## Review

- `productId`, `userId`, `rating`, `title`, `body`, `createdAt`
