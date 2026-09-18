import { catalog } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default function AdminPage() {
  const revenue = 1462380;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Metric label="Revenue" value={formatMoney(revenue)} />
      <Metric label="Orders" value="128" />
      <Metric label="Products" value={String(catalog.length)} />
      <Metric label="Users" value="2,408" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-basil">{label}</p>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}
