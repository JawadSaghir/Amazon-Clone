const fs = require("node:fs");
const path = require("node:path");
const { MongoClient } = require("mongodb");

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
  console.error("DATABASE_URL is not set. Add it to .env.local before seeding DummyJSON products.");
  process.exit(1);
}

const productsPath = path.join(process.cwd(), "data", "dummyjson-products.json");
const dummyProducts = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const usdToPkr = 335;
const storefrontCategories = [
  "Beauty",
  "Fragrances",
  "Furniture",
  "Groceries",
  "Home Decoration",
  "Kitchen Accessories",
  "Laptops",
  "Mens Shoes",
  "Smartphones",
  "Sports Accessories",
  "Womens Dresses"
];
const categoryMap = {
  beauty: "Beauty",
  "skin-care": "Beauty",
  fragrances: "Fragrances",
  furniture: "Furniture",
  groceries: "Groceries",
  "home-decoration": "Home Decoration",
  "kitchen-accessories": "Kitchen Accessories",
  laptops: "Laptops",
  "mens-shirts": "Mens Shoes",
  "mens-shoes": "Mens Shoes",
  "mens-watches": "Mens Shoes",
  sunglasses: "Mens Shoes",
  smartphones: "Smartphones",
  "mobile-accessories": "Smartphones",
  tablets: "Smartphones",
  "sports-accessories": "Sports Accessories",
  motorcycle: "Sports Accessories",
  vehicle: "Sports Accessories",
  tops: "Womens Dresses",
  "womens-bags": "Womens Dresses",
  "womens-dresses": "Womens Dresses",
  "womens-jewellery": "Womens Dresses",
  "womens-shoes": "Womens Dresses",
  "womens-watches": "Womens Dresses"
};

function toTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function convertPrice(priceUsd) {
  return Math.max(499, Math.round(priceUsd * usdToPkr));
}

function calculateMrp(priceInr, discountPercentage = 0) {
  if (discountPercentage <= 0 || discountPercentage >= 90) return Math.round(priceInr * 1.15);
  return Math.round(priceInr / (1 - discountPercentage / 100));
}

function mapProduct(product) {
  const now = new Date();
  const priceInr = convertPrice(product.price);
  const mrpInr = Math.max(priceInr + 1, calculateMrp(priceInr, product.discountPercentage));
  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];
  const category = categoryMap[product.category] ?? toTitleCase(product.category);

  return {
    slug: `${slugify(product.title)}-${product.id}`,
    title: product.title,
    brand: product.brand?.trim() || toTitleCase(product.category),
    category,
    description: product.description,
    images,
    tags: product.tags?.length ? product.tags : [product.category],
    priceInr,
    mrpInr,
    stock: product.stock,
    rating: Number(product.rating.toFixed(1)),
    reviewCount: Math.max(product.reviews?.length ?? 0, Math.round(product.rating * 100)),
    seller: "8x Bazaar Database",
    isDeal: (product.discountPercentage ?? 0) >= 10,
    isFeatured: product.rating >= 4.5 || product.id <= 12,
    createdAt: now,
    updatedAt: now
  };
}

async function main() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();

  try {
    const db = client.db();
    const products = db.collection("Product");
    const mappedProducts = dummyProducts
      .map(mapProduct)
      .filter((product) => storefrontCategories.includes(product.category) && product.images.length > 0);

    await products.createIndex({ slug: 1 }, { unique: true });
    await products.deleteMany({});
    await products.insertMany(mappedProducts);
  } finally {
    await client.close();
  }

  console.log(`Seeded ${dummyProducts.length} DummyJSON products into ${storefrontCategories.length} storefront categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
