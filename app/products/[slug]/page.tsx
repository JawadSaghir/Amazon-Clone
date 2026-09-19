import { Star, Truck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/product/product-actions";
import { ProductGrid } from "@/components/product/product-grid";
import { catalog, getProductBySlug, getProducts } from "@/lib/catalog";
import { discountPercent, formatMoney } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getProducts({ category: product.category }).filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <div className="page-shell py-4">
      <section className="grid gap-6 rounded-sm border border-[#d5d9d9] bg-white p-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)_300px]">
        <div className="relative aspect-square overflow-hidden bg-white">
          <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-contain p-4" />
        </div>
        <div className="border-slate-100 lg:border-l lg:pl-6">
          <p className="text-sm text-indigoInk">Brand: {product.brand}</p>
          <h1 className="mt-1 text-2xl font-normal leading-snug">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Star className="h-5 w-5 fill-saffron text-saffron" />
            <span className="font-bold text-indigoInk">{product.rating}</span>
            <span className="text-indigoInk">{product.reviewCount} ratings</span>
          </div>
          <div className="mt-4 border-y border-[#d5d9d9] py-4">
            <p className="text-3xl font-normal">{formatMoney(product.priceInr)}</p>
            <p className="mt-1 text-sm text-coal/60">
              MRP <span className="line-through">{formatMoney(product.mrpInr)}</span> ({discountPercent(product.priceInr, product.mrpInr)}% off)
            </p>
            <p className="mt-1 text-xs text-coal/60">Inclusive of all taxes. EMI and regional estimates shown for demo checkout.</p>
          </div>
          <p className="mt-5 leading-relaxed text-coal/75">{product.description}</p>
          <div className="mt-5 grid gap-3 border-y border-[#d5d9d9] py-4 text-sm sm:grid-cols-3">
            <div className="text-center text-indigoInk">Secure transaction</div>
            <div className="text-center text-indigoInk">10 day replacement</div>
            <div className="text-center text-indigoInk">Fast delivery</div>
          </div>
          <div className="mt-5 flex items-center gap-2 bg-slate-50 p-3 text-sm font-bold text-basil">
            <Truck className="h-4 w-4" />
            Free delivery on eligible orders across India and Pakistan.
          </div>
        </div>
        <ProductActions product={product} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-black">Related products</h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
