"use client";

import { Heart, Lock, ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { useRecentStore } from "@/components/providers/recent-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [buying, setBuying] = useState(false);
  const router = useRouter();
  const add = useCartStore((state) => state.add);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlistedValue = useWishlistStore((state) => state.ids.includes(product.id));
  const pushRecent = useRecentStore((state) => state.push);
  const isWishlisted = mounted && isWishlistedValue;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="card h-fit p-5">
      <p className="font-display text-2xl font-semibold text-coal">{formatMoney(product.priceInr)}</p>
      <p className="mt-3 text-sm text-inkSoft">
        <span className="font-semibold text-basil">FREE delivery</span> on eligible orders. Fast dispatch across India and Pakistan.
      </p>
      <p className="mt-3 text-sm font-semibold text-basil">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
      <p className="mt-1 text-xs text-muted">Ships from and sold by {product.seller}</p>
      <label className="mt-4 block text-sm font-medium text-inkSoft">
        Qty:
        <select
          suppressHydrationWarning
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="ml-2 rounded-lg border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-amazonOrange"
        >
          {Array.from({ length: Math.min(10, product.stock) }).map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => {
          add(product, quantity);
          pushRecent(product.id);
        }}
        className="brass-button mt-4 w-full"
      >
        <ShoppingBag className="h-4 w-4" />
        Add to cart
      </button>
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => {
          setBuying(true);
          add(product, quantity);
          pushRecent(product.id);
          router.push("/checkout");
        }}
        className="ink-button mt-2 w-full disabled:cursor-wait disabled:opacity-70"
        disabled={buying}
      >
        <Zap className="h-4 w-4" />
        {buying ? "Opening checkout..." : "Buy now"}
      </button>
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => toggleWishlist(product.id)}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-coal hover:border-coal/40"
      >
        <Heart className={isWishlisted ? "h-4 w-4 fill-pomegranate text-pomegranate" : "h-4 w-4"} />
        Save to wishlist
      </button>
      <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
        <Lock className="h-4 w-4 shrink-0 text-indigoInk" />
        Secure test checkout. Final totals are recalculated on the server and shown in PKR.
      </p>
    </aside>
  );
}
