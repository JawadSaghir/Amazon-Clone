import type { Product as DbProduct } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import dummyProducts from "@/data/dummyjson-products.json";
import { categories } from "@/lib/category-labels";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

export { categories };

const DEFAULT_PRODUCT_LIMIT = 24;
const MAX_PRODUCT_LIMIT = 60;
const DATABASE_FALLBACK_TIMEOUT_MS = 10000;
let databaseUnavailable = false;
let databaseWarningShown = false;

type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  reviews?: unknown[];
  images?: string[];
  thumbnail?: string;
};

const categoryMap: Record<string, string> = {
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleCaseCategory(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function convertPrice(priceUsd: number) {
  return Math.max(499, Math.round(priceUsd * 335));
}

function calculateMrp(price: number, discount = 0) {
  if (discount <= 0 || discount >= 90) return Math.round(price * 1.15);
  return Math.max(price + 1, Math.round(price / (1 - discount / 100)));
}

const FALLBACK_PRODUCTS: Product[] = (dummyProducts as DummyJsonProduct[])
  .map((product) => {
    const category = categoryMap[product.category] ?? titleCaseCategory(product.category);
    const priceInr = convertPrice(product.price);
    const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];

    return {
      id: `dummy-${product.id}`,
      slug: `${slugify(product.title)}-${product.id}`,
      title: product.title,
      brand: product.brand?.trim() || titleCaseCategory(product.category),
      category,
      description: product.description,
      images,
      tags: product.tags?.length ? product.tags : [product.category],
      priceInr,
      mrpInr: calculateMrp(priceInr, product.discountPercentage),
      stock: product.stock,
      rating: Number(product.rating.toFixed(1)),
      reviewCount: Math.max(product.reviews?.length ?? 0, Math.round(product.rating * 100)),
      seller: "8x Bazaar Database",
      isDeal: (product.discountPercentage ?? 0) >= 10,
      isFeatured: product.rating >= 4.5 || product.id <= 12
    };
  })
  .filter((product) => categories.includes(product.category) && product.images.length > 0);

type ProductSort = "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "popular";

type ProductQueryParams = {
  q?: string;
  category?: string;
  deal?: string | boolean;
  sort?: string;
  limit?: number;
  excludeId?: string;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function isDatabaseConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Server selection timeout") || message.includes("No available servers") || message.includes("ECONNREFUSED");
}

function warnDatabaseFallback(error: unknown) {
  if (isDatabaseConnectionError(error)) {
    databaseUnavailable = true;
    if (!databaseWarningShown) {
      console.warn("Database is unavailable; using bundled demo products.");
      databaseWarningShown = true;
    }
    return;
  }

  throw error;
}

async function withDatabaseFallback<T>(query: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!hasDatabaseUrl() || databaseUnavailable) return fallback();

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const queryPromise = query().catch((error) => {
    warnDatabaseFallback(error);
    return fallback();
  });
  const timeoutPromise = new Promise<T>((resolve) => {
    timeout = setTimeout(() => {
      if (!databaseWarningShown) {
        console.warn("Database did not respond quickly; using bundled demo products.");
        databaseWarningShown = true;
      }
      resolve(fallback());
    }, DATABASE_FALLBACK_TIMEOUT_MS);
  });

  const result = await Promise.race([queryPromise, timeoutPromise]);
  if (timeout) clearTimeout(timeout);
  return result;
}

function isMongoObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

function toProduct(product: DbProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    brand: product.brand,
    category: product.category,
    description: product.description,
    images: product.images,
    tags: product.tags,
    priceInr: product.priceInr,
    mrpInr: product.mrpInr,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    seller: product.seller,
    isDeal: product.isDeal,
    isFeatured: product.isFeatured
  };
}

async function readProductsFromDatabase() {
  return withDatabaseFallback(async () => {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
    return products.map(toProduct);
  }, () => FALLBACK_PRODUCTS);
}

function clampLimit(limit?: number) {
  if (!Number.isFinite(limit)) return DEFAULT_PRODUCT_LIMIT;
  return Math.max(1, Math.min(MAX_PRODUCT_LIMIT, Math.trunc(limit ?? DEFAULT_PRODUCT_LIMIT)));
}

function parseSort(sort?: string): ProductSort {
  if (sort === "price-asc" || sort === "price-desc" || sort === "rating" || sort === "newest" || sort === "popular") {
    return sort;
  }
  return "featured";
}

function orderByForSort(sort: ProductSort): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "price-asc") return [{ priceInr: "asc" }, { id: "asc" }];
  if (sort === "price-desc") return [{ priceInr: "desc" }, { id: "asc" }];
  if (sort === "rating") return [{ rating: "desc" }, { reviewCount: "desc" }, { id: "asc" }];
  if (sort === "newest") return [{ createdAt: "desc" }, { id: "asc" }];
  if (sort === "popular") return [{ reviewCount: "desc" }, { rating: "desc" }, { id: "asc" }];
  return [{ isFeatured: "desc" }, { reviewCount: "desc" }, { id: "asc" }];
}

