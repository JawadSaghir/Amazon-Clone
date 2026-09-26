"use client";

import { useEffect, useState } from "react";

import { ProductGrid } from "@/components/product/product-grid";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import type { Product } from "@/types";

export default function WishlistPage() {
  const ids = useWishlistStore((state) => state.ids);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }

    fetch(`/api/products?ids=${encodeURIComponent(ids.join(","))}`)
      .then((response) => response.json())
      .then((data: { products?: Product[] }) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, [ids]);

  return (
    <div>
      <h1 className="mb-5 text-3xl font-black">Wishlist</h1>
      <ProductGrid products={products} />
    </div>
  );
}
