"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { formatMoney } from "@/lib/utils";

type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalInr: number;
  createdAt: string;
  items: { id: string; title: string; quantity: number; unitPriceInr: number }[];
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessShell title="Loading order..." />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [message, setMessage] = useState("Loading your order...");

  useEffect(() => {
    if (!orderId) {
      setMessage("Order ID is missing.");
      return;
    }
    const requestedOrderId = orderId;

    async function loadOrder() {
      try {
        const response = await fetch(`/api/orders?orderId=${encodeURIComponent(requestedOrderId)}`, { cache: "no-store" });
        const data = (await response.json()) as { orders?: OrderSummary[]; message?: string };
        if (!response.ok) {
          setMessage(data.message ?? "Unable to load this order.");
          return;
        }

        const foundOrder = data.orders?.[0] ?? null;
        setOrder(foundOrder);
        setMessage(foundOrder ? "" : "Order not found.");
      } catch {
        setMessage("Unable to load this order.");
      }
    }

    void loadOrder();
  }, [orderId]);

  if (!order) {
    return <SuccessShell title={message} />;
  }

  return (
    <div className="page-shell py-16">
      <div className="panel mx-auto max-w-2xl p-8">
        <p className="badge badge-basil w-fit">Order created</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">{order.orderNumber}</h1>
        <p className="mt-3 text-muted">
          Your demo order is saved and ready for test payment review.
        </p>
        <div className="mt-6 grid gap-3 rounded-xl border border-line bg-paper p-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.title} x {item.quantity}
              </span>
              <span className="font-semibold">{formatMoney(item.unitPriceInr * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-line pt-3 text-right font-display text-xl font-semibold text-pomegranate">
            {formatMoney(order.totalInr)}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/orders" className="brass-button">
            View orders
          </Link>
          <Link href="/search" className="ink-button">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuccessShell({ title }: { title: string }) {
  return (
    <div className="page-shell py-16 text-center">
      <div className="panel mx-auto max-w-xl p-10">
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <Link href="/dashboard/orders" className="brass-button mt-6">
          View orders
        </Link>
      </div>
    </div>
  );
}