function buildWhere(params?: ProductQueryParams): Prisma.ProductWhereInput {
  const q = params?.q?.trim();
  const category = params?.category;
  const deal = params?.deal === true || params?.deal === "true" || params?.deal === "flash";
  const where: Prisma.ProductWhereInput = {};

  if (category) where.category = category;
  if (deal) where.isDeal = true;
  if (params?.excludeId && isMongoObjectId(params.excludeId)) {
    where.id = { not: params.excludeId };
  }
  if (q) {
    const normalizedQuery = q.toLowerCase();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { tags: { has: q } },
      { tags: { has: normalizedQuery } }
    ];
  }

  return where;
}

function filterProducts(products: Product[], params?: ProductQueryParams) {
  const q = params?.q?.trim().toLowerCase();
  const category = params?.category;
  const deal = params?.deal === true || params?.deal === "true" || params?.deal === "flash";

  return products.filter((product) => {
    const matchesQuery = !q || [product.title, product.brand, product.category, ...product.tags].join(" ").toLowerCase().includes(q);
    const matchesCategory = !category || product.category === category;
    const matchesDeal = !deal || product.isDeal;
    const matchesExcludedProduct = !params?.excludeId || product.id !== params.excludeId;
    return matchesQuery && matchesCategory && matchesDeal && matchesExcludedProduct;
  });
}

function sortProducts(products: Product[], sort: ProductSort) {
  return [...products].sort((a, b) => {
    if (sort === "price-asc") return a.priceInr - b.priceInr || a.id.localeCompare(b.id);
    if (sort === "price-desc") return b.priceInr - a.priceInr || a.id.localeCompare(b.id);
    if (sort === "rating") return b.rating - a.rating || b.reviewCount - a.reviewCount || a.id.localeCompare(b.id);
    if (sort === "newest") return b.id.localeCompare(a.id);
    if (sort === "popular") return b.reviewCount - a.reviewCount || b.rating - a.rating || a.id.localeCompare(b.id);
    return Number(b.isFeatured) - Number(a.isFeatured) || b.reviewCount - a.reviewCount || a.id.localeCompare(b.id);
  });
}

function queryFallbackProducts(params?: ProductQueryParams) {
  return sortProducts(filterProducts(FALLBACK_PRODUCTS, params), parseSort(params?.sort)).slice(0, clampLimit(params?.limit));
}

export async function getProducts(params?: ProductQueryParams) {
  return withDatabaseFallback(async () => {
    const products = await prisma.product.findMany({
      where: buildWhere(params),
      orderBy: orderByForSort(parseSort(params?.sort)),
      take: clampLimit(params?.limit)
    });

    return products.map(toProduct);
  }, () => queryFallbackProducts(params));
}

export async function getProductResults(params?: ProductQueryParams) {
  return withDatabaseFallback(async () => {
    const where = buildWhere(params);
    const [products, count] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: orderByForSort(parseSort(params?.sort)),
        take: clampLimit(params?.limit)
      }),
      prisma.product.count({ where })
    ]);

    return { products: products.map(toProduct), count };
  }, () => {
    const products = queryFallbackProducts(params);
    return { products, count: filterProducts(FALLBACK_PRODUCTS, params).length };
  });
}

export async function getProductsInMemory(params?: { q?: string; category?: string; deal?: string; sort?: string; limit?: number }) {
  const q = params?.q?.trim().toLowerCase();
  const category = params?.category;
  const deal = params?.deal === "true" || params?.deal === "flash";
  const sort = params?.sort ?? "featured";

  let products = (await readProductsFromDatabase()).filter((product) => {
    const matchesQuery = !q || [product.title, product.brand, product.category, ...product.tags].join(" ").toLowerCase().includes(q);
    const matchesCategory = !category || product.category === category;
    const matchesDeal = !deal || product.isDeal;
    return matchesQuery && matchesCategory && matchesDeal;
  });

  products = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.priceInr - b.priceInr;
    if (sort === "price-desc") return b.priceInr - a.priceInr;
    if (sort === "rating") return b.rating - a.rating;
    return Number(b.isFeatured) - Number(a.isFeatured) || b.reviewCount - a.reviewCount;
  });

  return products.slice(0, clampLimit(params?.limit));
}

export async function getAllProducts() {
  return readProductsFromDatabase();
}

export async function getProductBySlug(slug: string) {
  return withDatabaseFallback(async () => {
    const product = await prisma.product.findUnique({ where: { slug } });
    return product ? toProduct(product) : null;
  }, () => FALLBACK_PRODUCTS.find((product) => product.slug === slug) ?? null);
}

export async function getProductById(id: string) {
  const fallbackProduct = FALLBACK_PRODUCTS.find((product) => product.id === id) ?? null;
  if (!isMongoObjectId(id)) return fallbackProduct;
  return withDatabaseFallback(async () => {
    const product = await prisma.product.findUnique({ where: { id } });
    return product ? toProduct(product) : fallbackProduct;
  }, () => fallbackProduct);
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const fallbackProducts = FALLBACK_PRODUCTS.filter((product) => ids.includes(product.id));
  const validIds = ids.filter(isMongoObjectId);
  if (validIds.length === 0) return fallbackProducts;
  return withDatabaseFallback(async () => {
    const products = await prisma.product.findMany({ where: { id: { in: validIds } } });
    return [...products.map(toProduct), ...fallbackProducts];
  }, () => fallbackProducts);
}

export async function getProductCount() {
  return withDatabaseFallback(() => prisma.product.count(), () => FALLBACK_PRODUCTS.length);
}
