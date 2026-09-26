"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCompareStore } from "@/components/providers/compare-store";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export default function ComparePage() {
  const { ids, clear } = useCompareStore();
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
    <div className="page-shell px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-basil">Compare</p>
          <h1 className="font-display text-3xl font-semibold text-coal">Product board</h1>
        </div>
        <button type="button" onClick={clear} className="link-ink text-sm">
          Clear
        </button>
      </div>
      {products.length === 0 ? (
        <div className="panel p-10 text-center">
          <p className="font-semibold text-inkSoft">Add products to compare from catalog cards.</p>
          <Link href="/search" className="brass-button mt-5">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="card p-5">
              <h2 className="font-display font-semibold text-coal">{product.title}</h2>
              <p className="mt-3 text-sm text-inkSoft">Brand: {product.brand}</p>
              <p className="mt-1 text-sm text-inkSoft">Rating: {product.rating}</p>
              <p className="mt-3 font-display text-lg font-semibold">{formatMoney(product.priceInr)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
