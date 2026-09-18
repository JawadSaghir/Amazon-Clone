export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  priceInr: number;
  mrpInr: number;
  stock: number;
  rating: number;
  reviewCount: number;
  seller: string;
  isDeal: boolean;
  isFeatured: boolean;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type AddressInput = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: "India" | "Pakistan";
};

export type OrderTotals = {
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  taxInr: number;
  totalInr: number;
};
