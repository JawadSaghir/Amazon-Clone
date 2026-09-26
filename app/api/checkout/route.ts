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
  const products = await Promise.all(parsed.data.items.map((item) => getProductById(item.productId)));
  const hasUnknownProduct = products.some((product) => !product);
  if (hasUnknownProduct) {
    return NextResponse.json({ message: "One or more cart items are old or no longer available. Remove them and add the product again." }, { status: 400 });
  }

  const user = await resolveCheckoutUser({
    email: sessionUser.email,
    name: sessionUser.name,
    role: sessionUser.role
  });
  if (!user) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const totals = await calculateTotals(parsed.data.items, parsed.data.couponCode);
  const order = await createCheckoutOrder({
    user,
    items: parsed.data.items,
    totals,
    address: parsed.data.address
  });

  return NextResponse.json({
    orderId: order.id,
    totals,
    settlementCurrency: "PKR",
    checkoutUrl: "/checkout/success"
  });
}
