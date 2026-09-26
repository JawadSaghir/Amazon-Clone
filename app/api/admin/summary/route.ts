import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getProductCount } from "@/lib/catalog";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const productCount = await getProductCount();

  return NextResponse.json({
    revenueInr: 1462380,
    orderCount: 128,
    productCount,
    userCount: 2408
  });
}
