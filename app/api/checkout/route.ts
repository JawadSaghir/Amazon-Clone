import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getApiSessionUser } from "@/lib/api-session";
import { getProductById } from "@/lib/catalog";
import { calculateTotals } from "@/lib/checkout";
import { createCheckoutOrder, resolveCheckoutUser } from "@/lib/orders";
import { checkoutSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const sessionUser = await getApiSessionUser(request);
  if (!sessionUser) {
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

  const user = await resolveCheckoutUser({
    email: sessionUser.email,
    name: sessionUser.name,
    role: sessionUser.role
  });
  if (!user) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const totals = calculateTotals(parsed.data.items, parsed.data.couponCode);
  const order = await createCheckoutOrder({
    user,
    items: parsed.data.items,
    totals,
    address: parsed.data.address
  });

  return NextResponse.json({
    orderId: order.id,
    totals,
    settlementCurrency: "INR",
    checkoutUrl: "/checkout/success"
  });
}
