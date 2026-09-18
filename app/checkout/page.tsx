"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { calculateTotals } from "@/lib/checkout";
import { formatMoney } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, clear } = useCartStore();
  const [couponCode, setCouponCode] = useState("8XWELCOME");
  const [message, setMessage] = useState("");
  const totals = calculateTotals(items.map((item) => ({ productId: item.product.id, quantity: item.quantity })), couponCode);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        couponCode,
        address: {
          fullName: String(form.get("fullName")),
          phone: String(form.get("phone")),
          line1: String(form.get("line1")),
          city: String(form.get("city")),
          region: String(form.get("region")),
          postalCode: String(form.get("postalCode")),
          country: form.get("country")
        }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? "Checkout failed.");
      return;
    }
    clear();
    setMessage(`Order ${data.orderId} created. Test checkout URL: ${data.checkoutUrl}`);
  }

  if (!session) {
    return (
      <div className="page-shell py-16 text-center">
        <div className="panel mx-auto max-w-xl p-10">
          <h1 className="text-3xl font-black">Sign in to checkout</h1>
          <Link href="/login?callbackUrl=/checkout" className="brass-button mt-6">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="page-shell grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
      <section className="panel grid gap-4 p-5">
        <h1 className="text-3xl font-black">Checkout</h1>
        <input name="fullName" required placeholder="Full name" className="border border-coal/15 bg-white p-3" />
        <input name="phone" required placeholder="Phone" className="border border-coal/15 bg-white p-3" />
        <input name="line1" required placeholder="Address line" className="border border-coal/15 bg-white p-3" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="city" required placeholder="City" className="border border-coal/15 bg-white p-3" />
          <input name="region" required placeholder="State / Province" className="border border-coal/15 bg-white p-3" />
          <input name="postalCode" required placeholder="Postal code" className="border border-coal/15 bg-white p-3" />
          <select name="country" className="border border-coal/15 bg-white p-3">
            <option>India</option>
            <option>Pakistan</option>
          </select>
        </div>
      </section>
      <aside className="panel h-fit p-5">
        <h2 className="text-xl font-black">Review order</h2>
        <label className="mt-4 block text-sm font-bold">
          Coupon
          <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} className="mt-1 w-full border border-coal/15 bg-white p-3" />
        </label>
        <Summary label="Subtotal" value={totals.subtotalInr} />
        <Summary label="Discount" value={-totals.discountInr} />
        <Summary label="Shipping" value={totals.shippingInr} />
        <Summary label="Tax" value={totals.taxInr} />
        <div className="mt-4 border-t border-coal/10 pt-4">
          <p className="text-sm font-bold text-coal/60">Total</p>
          <p className="text-2xl font-black">{formatMoney(totals.totalInr)}</p>
        </div>
        <button type="submit" className="brass-button mt-5 w-full" disabled={items.length === 0}>
          Create test order
        </button>
        {message && <p className="mt-4 text-sm font-bold text-basil">{message}</p>}
      </aside>
    </form>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-3 flex justify-between gap-4 text-sm">
      <span className="font-bold text-coal/60">{label}</span>
      <span className="text-right font-black">{formatMoney(value)}</span>
    </div>
  );
}
