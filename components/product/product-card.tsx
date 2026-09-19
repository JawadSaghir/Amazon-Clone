"use client";

import { BarChart3, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
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
  const wishlist = useWishlistStore((state) => state);
  const compare = useCompareStore((state) => state);
  const discount = discountPercent(product.priceInr, product.mrpInr);
  const isWishlisted = mounted && wishlist.has(product.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <article className="panel grid overflow-hidden p-3 transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative aspect-square bg-white">
        <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-contain p-2" />
        {product.isDeal && <span className="absolute left-0 top-0 bg-pomegranate px-2 py-1 text-[11px] font-bold text-white">Limited time deal</span>}
      </Link>
      <div className="grid gap-2 pt-3">
        <div>
          <p className="text-xs text-coal/60">{product.brand}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-sm leading-snug hover:text-pomegranate hover:underline">
            {product.title}
          </Link>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-4 w-4 fill-saffron text-saffron" />
          <span className="text-indigoInk">{product.rating}</span>
          <span className="text-indigoInk">({product.reviewCount})</span>
        </div>
        <div>
          {discount > 0 && <p className="text-xs font-bold text-pomegranate">{discount}% off</p>}
          <p className="text-lg font-bold">{formatMoney(product.priceInr)}</p>
          <p className="text-xs text-coal/60">
            MRP <span className="line-through">{formatMoney(product.mrpInr)}</span> {discount}% off
          </p>
          <p className="mt-1 text-xs text-basil">FREE delivery</p>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <button type="button" onClick={() => add(product)} className="brass-button">
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
          <button type="button" onClick={() => wishlist.toggle(product.id)} className="border border-coal/15 p-2" aria-label="Toggle wishlist">
            <Heart className={isWishlisted ? "h-4 w-4 fill-pomegranate text-pomegranate" : "h-4 w-4"} />
          </button>
          <button type="button" onClick={() => compare.toggle(product.id)} className="border border-coal/15 p-2" aria-label="Toggle compare">
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
