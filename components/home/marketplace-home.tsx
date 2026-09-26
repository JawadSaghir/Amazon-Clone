import { ChevronRight, Clock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ScrollRow } from "@/components/home/scroll-row";
import { categories, getAllProducts, getProducts } from "@/lib/catalog";
import { discountPercent, formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

function CategoryIcon({ category }: { category: string }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8
  } as const;

  switch (category) {
    case "Mobiles":
      return (
        <svg {...common}>
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      );
    case "Computing":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="11" rx="1.5" />
          <path d="M2 19h20l-1.6-3H3.6z" />
        </svg>
      );
    case "Fashion":
      return (
        <svg {...common}>
          <path d="M9 4l3 2 3-2 4 3-2 3v10H7V10L5 7z" />
        </svg>
      );
    case "Home":
      return (
        <svg {...common}>
          <path d="M4 11l8-7 8 7" />
          <path d="M6 10v9h12v-9" />
        </svg>
      );
    case "Kitchen":
    case "Kitchen Accessories":
      return (
        <svg {...common}>
          <path d="M6 2v7a3 3 0 0 0 6 0V2" />
          <path d="M9 9v13" />
          <path d="M17 2c-2 2-2 6 0 8v11" />
        </svg>
      );
    case "Beauty":
      return (
        <svg {...common}>
          <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      );
    case "Grocery":
      return (
        <svg {...common}>
          <path d="M4 9h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5z" />
          <path d="M8 9V6a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "Gaming":
      return (
        <svg {...common}>
          <rect x="2" y="8" width="20" height="10" rx="5" />
          <path d="M7 11v4M5 13h4" />
          <circle cx="16" cy="11.5" r="1" />
          <circle cx="18.5" cy="14" r="1" />
        </svg>
      );
    case "Sports":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

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
  const lowerModules = [productInCategory(products, ["Sports", "Sports Accessories"], 6), productInCategory(products, ["Beauty"], 7)];

  return (
    <div className="bg-paper">
      <Hero product={homeFeature} />
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

      <section className="page-shell px-4 pb-8 sm:px-8">
        <h2 className="mb-4 text-sm font-bold text-inkSoft">Shop by category</h2>
        <div className="panel flex flex-wrap items-center gap-3 px-4 py-5">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/search?category=${encodeURIComponent(category)}`}
              className="flex w-[104px] flex-col items-center gap-2 rounded-xl px-2 py-2 text-center hover:bg-white/50"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white text-coal/70 shadow-panel">
                <CategoryIcon category={category} />
              </span>
              <span className="text-xs font-semibold leading-tight text-coal">{category}</span>
            </Link>
          ))}
        </div>
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

function Hero({ product }: { product: Product }) {
  const discount = discountPercent(product.priceInr, product.mrpInr);
  const categoryHref = `/search?category=${encodeURIComponent(product.category)}`;

  return (
    <section className="page-shell px-4 pt-6 sm:px-8">
      <div
        className="relative grid min-h-[520px] overflow-hidden rounded-2xl bg-[#181611] sm:grid-cols-[1fr_0.92fr]"
        style={{ background: "linear-gradient(135deg, #17140f 0%, #292016 48%, #5b3b23 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(16,15,12,0.82) 0%, rgba(24,22,17,0.56) 45%, rgba(24,22,17,0.18) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.055) 0, rgba(255,255,255,0.055) 1px, transparent 1px, transparent 92px)"
          }}
        />
        <div className="absolute bottom-0 right-0 h-40 w-2/3 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />

        <div className="relative z-10 flex flex-col justify-center gap-5 px-6 py-12 sm:px-12">
          <span className="badge w-fit bg-white/90 text-amazonOrangeDark">Kitchen edit</span>
          <h1 className="max-w-[440px] font-display text-3xl font-semibold leading-[1.05] text-white sm:text-[44px]">
            Cookware for everyday dinners
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-white/65">
            Practical pans, prep tools and small appliances selected for busy kitchens, priced in INR with a PKR estimate at checkout.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link href={categoryHref} className="brass-button">
              Shop kitchen
            </Link>
            <Link href={categoryHref} className="flex items-center gap-1.5 text-sm font-semibold text-white">
              Explore {product.category}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 hidden items-center justify-center p-8 sm:flex">
          <Link
            href={`/products/${product.slug}`}
            className="w-full max-w-[300px] rounded-2xl border border-white/30 bg-[#f8f3e8] p-4 text-coal shadow-[0_32px_70px_-28px_rgba(0,0,0,0.72)]"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt={product.title} className="h-full w-full object-contain p-3" />
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase text-muted">{product.brand}</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-coal">{product.title}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-lg font-semibold text-coal">{formatMoney(product.priceInr)}</span>
              {discount > 0 && <span className="text-xs text-muted line-through">{formatMoney(product.mrpInr)}</span>}
            </div>
          </Link>
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
    <section className="page-shell relative z-20 -mt-8 px-4 sm:px-8">
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
