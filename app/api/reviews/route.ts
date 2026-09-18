import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid review payload." }, { status: 400 });
  }

  return NextResponse.json({ review: { id: `review-${Date.now()}`, userId: session.user.id, ...parsed.data } });
}
