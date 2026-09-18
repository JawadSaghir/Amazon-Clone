# Data Model

## Product

- `id`, `slug`, `title`, `brand`, `category`
- `description`, `images`, `tags`
- `priceInr`, `mrpInr`, `stock`, `rating`, `reviewCount`
- `seller`, `isDeal`, `isFeatured`, `createdAt`, `updatedAt`

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

## Order Item

- `id`, `orderId`, `productId`
- `titleSnapshot`, `quantity`, `unitPriceInr`, `image`

## Coupon

- `code`, `kind`, `value`, `minimumSubtotalInr`, `active`

## Review

- `productId`, `userId`, `rating`, `title`, `body`, `createdAt`
