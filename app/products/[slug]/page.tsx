import { Star, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/product/product-actions";
import { ProductGrid } from "@/components/product/product-grid";
import { getAllProducts, getProductBySlug, getProducts } from "@/lib/catalog";
import { discountPercent, formatMoney } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getProducts({ category: product.category, excludeId: product.id, sort: "popular", limit: 4 });

  return (
    <div className="page-shell px-4 py-6 sm:px-8">
      <div className="mb-4 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-coal">Home</Link>
        <span>/</span>
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-coal">{product.category}</Link>
      </div>
      <section className="card grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)_300px]">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[0]} alt={product.title} className="h-full w-full object-contain p-4" />
        </div>
        <div className="lg:border-l lg:border-line lg:pl-8">
          <p className="text-sm font-semibold text-indigoInk">Brand: {product.brand}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-snug text-coal">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Star className="h-5 w-5 fill-saffron text-saffron" />
            <span className="font-semibold text-indigoInk">{product.rating}</span>
            <span className="text-muted">{product.reviewCount} ratings</span>
          </div>
          <div className="mt-5 border-y border-line py-5">
            <p className="font-display text-3xl font-semibold text-coal">{formatMoney(product.priceInr)}</p>
            <p className="mt-1.5 text-sm text-muted">
              MRP <span className="line-through">{formatMoney(product.mrpInr)}</span> ({discountPercent(product.priceInr, product.mrpInr)}% off)
            </p>
            <p className="mt-1.5 text-xs text-muted">Inclusive of all taxes. EMI and regional estimates shown for demo checkout.</p>
          </div>
          <p className="mt-5 leading-relaxed text-inkSoft">{product.description}</p>
          <div className="mt-5 grid gap-3 border-y border-line py-5 text-sm sm:grid-cols-3">
            <div className="text-center font-medium text-indigoInk">Secure transaction</div>
            <div className="text-center font-medium text-indigoInk">10 day replacement</div>
            <div className="text-center font-medium text-indigoInk">Fast delivery</div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-basilTint p-3 text-sm font-semibold text-basil">
            <Truck className="h-4 w-4" />
            Free delivery on eligible orders across India and Pakistan.
          </div>
        </div>
        <ProductActions product={product} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl font-semibold text-coal">Related products</h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
