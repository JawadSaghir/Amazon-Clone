"use client";

import { ChevronDown, MapPin, Menu, Search, ShoppingCart } from "lucide-react";
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
      className={
        compact
          ? "glass-input flex h-12 flex-1 overflow-hidden rounded-full focus-within:border-amazonOrange"
          : "glass-input hidden h-12 flex-1 overflow-hidden rounded-full pl-1 focus-within:border-amazonOrange md:flex"
      }
    >
      <select suppressHydrationWarning aria-label="Search category" className="hidden w-24 rounded-full bg-transparent px-3 text-xs font-semibold text-coal/70 outline-none sm:block">
        <option>All</option>
        {categories.slice(0, 5).map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <input
        suppressHydrationWarning
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products, brands and categories"
        className="min-w-0 flex-1 bg-transparent px-3 text-sm text-coal outline-none placeholder:text-coal/40"
      />
      <button suppressHydrationWarning type="submit" className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coal text-white hover:bg-black" aria-label="Search">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );

  return (
    <header className="glass-header sticky top-0 z-50 border-b border-line">
      <div className="flex h-[84px] w-full items-center gap-6 px-4 sm:px-8">
        <Link href="/" className="flex shrink-0 items-baseline gap-0.5 font-display text-[26px] font-bold text-coal" aria-label="8x Bazaar home">
          8x<span className="text-amazonOrange">bazaar</span>
        </Link>

        <div className="hidden h-11 max-w-[150px] items-center gap-1.5 rounded-full px-2 text-xs leading-tight text-coal/70 hover:text-coal lg:flex">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>
            <span className="block text-[11px] text-coal/50">Deliver to</span>
            <span className="block truncate text-[13px] font-bold text-coal">Lahore, PK</span>
          </span>
        </div>

        <SearchForm />

        <nav className="ml-auto flex h-11 items-center gap-2 text-sm">
          <Link href="/dashboard" className="hidden h-full flex-col justify-center rounded-xl px-3 leading-tight hover:bg-paper sm:flex">
            <span className="block text-[11px] font-semibold text-coal/50">Hello, {session?.user?.name?.split(" ")[0] ?? "sign in"}</span>
            <span className="flex items-center gap-1 text-[13.5px] font-bold text-coal">
              Account
              <ChevronDown className="h-3 w-3" />
            </span>
          </Link>
          <Link href="/dashboard/orders" className="hidden h-full flex-col justify-center rounded-xl px-3 leading-tight hover:bg-paper lg:flex">
            <span className="block text-[11px] font-semibold text-coal/50">Track</span>
            <span className="block text-[13.5px] font-bold text-coal">Orders</span>
          </Link>
          {session ? (
            <button suppressHydrationWarning type="button" onClick={signOut} className="hidden h-full rounded-xl px-3 text-[13px] font-bold text-coal/70 hover:bg-paper xl:block">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="hidden h-full items-center rounded-xl px-3 text-[13px] font-bold text-coal/70 hover:bg-paper xl:flex">
              Sign in
            </Link>
          )}
          <Link href="/cart" className="relative flex h-full items-center gap-2 rounded-xl px-3 font-bold text-coal hover:bg-paper">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amazonOrange px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            </div>
            <span className="hidden text-[13.5px] sm:inline">Cart</span>
          </Link>
        </nav>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchForm compact />
      </div>

      <nav className="hidden h-[52px] items-center gap-1 border-t border-line px-4 sm:px-8 md:flex">
        <Link href="/search" className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[13.5px] font-bold text-coal hover:bg-paper">
          <Menu className="h-4 w-4" />
          All categories
        </Link>
        {categories.slice(0, 7).map((category) => (
          <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="shrink-0 rounded-full px-3 py-2 text-[13.5px] font-semibold text-coal/70 hover:bg-paper hover:text-coal">
            {category}
          </Link>
        ))}
        <Link href="/search?deal=flash" className="ml-auto shrink-0 rounded-full px-3 py-2 text-[13.5px] font-bold text-amazonOrangeDark hover:bg-accentTint">
          Today&rsquo;s deals
        </Link>
      </nav>
    </header>
  );
}
