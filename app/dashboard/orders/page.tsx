"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatMoney } from "@/lib/utils";

type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalInr: number;
  createdAt: string;
  items: { id: string; title: string; quantity: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [message, setMessage] = useState("Loading orders...");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        const data = (await response.json()) as { orders?: OrderSummary[]; message?: string };
        if (!response.ok) {
          setMessage(data.message ?? "Unable to load orders.");
          return;
        }

        setOrders(data.orders ?? []);
        setMessage("");
      } catch {
        setMessage("Unable to load orders.");
      }
    }

    void loadOrders();
  }, []);

  return (
    <div className="panel p-6">
      <h1 className="text-3xl font-black">Orders</h1>
      {message && <p className="mt-4 text-sm font-bold text-coal/60">{message}</p>}
      {!message && orders.length === 0 && (
        <div className="mt-5 border border-coal/10 bg-paper p-4">
          <p className="font-black">No orders yet</p>
          <p className="mt-1 text-sm text-coal/60">Create a test order from checkout to see it here.</p>
          <Link href="/search" className="brass-button mt-4">
            Start shopping
          </Link>
        </div>
      )}
      <div className="mt-5 grid gap-3">
        {orders.map((order) => (
          <div key={order.id} className="border border-coal/10 bg-paper p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black">{order.orderNumber}</p>
                <p className="text-sm text-coal/60">
                  {order.items.map((item) => `${item.title} x ${item.quantity}`).join(", ")}
                </p>
              </div>
              <p className="text-sm font-bold text-coal/60">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="mt-2 font-bold">
              {order.status} / {order.paymentStatus} · {formatMoney(order.totalInr)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
