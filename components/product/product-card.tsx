"use client";

import { BarChart3, Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { useCompareStore } from "@/components/providers/compare-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { discountPercent, formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const add = useCartStore((state) => state.add);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlistedValue = useWishlistStore((state) => state.ids.includes(product.id));
  const toggleCompare = useCompareStore((state) => state.toggle);
  const discount = discountPercent(product.priceInr, product.mrpInr);
  const isWishlisted = mounted && isWishlistedValue;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <article className="card group grid overflow-hidden p-3 transition hover:shadow-panel">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.title} className="h-full w-full object-contain p-3 transition duration-200 group-hover:scale-[1.03]" />
        {product.isDeal && (
          <span className="badge badge-accent absolute left-2 top-2">Limited time deal</span>
        )}
      </Link>
      <div className="grid gap-2 pt-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-sm leading-snug text-coal hover:text-pomegranate hover:underline">
            {product.title}
          </Link>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-4 w-4 fill-saffron text-saffron" />
          <span className="text-indigoInk">{product.rating}</span>
          <span className="text-muted">({product.reviewCount})</span>
        </div>
        <div>
          {discount > 0 && <p className="text-xs font-bold text-pomegranate">{discount}% off</p>}
          <p className="font-display text-lg font-semibold text-coal">{formatMoney(product.priceInr)}</p>
          <p className="text-xs text-muted">
            MRP <span className="line-through">{formatMoney(product.mrpInr)}</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-basil">FREE delivery</p>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <button type="button" onClick={() => add(product)} className="brass-button !px-3 !py-2 text-xs">
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
          <button type="button" onClick={() => toggleWishlist(product.id)} className="rounded-full border border-line p-2 hover:border-coal/40" aria-label="Toggle wishlist">
            <Heart className={isWishlisted ? "h-4 w-4 fill-pomegranate text-pomegranate" : "h-4 w-4 text-coal/60"} />
          </button>
          <button type="button" onClick={() => toggleCompare(product.id)} className="rounded-full border border-line p-2 hover:border-coal/40" aria-label="Toggle compare">
            <BarChart3 className="h-4 w-4 text-coal/60" />
          </button>
        </div>
      </div>
    </article>
  );
}
