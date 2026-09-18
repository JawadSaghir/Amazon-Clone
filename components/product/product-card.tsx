"use client";

import { BarChart3, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/components/providers/cart-store";
import { useCompareStore } from "@/components/providers/compare-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { discountPercent, formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((state) => state.add);
  const wishlist = useWishlistStore((state) => state);
  const compare = useCompareStore((state) => state);
  const discount = discountPercent(product.priceInr, product.mrpInr);

  return (
    <article className="panel grid overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] bg-white">
        <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        {product.isDeal && <span className="absolute left-3 top-3 bg-pomegranate px-2 py-1 text-xs font-black text-white">Deal</span>}
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-basil">{product.brand}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 min-h-12 font-black leading-tight hover:text-indigoInk">
            {product.title}
          </Link>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-saffron text-saffron" />
          <span className="font-bold">{product.rating}</span>
          <span className="text-coal/50">({product.reviewCount})</span>
        </div>
        <div>
          <p className="font-black">{formatMoney(product.priceInr)}</p>
          <p className="text-xs text-coal/55">
            MRP <span className="line-through">{formatMoney(product.mrpInr)}</span> {discount}% off
          </p>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <button type="button" onClick={() => add(product)} className="brass-button">
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
          <button type="button" onClick={() => wishlist.toggle(product.id)} className="border border-coal/15 p-2" aria-label="Toggle wishlist">
            <Heart className={wishlist.has(product.id) ? "h-4 w-4 fill-pomegranate text-pomegranate" : "h-4 w-4"} />
          </button>
          <button type="button" onClick={() => compare.toggle(product.id)} className="border border-coal/15 p-2" aria-label="Toggle compare">
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
