import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { categories, getProductResults } from "@/lib/catalog";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; category?: string; deal?: string; sort?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { products, count } = await getProductResults({ ...params, limit: 60 });

  return (
    <div className="page-shell grid gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[240px_1fr]">
      <aside className="card h-fit p-5">
        <h2 className="font-display text-lg font-semibold text-coal">Filters</h2>
        <div className="mt-4 grid gap-1 text-sm">
          <Link href="/search" className="link-ink rounded-lg px-2 py-1.5 hover:bg-paper">
            All categories
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/search?category=${encodeURIComponent(category)}`}
              className="rounded-lg px-2 py-1.5 font-medium text-inkSoft hover:bg-paper hover:text-coal"
            >
              {category}
            </Link>
          ))}
          <Link href="/search?deal=flash" className="mt-3 rounded-lg px-2 py-1.5 font-semibold text-pomegranate hover:bg-paper">
            Deals only
          </Link>
        </div>
      </aside>
      <section>
        <div className="card mb-5 flex flex-wrap items-end justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-sm text-muted">
              Showing {products.length} of {count} results
            </p>
            <h1 className="font-display text-xl font-semibold text-coal">{params.q ? `Results for "${params.q}"` : params.category ?? "All products"}</h1>
          </div>
          <div className="flex gap-2 text-sm font-semibold">
            <Link href={withSort(params, "price-asc")} className="chip">
              Price low
            </Link>
            <Link href={withSort(params, "price-desc")} className="chip">
              Price high
            </Link>
            <Link href={withSort(params, "rating")} className="chip">
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
