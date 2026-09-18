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
    <div className="page-shell py-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr_320px]">
        <div className="panel relative aspect-square overflow-hidden bg-white">
          <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
        </div>
        <div className="panel p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">{product.brand}</p>
          <h1 className="mt-3 text-3xl font-black">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Star className="h-5 w-5 fill-saffron text-saffron" />
            <span className="font-black">{product.rating}</span>
            <span className="text-coal/55">{product.reviewCount} reviews</span>
          </div>
          <div className="mt-5 border-y border-coal/10 py-5">
            <p className="text-3xl font-black">{formatMoney(product.priceInr)}</p>
            <p className="mt-1 text-sm text-coal/60">
              MRP <span className="line-through">{formatMoney(product.mrpInr)}</span> ({discountPercent(product.priceInr, product.mrpInr)}% off)
            </p>
          </div>
          <p className="mt-5 leading-relaxed text-coal/75">{product.description}</p>
          <div className="mt-5 flex items-center gap-2 bg-basil/10 p-3 text-sm font-bold text-basil">
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
