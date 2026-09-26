"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { useDemoSession } from "@/components/providers/session-store";
import { calculateSnapshotTotals } from "@/lib/checkout";
import { formatMoney } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session, status } = useDemoSession();
  const router = useRouter();
  const { items, clear } = useCartStore();
  const [couponCode, setCouponCode] = useState("8XWELCOME");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const totals = calculateSnapshotTotals(items.map((item) => ({ priceInr: item.product.priceInr, quantity: item.quantity })), couponCode);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
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
        setSubmitting(false);
        return;
      }
      clear();
      setMessage(`Order ${data.orderId} created. Redirecting to confirmation...`);
      router.push(`${data.checkoutUrl}?orderId=${encodeURIComponent(data.orderId)}`);
    } catch {
      setMessage("Checkout failed. Please try again.");
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="page-shell py-16 text-center">
        <div className="panel mx-auto max-w-xl p-10">
          <h1 className="font-display text-3xl font-semibold">Loading checkout...</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page-shell py-16 text-center">
        <div className="panel mx-auto max-w-xl p-10">
          <h1 className="font-display text-3xl font-semibold">Sign in to checkout</h1>
          <Link href="/login?callbackUrl=/checkout" className="brass-button mt-6">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-shell py-16 text-center">
        <div className="panel mx-auto max-w-xl p-10">
          <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
          <p className="mt-3 text-muted">Add an item before creating a test order.</p>
          <Link href="/search" className="brass-button mt-6">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-center gap-3 text-sm font-semibold text-muted">
        <Lock className="h-4 w-4" />
        Secure checkout
      </div>
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card grid gap-4 p-6">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Checkout</h1>
          <h2 className="border-b border-line pb-3 text-lg font-semibold text-coal">1. Delivery address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input suppressHydrationWarning name="fullName" required defaultValue="Demo Customer" placeholder="Full name" className="rounded-xl border border-line bg-paper p-3 text-sm outline-none focus:border-amazonOrange sm:col-span-2" />
            <input suppressHydrationWarning name="phone" required defaultValue="03001234567" placeholder="Phone" className="rounded-xl border border-line bg-paper p-3 text-sm outline-none focus:border-amazonOrange sm:col-span-2" />
            <input suppressHydrationWarning name="line1" required defaultValue="12 Market Road" placeholder="Address line" className="rounded-xl border border-line bg-paper p-3 text-sm outline-none focus:border-amazonOrange sm:col-span-2" />
            <input suppressHydrationWarning name="city" required defaultValue="Lahore" placeholder="City" className="rounded-xl border border-line bg-paper p-3 text-sm outline-none focus:border-amazonOrange" />
            <input suppressHydrationWarning name="region" required defaultValue="Punjab" placeholder="State / Province" className="rounded-xl border border-line bg-paper p-3 text-sm outline-none focus:border-amazonOrange" />
            <input suppressHydrationWarning name="postalCode" required defaultValue="54000" placeholder="Postal code" className="rounded-xl border border-line bg-paper p-3 text-sm outline-none focus:border-amazonOrange" />
            <select suppressHydrationWarning name="country" defaultValue="Pakistan" className="rounded-xl border border-line bg-paper p-3 text-sm outline-none focus:border-amazonOrange">
              <option>India</option>
              <option>Pakistan</option>
            </select>
          </div>
        </section>
        <aside className="card h-fit p-6">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <label className="mt-4 block text-sm font-semibold text-inkSoft">
            Coupon
            <input
              suppressHydrationWarning
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper p-2.5 text-sm outline-none focus:border-amazonOrange"
            />
          </label>
          <Summary label="Subtotal" value={totals.subtotalInr} />
          <Summary label="Discount" value={-totals.discountInr} />
          <Summary label="Shipping" value={totals.shippingInr} />
          <Summary label="Tax" value={totals.taxInr} />
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-sm font-semibold text-muted">Order total</p>
            <p className="font-display text-2xl font-semibold text-coal">{formatMoney(totals.totalInr)}</p>
          </div>
          <button suppressHydrationWarning type="submit" className="brass-button mt-5 w-full disabled:cursor-wait disabled:opacity-70" disabled={items.length === 0 || submitting}>
            {submitting ? "Creating order..." : "Place order"}
          </button>
          {message && <p className="mt-4 text-sm font-semibold text-basil">{message}</p>}
          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
            By placing your order you agree to 8x Bazaar&rsquo;s Conditions of Use and Privacy Notice.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-3 flex justify-between gap-4 text-sm">
      <span className="font-semibold text-muted">{label}</span>
      <span className="text-right font-semibold text-coal">{formatMoney(value)}</span>
    </div>
  );
}
