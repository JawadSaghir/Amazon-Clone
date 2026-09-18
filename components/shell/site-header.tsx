"use client";

import { Heart, LayoutDashboard, Search, ShieldCheck, ShoppingCart } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { categories } from "@/lib/catalog";

export function SiteHeader() {
  const cartCount = useCartStore((state) => state.count());
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-coal/10 bg-paper/95 backdrop-blur">
      <div className="page-shell flex items-center gap-4 py-3">
        <Link href="/" className="flex items-end gap-1" aria-label="8x Marketplace home">
          <span className="bg-coal px-2 py-1 text-2xl font-black tracking-tight text-saffron">8x</span>
          <span className="pb-1 text-sm font-black uppercase tracking-[0.22em] text-coal">market</span>
        </Link>

        <form onSubmit={onSearch} className="hidden h-11 flex-1 overflow-hidden border border-coal/20 bg-white md:flex">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search phones, coffee, kurtas, kitchen..."
            className="min-w-0 flex-1 px-4 outline-none"
          />
          <button type="submit" className="brass-button h-full px-5" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="hidden items-center gap-1 font-bold text-coal hover:text-indigoInk sm:flex">
            <LayoutDashboard className="h-4 w-4" />
            Account
          </Link>
          <Link href="/dashboard/wishlist" className="hidden items-center gap-1 font-bold text-coal hover:text-indigoInk sm:flex">
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="hidden items-center gap-1 font-bold text-coal hover:text-indigoInk lg:flex">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
          {session ? (
            <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="hidden font-bold text-coal hover:text-indigoInk lg:block">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="hidden font-bold text-coal hover:text-indigoInk lg:block">
              Sign in
            </Link>
          )}
          <Link href="/cart" className="relative flex items-center gap-1 bg-coal px-3 py-2 font-black text-paper">
            <ShoppingCart className="h-5 w-5" />
            <span>{cartCount}</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-coal/10 bg-coal text-paper">
        <div className="page-shell flex gap-1 overflow-x-auto py-2 text-xs font-bold">
          <Link href="/search" className="shrink-0 px-3 py-1 hover:bg-white/10">
            All
          </Link>
          {categories.map((category) => (
            <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="shrink-0 px-3 py-1 hover:bg-white/10">
              {category}
            </Link>
          ))}
          <Link href="/search?deal=flash" className="shrink-0 px-3 py-1 text-saffron hover:bg-white/10">
            Deals
          </Link>
          <Link href="/compare" className="shrink-0 px-3 py-1 hover:bg-white/10">
            Compare
          </Link>
        </div>
      </div>
    </header>
  );
}
