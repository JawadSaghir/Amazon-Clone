"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { useCartStore } from "@/components/providers/cart-store";
import { calculateSnapshotTotals } from "@/lib/checkout";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const { items, remove, setQuantity } = useCartStore();
  const totals = calculateSnapshotTotals(items.map((item) => ({ priceInr: item.product.priceInr, quantity: item.quantity })));

  if (items.length === 0) {
    return (
      <div className="page-shell py-16 text-center">
        <div className="panel mx-auto max-w-xl p-10">
          <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
          <p className="mt-3 text-muted">Start with a deal shelf or search the catalog.</p>
          <Link href="/search" className="brass-button mt-6">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell grid gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_360px]">
      <section className="card p-6">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Shopping cart</h1>
        <div className="mt-5 divide-y divide-line">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="grid gap-4 py-5 sm:grid-cols-[100px_1fr_auto]">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.images[0]} alt={product.title} className="h-full w-full object-contain p-2" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
                <Link href={`/products/${product.slug}`} className="mt-1 block text-base font-medium text-coal hover:text-pomegranate hover:underline">
                  {product.title}
                </Link>
                <p className="mt-1 text-sm font-semibold text-basil">In stock</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center overflow-hidden rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, Math.max(1, quantity - 1))}
                      className="flex h-8 w-8 items-center justify-center text-coal/70 hover:bg-paper"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-coal/70 hover:bg-paper"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button type="button" onClick={() => remove(product.id)} className="flex items-center gap-1.5 text-sm font-semibold text-pomegranate">
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-display text-lg font-semibold sm:text-right">{formatMoney(product.priceInr * quantity)}</p>
            </div>
          ))}
        </div>
        <Link href="/search" className="link-ink mt-4 inline-block text-sm">
          &larr; Continue shopping
        </Link>
      </section>
      <aside className="card h-fit p-6">
        <h2 className="font-display text-xl font-semibold">Order summary ({items.length} items)</h2>
        <SummaryRow label="Subtotal" value={totals.subtotalInr} />
        <SummaryRow label="Shipping" value={totals.shippingInr} />
        <SummaryRow label="Tax" value={totals.taxInr} />
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-sm font-semibold text-muted">Order total</p>
          <p className="font-display text-2xl font-semibold">{formatMoney(totals.totalInr)}</p>
        </div>
        <Link href="/checkout" className="brass-button mt-5 w-full">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4 text-sm">
      <span className="font-semibold text-muted">{label}</span>
      <span className="text-right font-semibold text-coal">{value === 0 ? "FREE" : formatMoney(value)}</span>
    </div>
  );
}
