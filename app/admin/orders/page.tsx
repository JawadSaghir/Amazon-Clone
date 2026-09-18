import { formatMoney } from "@/lib/utils";

const orders = [
  ["8X-1024", "PAID", 28740],
  ["8X-1025", "SHIPPED", 1199],
  ["8X-1026", "PACKING", 64990]
];

export default function AdminOrdersPage() {
  return (
    <div className="panel p-5">
      <h1 className="text-3xl font-black">Orders</h1>
      <div className="mt-5 grid gap-3">
        {orders.map(([id, status, total]) => (
          <div key={id} className="grid grid-cols-3 border border-coal/10 bg-paper p-4">
            <p className="font-black">{id}</p>
            <p>{status}</p>
            <p className="text-right font-black">{formatMoney(Number(total))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
