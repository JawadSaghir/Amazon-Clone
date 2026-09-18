import { formatMoney } from "@/lib/utils";

const demoOrders = [
  { id: "8X-1024", status: "PAID", totalInr: 28740, items: "Orion X1 5G Phone, Velvet Bean Coffee" },
  { id: "8X-1025", status: "SHIPPED", totalInr: 1199, items: "Terra Firm Yoga Mat" }
];

export default function OrdersPage() {
  return (
    <div className="panel p-6">
      <h1 className="text-3xl font-black">Orders</h1>
      <div className="mt-5 grid gap-3">
        {demoOrders.map((order) => (
          <div key={order.id} className="border border-coal/10 bg-paper p-4">
            <p className="font-black">{order.id}</p>
            <p className="text-sm text-coal/60">{order.items}</p>
            <p className="mt-2 font-bold">
              {order.status} · {formatMoney(order.totalInr)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
