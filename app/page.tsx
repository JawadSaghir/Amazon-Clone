import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { catalog, categories, getProducts } from "@/lib/catalog";

export default function HomePage() {
  const featured = getProducts().filter((product) => product.isFeatured);
  const deals = getProducts({ deal: "flash" });

  return (
    <div>
      <section className="bg-gradient-to-b from-amazonBlue via-[#3f5268] to-paper">
        <div className="page-shell pb-24 pt-10">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-saffron">8x Great Regional Sale</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Shop more. Compare faster. Pay in INR with PKR clarity.</h1>
            <p className="mt-4 max-w-2xl text-white/80">
              Electronics, fashion, kitchen, grocery, beauty, and sports essentials arranged in a dense marketplace built for quick buying.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/search" className="brass-button">
              Shop catalog
            </Link>
            <Link href="/search?deal=flash" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-coal hover:bg-slate-100">
              View deals
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell -mt-16 grid gap-4 lg:grid-cols-3">
        <div className="panel p-5">
          <h2 className="text-xl font-bold">Shop by department</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {categories.slice(0, 4).map((category) => (
              <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="bg-slate-100 p-4 font-bold hover:bg-slate-200">
                {category}
              </Link>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="text-xl font-bold">Today&apos;s snapshot</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Metric label="Products" value={catalog.length} />
            <Metric label="Deals" value={deals.length} />
            <Metric label="Categories" value={categories.length} />
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="text-xl font-bold">Coupon corner</h2>
          <p className="mt-3 text-sm text-coal/70">Use <span className="font-black">8XWELCOME</span> for 8% off up to INR 750. Totals show INR and PKR at checkout.</p>
          <Link href="/cart" className="brass-button mt-5 w-full">
            Go to cart
          </Link>
        </div>
      </section>

      <section className="page-shell py-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-pomegranate">Featured</p>
            <h2 className="text-2xl font-bold">Fast-moving shelves</h2>
          </div>
          <Link href="/search" className="link-ink">
            See all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="page-shell py-8">
        <div className="mb-4">
          <p className="text-sm font-bold text-pomegranate">Live deals</p>
          <h2 className="text-2xl font-bold">Marked-down picks</h2>
        </div>
        <ProductGrid products={deals} />
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-100 p-3">
      <p className="text-2xl font-bold text-coal">{value}</p>
      <p className="text-xs font-bold text-coal/50">{label}</p>
    </div>
  );
}
