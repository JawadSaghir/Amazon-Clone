import { withAuth } from "next-auth/middleware";

import { getAuthSecret } from "@/lib/auth-secret";

export default withAuth({
  secret: getAuthSecret(),
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/admin")) return token?.role === "ADMIN";
      if (path.startsWith("/dashboard") || path.startsWith("/checkout")) return Boolean(token);
      return true;
    }
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/checkout"]
};
