const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is not set. Add it to .env.local before syncing the product image.");
  process.exit(1);
}

const prisma = new PrismaClient();

const products = [
  {
    slug: "orion-x1-5g-phone",
    title: "Orion X1 5G Phone with 120Hz AMOLED Display",
    brand: "Orion",
    category: "Mobiles",
    description: "A fast 5G handset with a crisp AMOLED panel, all-day battery, dual speakers, and a camera system tuned for low-light city shots.",
    images: ["/products/orion-x1-5g-phone.png"],
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
    slug: "nimblebook-air-14",
    title: "NimbleBook Air 14 Ultralight Laptop",
    brand: "Nimble",
    category: "Computing",
    description: "A 14-inch productivity laptop with quiet thermals, long battery life, and a color-accurate display for students and founders.",
    images: ["/products/nimblebook-air-14-high-end.png"],
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
    slug: "saffron-stitch-cotton-kurta",
    title: "Saffron Stitch Cotton Kurta Set",
    brand: "Saffron Stitch",
    category: "Fashion",
    description: "Breathable cotton festive wear with tailored sleeves, hand-block details, and a relaxed fit for daily comfort.",
    images: ["/products/saffron-stitch-cotton-kurta.jpeg"],
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
    slug: "copperline-pressure-cooker-5l",
    title: "Copperline 5L Stainless Pressure Cooker",
    brand: "Copperline",
    category: "Kitchen",
    description: "A sturdy 5L cooker with induction base, easy-grip handles, and a safety valve made for busy family kitchens.",
    images: ["/products/copperline-pressure-cooker-5l.png"],
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
    slug: "velvet-bean-arabica-coffee",
    title: "Velvet Bean Arabica Coffee 500g",
    brand: "Velvet Bean",
    category: "Grocery",
    description: "Medium-roast Arabica beans with cocoa notes and a clean finish, roasted weekly for filter and espresso brewing.",
    images: ["/products/velvet-bean-arabica-coffee.png"],
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
    slug: "aurora-anc-headphones",
    title: "Aurora ANC Wireless Headphones",
    brand: "Aurora",
    category: "Computing",
    description: "Over-ear wireless headphones with hybrid noise cancellation, soft cushions, low-latency mode, and 40-hour battery life.",
    images: ["/products/aurora-anc-headphones.jpg"],
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
    slug: "terra-firm-yoga-mat",
    title: "Terra Firm Anti-Slip Yoga Mat",
    brand: "Terra Firm",
    category: "Sports",
    description: "A dense anti-slip mat for yoga, mobility, and home workouts with alignment marks and a carry strap.",
    images: ["/products/terra-firm-yoga-mat.png"],
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
    slug: "lumen-skin-dew-serum",
    title: "Lumen Skin Dew Vitamin C Serum",
    brand: "Lumen",
    category: "Beauty",
    description: "A lightweight vitamin C serum with niacinamide and hyaluronic acid for everyday glow support.",
    images: ["/products/lumen-skin-dew-serum.jpeg"],
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

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { images: product.images },
      create: product
    });
  }

  console.log(`Synced ${products.length} redesign product images.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
