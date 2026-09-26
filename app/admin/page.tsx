import { getProductCount } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default async function AdminPage() {
  const revenue = 1462380;
  const productCount = await getProductCount();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Metric label="Revenue" value={formatMoney(revenue)} />
      <Metric label="Orders" value="128" />
      <Metric label="Products" value={String(productCount)} />
      <Metric label="Users" value="2,408" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-basil">{label}</p>
      <p className="mt-3 font-display text-2xl font-semibold text-coal">{value}</p>
    </div>
  );
}
