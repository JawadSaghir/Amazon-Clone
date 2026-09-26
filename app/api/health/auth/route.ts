import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

function maskUrl(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.password) parsed.password = "****";
    return parsed.toString();
  } catch {
    return "configured";
  }
}

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const authSecret = process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const result = {
    databaseUrl: databaseUrl ? maskUrl(databaseUrl) : "missing",
    nextAuthSecret: authSecret ? "set" : "missing",
    nextAuthUrl: nextAuthUrl || "missing",
    nextPublicAppUrl: publicAppUrl || "missing",
    mongoPing: "not_checked"
  };

  if (!databaseUrl) {
    return NextResponse.json(result, { status: 503 });
  }

  const client = new MongoClient(databaseUrl, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000
  });

  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    return NextResponse.json({ ...result, mongoPing: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "MongoDB connection failed";
    return NextResponse.json({ ...result, mongoPing: "failed", error: message }, { status: 503 });
  } finally {
    await client.close().catch(() => undefined);
  }
}
