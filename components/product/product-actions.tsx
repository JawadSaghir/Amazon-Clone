"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { useRecentStore } from "@/components/providers/recent-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const add = useCartStore((state) => state.add);
  const wishlist = useWishlistStore((state) => state);
  const pushRecent = useRecentStore((state) => state.push);

  return (
    <aside className="panel p-5">
      <p className="text-sm font-bold text-coal/60">Buy box</p>
      <p className="mt-2 text-2xl font-black">{formatMoney(product.priceInr)}</p>
      <p className="mt-2 text-sm font-bold text-basil">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
      <label className="mt-4 block text-sm font-bold">
        Quantity
        <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-1 w-full border border-coal/15 bg-white p-2">
          {Array.from({ length: Math.min(10, product.stock) }).map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>
      <button
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
      <button type="button" onClick={() => wishlist.toggle(product.id)} className="ink-button mt-2 w-full">
        <Heart className={wishlist.has(product.id) ? "h-4 w-4 fill-saffron" : "h-4 w-4"} />
        Save to wishlist
      </button>
      <p className="mt-4 text-xs leading-relaxed text-coal/60">Secure test checkout. Final totals are recalculated on the server in INR and displayed with PKR estimates.</p>
    </aside>
  );
}
