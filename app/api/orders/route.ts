import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { getAuthSecret } from "@/lib/auth-secret";
import { getOrdersForUser, resolveCheckoutUser } from "@/lib/orders";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: getAuthSecret() });
  if (!token) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const user = await resolveCheckoutUser({
    email: token.email,
    name: token.name,
    role: typeof token.role === "string" ? token.role : null
  });
  if (!user) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const orderId = request.nextUrl.searchParams.get("orderId")?.trim();
  const orders = await getOrdersForUser(user, orderId);

  return NextResponse.json({ orders });
}
