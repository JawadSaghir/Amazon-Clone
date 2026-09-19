import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { getAuthSecret } from "@/lib/auth-secret";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: getAuthSecret() });
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && token?.role !== "ADMIN") {
    return redirectToLogin(request);
  }

  if (path.startsWith("/dashboard") && !token) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
