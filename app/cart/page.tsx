"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/components/providers/cart-store";
import { calculateTotals } from "@/lib/checkout";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const { items, remove, setQuantity } = useCartStore();
  const totals = calculateTotals(items.map((item) => ({ productId: item.product.id, quantity: item.quantity })));

  if (items.length === 0) {
    return (
      <div className="page-shell py-16 text-center">
        <div className="panel mx-auto max-w-xl p-10">
          <h1 className="text-3xl font-black">Your cart is empty</h1>
          <p className="mt-3 text-coal/60">Start with a deal shelf or search the catalog.</p>
          <Link href="/search" className="brass-button mt-6">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell grid gap-5 py-6 lg:grid-cols-[1fr_320px]">
      <section className="bg-white p-5">
        <h1 className="text-3xl font-normal">Shopping Cart</h1>
        <p className="border-b border-[#d5d9d9] pb-2 text-right text-sm text-coal/60">Price</p>
        <div className="mt-5 divide-y divide-coal/10">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="grid gap-4 py-4 sm:grid-cols-[120px_1fr_auto]">
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image src={product.images[0]} alt={product.title} fill sizes="120px" className="object-cover" />
              </div>
              <div>
                <Link href={`/products/${product.slug}`} className="text-lg hover:text-pomegranate hover:underline">
                  {product.title}
                </Link>
                <p className="mt-1 text-sm text-basil">In stock</p>
                <p className="mt-2 font-bold">{formatMoney(product.priceInr)}</p>
                <div className="mt-3 flex items-center gap-3">
                  <select value={quantity} onChange={(event) => setQuantity(product.id, Number(event.target.value))} className="rounded border border-[#d5d9d9] bg-slate-50 px-2 py-1 text-sm shadow-brass">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index + 1}>{index + 1}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => remove(product.id)} className="flex items-center gap-1 text-sm font-bold text-pomegranate">
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-black">{formatMoney(product.priceInr * quantity)}</p>
            </div>
          ))}
        </div>
      </section>
      <aside className="h-fit rounded-sm border border-[#d5d9d9] bg-white p-5">
        <h2 className="text-xl font-bold">Subtotal ({items.length} items)</h2>
        <SummaryRow label="Subtotal" value={totals.subtotalInr} />
        <SummaryRow label="Shipping" value={totals.shippingInr} />
        <SummaryRow label="Tax" value={totals.taxInr} />
        <div className="mt-4 border-t border-coal/10 pt-4">
          <p className="text-sm font-bold text-coal/60">Order total</p>
          <p className="text-xl font-bold">{formatMoney(totals.totalInr)}</p>
        </div>
        <Link href="/checkout" className="brass-button mt-5 w-full">
          Checkout
        </Link>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4 text-sm">
      <span className="font-bold text-coal/60">{label}</span>
      <span className="text-right font-black">{value === 0 ? "FREE" : formatMoney(value)}</span>
    </div>
  );
}
