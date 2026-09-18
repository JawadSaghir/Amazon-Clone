import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="panel p-6">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">Dashboard</p>
      <h1 className="mt-2 text-3xl font-black">Hello, {session?.user.name ?? "shopper"}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Tile title="Orders" href="/dashboard/orders" />
        <Tile title="Wishlist" href="/dashboard/wishlist" />
        <Tile title="Addresses" href="/dashboard/addresses" />
      </div>
    </div>
  );
}

function Tile({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="border border-coal/10 bg-paper p-5 font-black hover:bg-saffron/20">
      {title}
    </Link>
  );
}
