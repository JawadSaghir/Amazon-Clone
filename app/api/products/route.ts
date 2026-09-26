import { NextResponse } from "next/server";

import { getProductResults, getProductsByIds } from "@/lib/catalog";

const MAX_IDS = 50;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ids = url.searchParams.get("ids");
  if (ids) {
    const products = await getProductsByIds([...new Set(ids.split(",").filter(Boolean))].slice(0, MAX_IDS));
    return NextResponse.json({ products, count: products.length });
  }

  const { products, count } = await getProductResults({
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    deal: url.searchParams.get("deal") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    limit: Number(url.searchParams.get("limit") ?? 24)
  });

  return NextResponse.json({ products, count });
}
