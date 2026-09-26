import { ChevronRight, Clock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ScrollRow } from "@/components/home/scroll-row";
import { categories, getAllProducts, getProducts } from "@/lib/catalog";
import { discountPercent, formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

function productAt(products: Product[], index: number) {
  return products[index % products.length];
}

function productInCategory(products: Product[], categories: string[], fallbackIndex: number, preferredTerms: string[] = []) {
  const matches = products.filter((product) => categories.includes(product.category));
  const preferred = matches.find((product) => {
    const searchable = [product.title, product.brand, product.description, ...product.tags].join(" ").toLowerCase();
    return preferredTerms.some((term) => searchable.includes(term.toLowerCase()));
  });

  return preferred ?? matches[0] ?? productAt(products, fallbackIndex);
}

export async function MarketplaceHome() {
  const [deals, products] = await Promise.all([getProducts({ deal: "flash" }), getAllProducts()]);
  const bestSellers = [...products].sort((a, b) => b.reviewCount - a.reviewCount);
  const related = [...products].reverse();

  if (products.length === 0) {
    return (
      <div className="bg-paper">
        <TrustStrip />
        <section className="page-shell px-4 py-16 text-center sm:px-8">
          <h1 className="font-display text-3xl font-semibold text-coal">Products are unavailable right now.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">Please try again shortly while the catalog refreshes.</p>
        </section>
      </div>
    );
  }

  const kitchenCategories = ["Kitchen", "Kitchen Accessories"];
  const homeFeature = productInCategory(products, kitchenCategories, 3, ["pressure cooker", "carbon steel wok", "microwave", "hand blender", "pot"]);
  const homeModules = [
    homeFeature,
    productInCategory(products, ["Fashion", "Mens Shoes", "Womens Dresses"], 2),
    productInCategory(products, ["Computing", "Laptops"], 5),
    productInCategory(products, ["Grocery", "Groceries"], 4)
  ];
  const heroProducts = [
    productInCategory(products, ["Womens Dresses", "Mens Shoes"], 2),
    productInCategory(products, ["Smartphones"], 0),
    homeFeature,
    productInCategory(products, ["Laptops"], 5)
  ];
  const lowerModules = [productInCategory(products, ["Sports", "Sports Accessories"], 6), productInCategory(products, ["Beauty"], 7)];

  return (
    <div className="bg-paper">
      <CategoryImageStrip products={products} />
      <Hero products={heroProducts} />
      <TrustStrip />

      <section className="page-shell relative z-20 grid gap-6 px-4 pb-6 pt-10 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
        <ShoppingModule title="Kitchen essentials for daily cooking" action="Shop Kitchen" href={`/search?category=${encodeURIComponent(homeFeature.category)}`}>
          <ModuleImage src={homeModules[0].images[0]} alt={homeModules[0].title} className="h-[280px]" />
        </ShoppingModule>

        <ShoppingModule title="Fresh looks in Fashion" action="Shop Fashion" href="/search?category=Fashion">
          <ModuleImage src={homeModules[1].images[0]} alt={homeModules[1].title} className="h-[280px]" />
        </ShoppingModule>

        <ShoppingModule title="Audio, upgraded" action="Shop Computing" href="/search?category=Computing">
          <ModuleImage src={homeModules[2].images[0]} alt={homeModules[2].title} className="h-[280px]" />
        </ShoppingModule>

        <ShoppingModule title="Everyday grocery picks" action="Shop Grocery" href="/search?category=Grocery">
          <ModuleImage src={homeModules[3].images[0]} alt={homeModules[3].title} className="h-[280px]" />
        </ShoppingModule>
      </section>

      <ProductShelf title="Best sellers this week" products={bestSellers} />

      <section className="page-shell px-4 pb-8 sm:px-8">
        <div className="glass-dark grid gap-6 overflow-hidden rounded-2xl px-6 py-10 text-white sm:grid-cols-[1.2fr_1fr] sm:px-10">
          <div className="flex flex-col justify-center gap-4">
            <span className="badge w-fit bg-white/10 text-amazonGold backdrop-blur-md">Limited time</span>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Today&rsquo;s Deals</h2>
            <p className="max-w-md text-sm leading-relaxed text-white/65">
              Up to 40% off electronics, home and fashion &mdash; refreshed every day at midnight.
            </p>
            <Link href="/search?deal=flash" className="brass-button w-fit">
              Shop today&rsquo;s deals
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {deals.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 p-4 text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-200 group-hover:opacity-60 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-coal/55" />
                <span className="relative font-display text-xl font-bold">{discountPercent(product.priceInr, product.mrpInr)}%</span>
                <span className="relative text-[11px] text-white/70">{product.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell px-4 pb-8 sm:px-8">
        <div className="section-head mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-coal">Deals ending soon</h2>
          <Link href="/search?deal=flash" className="link-ink text-sm">
            See more
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {deals.slice(0, 4).map((product) => {
            const discount = discountPercent(product.priceInr, product.mrpInr);
            return (
              <Link key={product.id} href={`/products/${product.slug}`} className="card group grid overflow-hidden p-3 transition hover:shadow-panel">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-paper">
                  {discount > 0 && <span className="badge badge-accent absolute left-2 top-2 z-10">-{discount}%</span>}
                  <ModuleImage src={product.images[0]} alt={product.title} className="h-full" />
                </div>
                <div className="grid gap-1.5 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
                  <p className="line-clamp-2 min-h-10 text-sm font-medium text-coal">{product.title}</p>
                  <p className="font-display text-lg font-semibold">{formatMoney(product.priceInr)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-shell grid gap-6 px-4 pb-8 sm:px-8 md:grid-cols-2">
        <ShoppingModule title="Level up your setup" action="Shop Gaming" href="/search?category=Gaming">
          <ModuleImage src={lowerModules[0].images[0]} alt={lowerModules[0].title} className="h-[280px]" />
        </ShoppingModule>
        <ShoppingModule title="Everyday glow, sorted" action="Shop Beauty" href="/search?category=Beauty">
          <ModuleImage src={lowerModules[1].images[0]} alt={lowerModules[1].title} className="h-[280px]" />
        </ShoppingModule>
      </section>

      <ProductShelf title="Customers who viewed items in your browsing history also viewed" products={related} />

      <RecommendationBand />
    </div>
  );
}

function CategoryImageStrip({ products }: { products: Product[] }) {
  return (
    <section className="page-shell px-4 pt-6 sm:px-8">
      <div className="flex gap-7 overflow-x-auto rounded-2xl border border-line bg-white px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category, index) => {
          const product = productInCategory(products, [category], index);
          return (
            <Link
              key={category}
              href={`/search?category=${encodeURIComponent(category)}`}
              className="group flex w-[96px] shrink-0 flex-col items-center gap-2 text-center"
            >
              <span className="grid h-[76px] w-[76px] place-items-center overflow-hidden rounded-full border border-line bg-paper transition group-hover:border-amazonOrange">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.images[0]} alt={category} className="h-full w-full object-contain p-2 transition group-hover:scale-105" />
              </span>
              <span className="text-xs font-bold leading-tight text-coal">{category}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Hero({ products }: { products: Product[] }) {
  return (
    <section className="page-shell px-4 pt-6 sm:px-8">
      <div className="grid overflow-hidden rounded-2xl border border-line bg-[#f5ecdd] lg:grid-cols-[0.78fr_1fr]">
        <div className="flex flex-col justify-center gap-5 px-7 py-12 sm:px-10 lg:min-h-[430px]">
          <span className="badge w-fit bg-accentTint text-amazonOrangeDark">Today's picks</span>
          <h1 className="max-w-[560px] font-display text-4xl font-semibold leading-[1.04] text-coal sm:text-[52px]">
            Shop fresh finds for home, tech and everyday life
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-coal/70">
            Discover deals across mobiles, computing, kitchen and more with fast demo checkout.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link href="/search?deal=flash" className="brass-button">
              Shop deals
            </Link>
            <Link href="/search" className="outline-button border-line">
              Browse catalog
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 bg-[#eadbc7] p-7 sm:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex min-h-[164px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-[#f6efe4]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt={product.title} className="max-h-[180px] w-full object-contain p-5 transition duration-200 group-hover:scale-105" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: <Truck className="h-5 w-5" />, title: "Free delivery", body: "On orders over Rs 1,999" },
    { icon: <RotateCcw className="h-5 w-5" />, title: "10-day returns", body: "No questions asked" },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Secure checkout", body: "Cards and cash on delivery" },
    { icon: <Clock className="h-5 w-5" />, title: "Live PKR estimate", body: "Priced in INR at checkout" }
  ];

  return (
    <section className="page-shell px-4 pt-6 sm:px-8">
      <div className="card grid divide-y divide-lineSoft sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accentTint text-amazonOrangeDark">
              {item.icon}
            </span>
            <div>
              <p className="text-[13px] font-bold text-coal">{item.title}</p>
              <p className="text-[11.5px] text-muted">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductShelf({ title, products }: { title: string; products: Product[] }) {
  return (
    <section className="page-shell px-4 pb-8 sm:px-8">
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-coal sm:text-2xl">{title}</h2>
          <Link href="/search?deal=flash" className="link-ink shrink-0 text-sm">
            See more
          </Link>
        </div>
        <ScrollRow ariaLabel={title} className="flex gap-4 overflow-x-auto px-12 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              href={`/products/${product.slug}`}
              className="group grid min-h-[200px] w-[220px] shrink-0 place-items-center rounded-xl bg-paper p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt={product.title} className="max-h-40 w-full object-contain transition group-hover:scale-105" />
            </Link>
          ))}
        </ScrollRow>
      </div>
    </section>
  );
}

function RecommendationBand() {
  return (
    <section className="bg-accentTint py-12">
      <div className="page-shell flex flex-col items-center gap-3 px-4 text-center sm:px-8">
        <h2 className="font-display text-2xl font-semibold text-coal">See personalised recommendations</h2>
        <p className="text-sm text-coal/60">Sign in to see picks based on what you browse and buy.</p>
        <Link href="/login" className="ink-button mt-1">
          Sign in to 8x Bazaar
        </Link>
        <p className="text-xs text-coal/60">
          New customer?{" "}
          <Link href="/login" className="font-semibold text-amazonOrangeDark hover:underline">
            Start here.
          </Link>
        </p>
      </div>
    </section>
  );
}

function ShoppingModule({ title, action, href, children }: { title: string; action: string; href: string; children: ReactNode }) {
  return (
    <article className="card grid min-h-[400px] grid-rows-[auto_1fr_auto] p-5">
      <h2 className="font-display text-xl font-semibold leading-tight text-coal">{title}</h2>
      <Link href={href} className="group mt-3 block overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amazonOrange" aria-label={action}>
        {children}
      </Link>
      <Link href={href} className="link-ink mt-4 text-sm">
        {action}
      </Link>
    </article>
  );
}

function ModuleImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-paper ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]" />
    </div>
  );
}
