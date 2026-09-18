"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { catalog } from "@/lib/catalog";

export default function WishlistPage() {
  const ids = useWishlistStore((state) => state.ids);
  const products = catalog.filter((product) => ids.includes(product.id));

  return (
    <div>
      <h1 className="mb-5 text-3xl font-black">Wishlist</h1>
      <ProductGrid products={products} />
    </div>
  );
}
