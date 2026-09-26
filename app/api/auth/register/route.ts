import { NextResponse } from "next/server";

import { createAuthUser } from "@/lib/auth-users";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid registration payload." }, { status: 400 });
  }

  const { user, error } = await createAuthUser(parsed.data);
  if (!user) {
    return NextResponse.json({ message: error }, { status: 409 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}
