import { NextRequest, NextResponse } from "next/server";

import { getApiSessionUser } from "@/lib/api-session";
import { getOrdersForUser, resolveCheckoutUser } from "@/lib/orders";

export async function GET(request: NextRequest) {
  const sessionUser = await getApiSessionUser(request);
  if (!sessionUser) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const user = await resolveCheckoutUser({
    email: sessionUser.email,
    name: sessionUser.name,
    role: sessionUser.role
  });
  if (!user) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const orderId = request.nextUrl.searchParams.get("orderId")?.trim();
  const orders = await getOrdersForUser(user, orderId);

  return NextResponse.json({ orders });
}
