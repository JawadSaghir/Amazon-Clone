import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <div className="panel p-10 text-center font-bold text-coal/60">No products match this filter.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
