import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getProductById } from "@/lib/catalog";
import { calculateTotals } from "@/lib/checkout";
import { checkoutSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid checkout payload." }, { status: 400 });
  }
  const hasUnknownProduct = parsed.data.items.some((item) => !getProductById(item.productId));
  if (hasUnknownProduct) {
    return NextResponse.json({ message: "One or more cart items are no longer available." }, { status: 400 });
  }

  const totals = calculateTotals(parsed.data.items, parsed.data.couponCode);
  const orderId = `8X-${Date.now().toString().slice(-6)}`;

  return NextResponse.json({
    orderId,
    totals,
    settlementCurrency: "INR",
    checkoutUrl: "/checkout/success"
  });
}
