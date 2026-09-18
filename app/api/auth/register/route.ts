import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid registration payload." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  return NextResponse.json({
    user: {
      id: `user-${Date.now()}`,
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      role: "CUSTOMER",
      passwordHash
    }
  });
}
