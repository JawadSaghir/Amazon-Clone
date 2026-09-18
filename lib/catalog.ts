import type { Product } from "@/types";

export const categories = [
  "Mobiles",
  "Computing",
  "Fashion",
  "Home",
  "Kitchen",
  "Beauty",
  "Grocery",
  "Gaming",
  "Sports"
];

export const catalog: Product[] = [
  {
    id: "p-100",
    slug: "orion-x1-5g-phone",
    title: "Orion X1 5G Phone with 120Hz AMOLED Display",
    brand: "Orion",
    category: "Mobiles",
    description: "A fast 5G handset with a crisp AMOLED panel, all-day battery, dual speakers, and a camera system tuned for low-light city shots.",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"],
    tags: ["phone", "5g", "amoled"],
    priceInr: 24999,
    mrpInr: 31999,
    stock: 42,
    rating: 4.5,
    reviewCount: 1832,
    seller: "8x Fulfilment",
    isDeal: true,
    isFeatured: true
  },
  {
    id: "p-101",
    slug: "nimblebook-air-14",
    title: "NimbleBook Air 14 Ultralight Laptop",
    brand: "Nimble",
    category: "Computing",
    description: "A 14-inch productivity laptop with quiet thermals, long battery life, and a color-accurate display for students and founders.",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
    tags: ["laptop", "work", "student"],
    priceInr: 64990,
    mrpInr: 79990,
    stock: 18,
    rating: 4.4,
    reviewCount: 764,
    seller: "8x Direct",
    isDeal: false,
    isFeatured: true
  },
  {
    id: "p-102",
    slug: "saffron-stitch-cotton-kurta",
    title: "Saffron Stitch Cotton Kurta Set",
    brand: "Saffron Stitch",
    category: "Fashion",
    description: "Breathable cotton festive wear with tailored sleeves, hand-block details, and a relaxed fit for daily comfort.",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"],
    tags: ["kurta", "cotton", "festive"],
    priceInr: 1899,
    mrpInr: 3299,
    stock: 96,
    rating: 4.2,
    reviewCount: 441,
    seller: "Textile House",
    isDeal: true,
    isFeatured: false
  },
  {
    id: "p-103",
    slug: "copperline-pressure-cooker-5l",
    title: "Copperline 5L Stainless Pressure Cooker",
    brand: "Copperline",
    category: "Kitchen",
    description: "A sturdy 5L cooker with induction base, easy-grip handles, and a safety valve made for busy family kitchens.",
    images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"],
    tags: ["kitchen", "cooker", "steel"],
    priceInr: 2490,
    mrpInr: 3990,
    stock: 63,
    rating: 4.6,
    reviewCount: 1004,
    seller: "Kitchen Square",
    isDeal: true,
    isFeatured: true
  },
  {
    id: "p-104",
    slug: "velvet-bean-arabica-coffee",
    title: "Velvet Bean Arabica Coffee 500g",
    brand: "Velvet Bean",
    category: "Grocery",
    description: "Medium-roast Arabica beans with cocoa notes and a clean finish, roasted weekly for filter and espresso brewing.",
    images: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80"],
    tags: ["coffee", "grocery", "arabica"],
    priceInr: 699,
    mrpInr: 999,
    stock: 120,
    rating: 4.7,
    reviewCount: 2388,
    seller: "Roast Lane",
    isDeal: false,
    isFeatured: true
  },
  {
    id: "p-105",
    slug: "aurora-anc-headphones",
    title: "Aurora ANC Wireless Headphones",
    brand: "Aurora",
    category: "Computing",
    description: "Over-ear wireless headphones with hybrid noise cancellation, soft cushions, low-latency mode, and 40-hour battery life.",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
    tags: ["audio", "headphones", "anc"],
    priceInr: 8990,
    mrpInr: 12990,
    stock: 34,
    rating: 4.3,
    reviewCount: 891,
    seller: "Sound Yard",
    isDeal: true,
    isFeatured: false
  },
  {
    id: "p-106",
    slug: "terra-firm-yoga-mat",
    title: "Terra Firm Anti-Slip Yoga Mat",
    brand: "Terra Firm",
    category: "Sports",
    description: "A dense anti-slip mat for yoga, mobility, and home workouts with alignment marks and a carry strap.",
    images: ["https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80"],
    tags: ["fitness", "yoga", "sports"],
    priceInr: 1199,
    mrpInr: 1999,
    stock: 72,
    rating: 4.1,
    reviewCount: 312,
    seller: "Move Studio",
    isDeal: false,
    isFeatured: false
  },
  {
    id: "p-107",
    slug: "lumen-skin-dew-serum",
    title: "Lumen Skin Dew Vitamin C Serum",
    brand: "Lumen",
    category: "Beauty",
    description: "A lightweight vitamin C serum with niacinamide and hyaluronic acid for everyday glow support.",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"],
    tags: ["beauty", "serum", "skincare"],
    priceInr: 849,
    mrpInr: 1499,
    stock: 88,
    rating: 4.0,
    reviewCount: 544,
    seller: "Glow Counter",
    isDeal: true,
    isFeatured: false
  }
];

export function getProducts(params?: { q?: string; category?: string; deal?: string; sort?: string }) {
  const q = params?.q?.trim().toLowerCase();
  const category = params?.category;
  const deal = params?.deal === "true" || params?.deal === "flash";
  const sort = params?.sort ?? "featured";

  let products = catalog.filter((product) => {
    const matchesQuery = !q || [product.title, product.brand, product.category, ...product.tags].join(" ").toLowerCase().includes(q);
    const matchesCategory = !category || product.category === category;
    const matchesDeal = !deal || product.isDeal;
    return matchesQuery && matchesCategory && matchesDeal;
  });

  products = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.priceInr - b.priceInr;
    if (sort === "price-desc") return b.priceInr - a.priceInr;
    if (sort === "rating") return b.rating - a.rating;
    return Number(b.isFeatured) - Number(a.isFeatured);
  });

  return products;
}

export function getProductBySlug(slug: string) {
  return catalog.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return catalog.find((product) => product.id === id);
}
