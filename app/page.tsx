import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { catalog, categories, getProducts } from "@/lib/catalog";

export default function HomePage() {
  const featured = getProducts().filter((product) => product.isFeatured);
  const deals = getProducts({ deal: "flash" });

  return (
    <div>
      <section className="page-shell grid gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel bg-coal p-8 text-paper sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-saffron">8x Marketplace</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">A regional shopping engine with INR and PKR clarity.</h1>
          <p className="mt-5 max-w-2xl text-paper/75">
            Discover electronics, home goods, fashion, grocery, beauty, and fitness products through a fast full-stack marketplace experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="brass-button">
              Shop catalog
            </Link>
            <Link href="/search?deal=flash" className="border border-paper/25 px-4 py-2 text-sm font-bold hover:bg-white/10">
              View deals
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="panel p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">Today&apos;s ledger</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <Metric label="Products" value={catalog.length} />
              <Metric label="Deals" value={deals.length} />
              <Metric label="Categories" value={categories.length} />
            </div>
          </div>
          <div className="panel p-5">
            <p className="font-black">Use coupon 8XWELCOME</p>
            <p className="mt-2 text-sm text-coal/65">Get 8% off up to INR 750. Totals show INR and PKR at checkout.</p>
          </div>
        </div>
      </section>

      <section className="page-shell py-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">Featured</p>
            <h2 className="text-2xl font-black">Fast-moving shelves</h2>
          </div>
          <Link href="/search" className="link-ink">
            See all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="page-shell py-8">
        <div className="mb-4">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-pomegranate">Live deals</p>
          <h2 className="text-2xl font-black">Marked-down picks</h2>
        </div>
        <ProductGrid products={deals} />
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper p-4">
      <p className="text-2xl font-black text-coal">{value}</p>
      <p className="text-xs font-bold uppercase text-coal/50">{label}</p>
    </div>
  );
}
