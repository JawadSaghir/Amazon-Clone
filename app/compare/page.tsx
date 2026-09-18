"use client";

import Link from "next/link";

import { useCompareStore } from "@/components/providers/compare-store";
import { catalog } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default function ComparePage() {
  const { ids, clear } = useCompareStore();
  const products = catalog.filter((product) => ids.includes(product.id));

  return (
    <div className="page-shell py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">Compare</p>
          <h1 className="text-3xl font-black">Product board</h1>
        </div>
        <button type="button" onClick={clear} className="link-ink">
          Clear
        </button>
      </div>
      {products.length === 0 ? (
        <div className="panel p-10 text-center">
          <p className="font-bold">Add products to compare from catalog cards.</p>
          <Link href="/search" className="brass-button mt-5">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="panel p-5">
              <h2 className="font-black">{product.title}</h2>
              <p className="mt-3 text-sm">Brand: {product.brand}</p>
              <p className="mt-1 text-sm">Rating: {product.rating}</p>
              <p className="mt-3 font-black">{formatMoney(product.priceInr)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
