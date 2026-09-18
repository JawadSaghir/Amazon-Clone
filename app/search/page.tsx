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
    <div className="page-shell grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="panel h-fit p-4">
        <h2 className="font-black">Filters</h2>
        <div className="mt-4 grid gap-2 text-sm">
          <Link href="/search" className="link-ink">
            All categories
          </Link>
          {categories.map((category) => (
            <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="text-coal/70 hover:text-coal">
              {category}
            </Link>
          ))}
          <Link href="/search?deal=flash" className="mt-3 font-bold text-pomegranate">
            Deals only
          </Link>
        </div>
      </aside>
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">{products.length} results</p>
            <h1 className="text-3xl font-black">{params.q ? `Search: ${params.q}` : params.category ?? "Catalog"}</h1>
          </div>
          <div className="flex gap-2 text-sm font-bold">
            <Link href={withSort(params, "price-asc")} className="border border-coal/15 bg-white px-3 py-2">
              Price low
            </Link>
            <Link href={withSort(params, "price-desc")} className="border border-coal/15 bg-white px-3 py-2">
              Price high
            </Link>
            <Link href={withSort(params, "rating")} className="border border-coal/15 bg-white px-3 py-2">
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
