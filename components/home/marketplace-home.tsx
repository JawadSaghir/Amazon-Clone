import Link from "next/link";
import type { ReactNode } from "react";

import { ScrollRow } from "@/components/home/scroll-row";
import { catalog, getProducts } from "@/lib/catalog";

const fashionTiles = [
  { label: "Jeans under $50", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80" },
  { label: "Tops under $25", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=80" },
  { label: "Dresses under $30", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80" },
  { label: "Shoes under $50", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80" }
];

const homeTiles = [
  { label: "Kitchen & Dining", image: catalog[3].images[0] },
  { label: "Home Improvement", image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=700&q=80" },
  { label: "Decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80" },
  { label: "Bedding & Bath", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80" }
];

const kitchenSmall = [
  { label: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80" },
  { label: "Pots and Pans", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=500&q=80" },
  { label: "Kettles", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=500&q=80" }
];

const refreshTiles = [
  { label: "Dining", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=700&q=80" },
  { label: "Home", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80" },
  { label: "Kitchen", image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=700&q=80" },
  { label: "Health and Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80" }
];

const gadgetTiles = [
  { label: "Smartphones", image: catalog[0].images[0] },
  { label: "Laptops", image: catalog[1].images[0] },
  { label: "Headphones", image: catalog[5].images[0] },
  { label: "Accessories", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=80" }
];

const gamingTiles = [
  { label: "Headsets", image: catalog[5].images[0] },
  { label: "Keyboards", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80" },
  { label: "Chairs", image: "https://images.unsplash.com/photo-1612011213721-3936d387f318?auto=format&fit=crop&w=700&q=80" },
  { label: "Controllers", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=700&q=80" }
];

const beautyTiles = [
  { label: "Skincare", image: catalog[7].images[0] },
  { label: "Makeup", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80" },
  { label: "Fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80" },
  { label: "Tools", image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=700&q=80" }
];

const bookStrip = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80"
];

const homeStrip = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=500&q=80"
];

export function MarketplaceHome() {
  const deals = getProducts({ deal: "flash" });
  const toysAndGames = [catalog[5], catalog[6], catalog[0], catalog[1], catalog[2], catalog[3]];
  const allProducts = [...catalog, ...catalog.slice(0, 5)];

  return (
    <div className="bg-[#e3e6e6]">
      <Hero />
      <section className="page-shell relative z-20 -mt-[355px] grid gap-5 px-5 pb-5 md:grid-cols-2 xl:grid-cols-4">
        <ShoppingModule title="Get your game on" action="Shop gaming" href="/search?category=Gaming">
          <ModuleImage src={catalog[5].images[0]} alt="Gaming headphones" className="h-[304px]" />
        </ShoppingModule>

        <ShoppingModule title="New home arrivals under $50" action="Shop the latest from Home" href="/search?category=Home">
          <TileGrid tiles={homeTiles} />
        </ShoppingModule>

        <ShoppingModule title="Shop Fashion for less" action="See all deals" href="/search?category=Fashion">
          <TileGrid tiles={fashionTiles} />
        </ShoppingModule>

        <ShoppingModule title="Top categories in Kitchen appliances" action="Explore all products in Kitchen" href="/search?category=Kitchen">
          <div className="grid gap-3">
            <div>
              <ModuleImage src={catalog[3].images[0]} alt="Cooker" className="h-[145px]" />
              <p className="mt-1 text-sm">Cooker</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {kitchenSmall.map((tile) => (
                <div key={tile.label}>
                  <ModuleImage src={tile.image} alt={tile.label} className="h-[76px]" />
                  <p className="mt-1 truncate text-sm">{tile.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ShoppingModule>
      </section>

      <ProductShelf title="Best Sellers in Toys & Games" products={toysAndGames} />

      <section className="page-shell grid gap-5 px-5 pb-5 md:grid-cols-2 xl:grid-cols-4">
        <ShoppingModule title="Deals in PCs" action="Shop now" href="/search?category=Computing">
          <ModuleImage src={catalog[1].images[0]} alt={catalog[1].title} className="h-[304px]" />
        </ShoppingModule>

        <ShoppingModule title="Refresh your space" action="See more" href="/search?category=Home">
          <TileGrid tiles={refreshTiles} />
        </ShoppingModule>

        <ShoppingModule title="Gaming merchandise" action="Shop gaming gear" href="/search?category=Gaming">
          <TileGrid tiles={gamingTiles} />
        </ShoppingModule>

        <ShoppingModule title="Beauty picks" action="Shop beauty" href="/search?category=Beauty">
          <TileGrid tiles={beautyTiles} />
        </ShoppingModule>
      </section>

      <ImageStrip title="Best Sellers in Books" images={bookStrip} href="/search" />
      <ProductShelf title="Customers who viewed items in your browsing history also viewed" products={allProducts} />

      <section className="page-shell grid gap-5 px-5 pb-5 md:grid-cols-2 xl:grid-cols-4">
        {deals.slice(0, 4).map((product) => (
          <ShoppingModule key={product.id} title={product.brand} action="Shop now" href={`/products/${product.slug}`}>
            <ModuleImage src={product.images[0]} alt={product.title} className="h-[304px]" />
            <p className="mt-2 line-clamp-2 text-sm font-semibold">{product.title}</p>
          </ShoppingModule>
        ))}
      </section>

      <ImageStrip title="Home decor under $50" images={homeStrip} href="/search?category=Home" />

      <section className="page-shell grid gap-5 px-5 pb-5 md:grid-cols-2 xl:grid-cols-4">
        <ShoppingModule title="Shop deals in Fashion" action="See all deals" href="/search?category=Fashion">
          <TileGrid tiles={fashionTiles} />
        </ShoppingModule>

        <ShoppingModule title="Electronics for every day" action="Discover more" href="/search?category=Computing">
          <TileGrid tiles={gadgetTiles} />
        </ShoppingModule>

        <ShoppingModule title="Fitness essentials" action="Shop fitness" href="/search?category=Sports">
          <ModuleImage src={catalog[6].images[0]} alt={catalog[6].title} className="h-[304px]" />
        </ShoppingModule>

        <ShoppingModule title="Coffee and pantry favorites" action="Shop grocery" href="/search?category=Grocery">
          <ModuleImage src={catalog[4].images[0]} alt={catalog[4].title} className="h-[304px]" />
        </ShoppingModule>
      </section>

      <RecommendationBand />
    </div>
  );
}

function Hero() {
  return (
    <section className="page-shell relative overflow-hidden bg-[#df8bf3] px-0">
      <Link href="/search?category=Kitchen" className="relative block h-[600px] overflow-hidden bg-[#d276ef]" aria-label="Shop kitchen essentials under $50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-kitchen-essentials.jpg" alt="Kitchen essentials under $50" className="h-full w-full object-cover object-top transition duration-200 hover:brightness-105" />
      </Link>
    </section>
  );
}

function ProductShelf({ title, products }: { title: string; products: typeof catalog }) {
  return (
    <section className="page-shell px-5 pb-8">
      <div className="bg-white p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">{title}</h2>
          <Link href="/search?deal=flash" className="link-ink text-sm">
            See more
          </Link>
        </div>
        <ScrollRow ariaLabel={title} className="flex gap-4 overflow-x-auto px-12 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {products.map((product, index) => (
              <Link key={`${product.id}-${index}`} href={`/products/${product.slug}`} className="group grid min-h-[190px] w-[210px] shrink-0 place-items-center bg-[#f7fafa] p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.images[0]} alt={product.title} className="max-h-40 w-full object-contain transition group-hover:scale-105" />
              </Link>
            ))}
        </ScrollRow>
      </div>
    </section>
  );
}

function ImageStrip({ title, images, href }: { title: string; images: string[]; href: string }) {
  return (
    <section className="page-shell px-5 pb-5">
      <div className="bg-white p-5">
        <div className="mb-3 flex items-end gap-4">
          <h2 className="text-2xl font-black leading-tight">{title}</h2>
          <Link href={href} className="link-ink pb-0.5 text-sm">
            See more
          </Link>
        </div>
        <ScrollRow ariaLabel={title} className="flex gap-5 overflow-x-auto px-12 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((image, index) => (
              <Link key={image} href={href} className="grid h-[200px] w-[185px] shrink-0 place-items-center bg-[#f7fafa] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`${title} item ${index + 1}`} className="max-h-[176px] w-full object-contain" />
              </Link>
            ))}
        </ScrollRow>
      </div>
    </section>
  );
}

function RecommendationBand() {
  return (
    <section className="bg-white py-9">
      <div className="border-y border-[#ddd] py-7 text-center">
        <p className="text-sm text-coal">See personalized recommendations</p>
        <Link href="/login" className="mx-auto mt-1 flex h-8 w-[230px] items-center justify-center rounded-[3px] border border-[#e6a400] bg-[linear-gradient(#ffd978,#ffc42d)] text-xs font-bold text-coal shadow-brass">
          Sign in
        </Link>
        <p className="mt-1 text-xs">
          New customer?{" "}
          <Link href="/login" className="text-indigoInk hover:text-pomegranate hover:underline">
            Start here.
          </Link>
        </p>
      </div>
    </section>
  );
}

function ShoppingModule({ title, action, href, children }: { title: string; action: string; href: string; children: ReactNode }) {
  return (
    <article className="grid min-h-[420px] grid-rows-[auto_1fr_auto] bg-white p-5 shadow-panel">
      <h2 className="text-2xl font-black leading-tight text-coal">{title}</h2>
      <Link href={href} className="group mt-3 block focus:outline-none focus-visible:ring-2 focus-visible:ring-amazonOrange" aria-label={action}>
        {children}
      </Link>
      <Link href={href} className="mt-4 text-sm font-medium text-indigoInk hover:text-pomegranate hover:underline">
        {action}
      </Link>
    </article>
  );
}

function TileGrid({ tiles }: { tiles: { label: string; image: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      {tiles.map((tile) => (
        <div key={tile.label}>
          <ModuleImage src={tile.image} alt={tile.label} className="h-[116px]" />
          <p className="mt-1 text-xs">{tile.label}</p>
        </div>
      ))}
    </div>
  );
}

function ModuleImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`overflow-hidden bg-[#f3f3f3] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]" />
    </div>
  );
}
