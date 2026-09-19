"use client";

import { Heart, LayoutDashboard, MapPin, Menu, Search, ShieldCheck, ShoppingCart } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-amazonNavy text-white shadow-sm">
      <div className="mx-auto flex max-w-amazon items-center gap-2 px-2 py-2 sm:gap-3">
        <Link href="/" className="flex shrink-0 items-end rounded-sm border border-transparent px-2 py-1 hover:border-white" aria-label="8x Marketplace home">
          <span className="text-3xl font-black tracking-tight leading-none">8x</span>
          <span className="mb-0.5 text-sm font-bold text-saffron">market</span>
        </Link>

        <div className="hidden max-w-[150px] rounded-sm border border-transparent px-2 py-1 text-xs leading-tight hover:border-white lg:block">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="h-3 w-3" />
            Deliver to
          </span>
          <span className="block truncate font-bold text-white">India & Pakistan</span>
        </div>

        <form onSubmit={onSearch} className="hidden h-10 flex-1 overflow-hidden rounded-[4px] border-2 border-transparent bg-white focus-within:border-amazonOrange md:flex">
          <select aria-label="Search category" className="w-14 border-r border-slate-300 bg-slate-100 px-1 text-xs font-semibold text-slate-700 outline-none">
            <option>All</option>
            {categories.slice(0, 5).map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 8x Marketplace"
            className="min-w-0 flex-1 px-3 text-sm text-coal outline-none"
          />
          <button type="submit" className="flex h-full w-12 items-center justify-center bg-saffron text-coal hover:bg-[#f3a847]" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="hidden rounded-sm border border-transparent px-2 py-1 leading-tight hover:border-white sm:block">
            <span className="block text-[11px] text-slate-300">Hello, {session?.user.name?.split(" ")[0] ?? "sign in"}</span>
            <span className="flex items-center gap-1 text-sm font-bold">
            <LayoutDashboard className="h-4 w-4" />
              Account
            </span>
          </Link>
          <Link href="/dashboard/wishlist" className="hidden rounded-sm border border-transparent px-2 py-1 font-bold hover:border-white xl:flex">
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="hidden rounded-sm border border-transparent px-2 py-1 font-bold hover:border-white lg:flex">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
          {session ? (
            <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="hidden rounded-sm border border-transparent px-2 py-1 font-bold hover:border-white lg:block">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="hidden rounded-sm border border-transparent px-2 py-1 font-bold hover:border-white lg:block">
              Sign in
            </Link>
          )}
          <Link href="/cart" className="relative flex items-end gap-1 rounded-sm border border-transparent px-2 py-1 font-black hover:border-white">
            <div className="relative">
              <ShoppingCart className="h-8 w-8" />
              <span className="absolute -top-1 left-4 min-w-5 rounded-full bg-amazonOrange px-1 text-center text-xs text-coal">{cartCount}</span>
            </div>
            <span className="hidden pb-1 sm:inline">Cart</span>
          </Link>
        </nav>
      </div>

      <div className="bg-amazonBlue text-white">
        <div className="mx-auto flex max-w-amazon gap-0 overflow-x-auto px-2 text-[13px]">
          <Link href="/search" className="flex shrink-0 items-center gap-1 rounded-sm border border-transparent px-2 py-1.5 font-bold hover:border-white">
            <Menu className="h-4 w-4" />
            All
          </Link>
          {categories.map((category) => (
            <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="shrink-0 rounded-sm border border-transparent px-2 py-1.5 hover:border-white">
              {category}
            </Link>
          ))}
          <Link href="/search?deal=flash" className="shrink-0 rounded-sm border border-transparent px-2 py-1.5 text-saffron hover:border-white">
            Today&apos;s Deals
          </Link>
          <Link href="/compare" className="shrink-0 rounded-sm border border-transparent px-2 py-1.5 hover:border-white">
            Compare
          </Link>
        </div>
      </div>
    </header>
  );
}
