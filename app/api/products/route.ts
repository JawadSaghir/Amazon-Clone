import { NextResponse } from "next/server";

import { getProducts } from "@/lib/catalog";

export function GET(request: Request) {
  const url = new URL(request.url);
  const products = getProducts({
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    deal: url.searchParams.get("deal") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined
  });

  return NextResponse.json({ products, count: products.length });
}
