import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { categories, getProducts } from "@/lib/catalog";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; category?: string; deal?: string; sort?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const products = getProducts(params);

  return (
    <div className="page-shell grid gap-5 py-4 lg:grid-cols-[230px_1fr]">
      <aside className="h-fit border-r border-[#d5d9d9] bg-white p-4">
        <h2 className="font-bold">Filters</h2>
        <div className="mt-4 grid gap-2 text-sm">
          <Link href="/search" className="link-ink">
            All categories
          </Link>
          {categories.map((category) => (
            <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="text-coal/80 hover:text-pomegranate hover:underline">
              {category}
            </Link>
          ))}
          <Link href="/search?deal=flash" className="mt-3 font-bold text-pomegranate">
            Deals only
          </Link>
        </div>
      </aside>
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border border-[#d5d9d9] bg-white px-4 py-3">
          <div>
            <p className="text-sm text-coal/65">{products.length} results</p>
            <h1 className="text-xl font-bold">{params.q ? `Results for "${params.q}"` : params.category ?? "All products"}</h1>
          </div>
          <div className="flex gap-2 text-sm font-bold">
            <Link href={withSort(params, "price-asc")} className="rounded border border-[#d5d9d9] bg-white px-3 py-2 shadow-brass">
              Price low
            </Link>
            <Link href={withSort(params, "price-desc")} className="rounded border border-[#d5d9d9] bg-white px-3 py-2 shadow-brass">
              Price high
            </Link>
            <Link href={withSort(params, "rating")} className="rounded border border-[#d5d9d9] bg-white px-3 py-2 shadow-brass">
              Rating
            </Link>
          </div>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}

function withSort(params: { q?: string; category?: string; deal?: string }, sort: string) {
  const next = new URLSearchParams();
  if (params.q) next.set("q", params.q);
  if (params.category) next.set("category", params.category);
  if (params.deal) next.set("deal", params.deal);
  next.set("sort", sort);
  return `/search?${next.toString()}`;
}
