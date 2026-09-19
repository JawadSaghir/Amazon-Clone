"use client";

import { ChevronDown, Grid2X2, MapPin, Menu, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { useCartStore } from "@/components/providers/cart-store";
import { useDemoSession } from "@/components/providers/session-store";
import { categories } from "@/lib/catalog";

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const storedCartCount = useCartStore((state) => state.count());
  const cartCount = mounted ? storedCartCount : 0;
  const { data: session } = useDemoSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setMounted(true);
  }, []);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  async function signOut() {
    const response = await fetch("/api/auth/csrf");
    const { csrfToken } = (await response.json()) as { csrfToken: string };
    await fetch("/api/auth/signout?json=true", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken, callbackUrl: "/", json: "true" })
    });
    window.location.assign("/");
  }

  const SearchForm = ({ compact = false }: { compact?: boolean }) => (
    <form
      onSubmit={onSearch}
      className={compact ? "flex h-11 flex-1 overflow-hidden rounded-[4px] border-2 border-transparent bg-white focus-within:border-amazonOrange" : "hidden h-10 flex-1 overflow-hidden rounded-[4px] border-2 border-transparent bg-white focus-within:border-amazonOrange md:flex"}
    >
      <select aria-label="Search category" className="w-16 border-r border-slate-300 bg-slate-100 px-1 text-xs font-semibold text-slate-700 outline-none">
        <option>All</option>
        {categories.slice(0, 5).map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search 8x Bazaar"
        className="min-w-0 flex-1 px-3 text-sm text-coal outline-none"
      />
      <button type="submit" className="flex h-full w-12 items-center justify-center bg-saffron text-coal hover:bg-[#f3a847]" aria-label="Search">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 bg-amazonNavy text-white shadow-sm">
      <div className="flex h-[60px] w-full items-center gap-2 px-3 py-[5px] sm:gap-3">
        <Link href="/" className="group flex h-11 shrink-0 items-center rounded-sm border border-transparent px-1 hover:border-white" aria-label="8x Bazaar home">
          <span className="relative text-[34px] font-black leading-none tracking-[-2px]">
            8x
            <span className="absolute -bottom-1 left-1 h-[3px] w-9 rounded-full bg-amazonOrange transition group-hover:w-11" />
          </span>
          <span className="mb-[-8px] ml-0.5 text-[11px] font-black text-saffron">bazaar</span>
        </Link>

        <div className="hidden h-11 max-w-[150px] items-center rounded-sm border border-transparent px-2 text-xs leading-tight hover:border-white lg:flex">
          <MapPin className="mr-1 h-4 w-4 shrink-0" />
          <span>
            <span className="block text-[12px] text-slate-300">
            Deliver to
            </span>
            <span className="block truncate text-[14px] font-bold text-white">Pakistan</span>
          </span>
        </div>

        <SearchForm />

        <nav className="ml-auto flex h-11 items-center gap-1 text-sm">
          <Link href="/search" className="hidden h-full items-center gap-1 rounded-sm border border-transparent px-2 hover:border-white lg:flex">
            <span className="text-lg">▦</span>
            <span className="font-bold">EN</span>
            <ChevronDown className="h-3 w-3" />
          </Link>
          <Link href="/dashboard" className="hidden h-full rounded-sm border border-transparent px-2 py-1 leading-tight hover:border-white sm:block">
            <span className="block text-[11px] font-semibold text-white">Hello, {session?.user?.name?.split(" ")[0] ?? "sign in"}</span>
            <span className="flex items-center gap-1 text-sm font-black">
              Account & Lists
              <ChevronDown className="h-3 w-3" />
            </span>
          </Link>
          <Link href="/dashboard/orders" className="hidden h-full rounded-sm border border-transparent px-2 py-1 leading-tight hover:border-white lg:block">
            <span className="block text-[11px] font-semibold text-white">Returns</span>
            <span className="block text-sm font-black">& Orders</span>
          </Link>
          {session ? (
            <button type="button" onClick={signOut} className="hidden h-full rounded-sm border border-transparent px-2 py-1 text-xs font-bold hover:border-white xl:block">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="hidden h-full rounded-sm border border-transparent px-2 py-1 text-xs font-bold hover:border-white xl:block">
              Sign in
            </Link>
          )}
          <Link href="/cart" className="relative flex h-full items-end gap-1 rounded-sm border border-transparent px-2 py-1 font-black hover:border-white">
            <div className="relative">
              <ShoppingCart className="h-8 w-8" />
              <span className="absolute -top-1 left-4 min-w-5 rounded-full bg-amazonOrange px-1 text-center text-xs text-coal">{cartCount}</span>
            </div>
            <span className="hidden pb-1 sm:inline">Cart</span>
          </Link>
        </nav>
      </div>

      <div className="px-2 pb-2 md:hidden">
        <SearchForm compact />
      </div>

      <div className="h-[39px] bg-amazonBlue text-white">
        <div className="flex h-full w-full gap-1 overflow-x-auto px-3 text-[14px]">
          <Link href="/search" className="flex shrink-0 items-center gap-1 rounded-sm border border-transparent px-2 py-2 font-bold hover:border-white">
            <Menu className="h-4 w-4" />
            All
          </Link>
          {["Bazaar Video", "Coupons", "Customer Service", "Today's Deals", "Registry", "Gift Cards", "Sell"].map((item) => (
            <Link key={item} href={item === "Today's Deals" ? "/search?deal=flash" : "/search"} className="shrink-0 rounded-sm border border-transparent px-2 py-2 font-semibold hover:border-white">
              {item}
            </Link>
          ))}
          <Link href="/compare" className="ml-auto hidden shrink-0 items-center gap-1 rounded-sm border border-transparent px-2 py-2 font-semibold hover:border-white lg:flex">
            <Grid2X2 className="h-4 w-4" />
            Compare
          </Link>
        </div>
      </div>
    </header>
  );
}
