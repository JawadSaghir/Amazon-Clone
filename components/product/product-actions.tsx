"use client";

import { Heart, Lock, ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { useRecentStore } from "@/components/providers/recent-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const add = useCartStore((state) => state.add);
  const wishlist = useWishlistStore((state) => state);
  const pushRecent = useRecentStore((state) => state.push);

  return (
    <aside className="rounded-lg border border-[#d5d9d9] bg-white p-4 shadow-panel">
      <p className="text-2xl font-normal">{formatMoney(product.priceInr)}</p>
      <p className="mt-3 text-sm">
        <span className="font-bold text-basil">FREE delivery</span> on eligible orders. Fast dispatch across India and Pakistan.
      </p>
      <p className="mt-3 text-lg font-medium text-basil">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
      <p className="mt-1 text-xs text-coal/65">Ships from and sold by {product.seller}</p>
      <label className="mt-4 block text-sm">
        Qty:
        <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="ml-2 rounded border border-[#d5d9d9] bg-slate-50 px-2 py-1 text-sm">
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
      <button
        type="button"
        onClick={() => {
          add(product, quantity);
          pushRecent(product.id);
          router.push("/checkout");
        }}
        className="ink-button mt-2 w-full"
      >
        <Zap className="h-4 w-4" />
        Buy now
      </button>
      <button type="button" onClick={() => wishlist.toggle(product.id)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-[#d5d9d9] bg-white px-4 py-2 text-sm font-bold hover:bg-slate-50">
        <Heart className={wishlist.has(product.id) ? "h-4 w-4 fill-saffron" : "h-4 w-4"} />
        Save to wishlist
      </button>
      <p className="mt-4 flex gap-2 text-xs leading-relaxed text-coal/60">
        <Lock className="h-4 w-4 shrink-0 text-indigoInk" />
        Secure test checkout. Final totals are recalculated on the server in INR and displayed with PKR estimates.
      </p>
    </aside>
  );
}
