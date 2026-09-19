import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import { authOptions } from "@/lib/auth";
import { getAuthSecret } from "@/lib/auth-secret";

export type ApiSessionUser = {
  email?: string | null;
  name?: string | null;
  role?: string | null;
};

export async function getApiSessionUser(request: NextRequest): Promise<ApiSessionUser | null> {
  const token = await getToken({ req: request, secret: getAuthSecret() });
  if (token) {
    return {
      email: token.email,
      name: token.name,
      role: typeof token.role === "string" ? token.role : null
    };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return {
    email: session.user.email,
    name: session.user.name,
    role: typeof session.user.role === "string" ? session.user.role : null
  };
}
