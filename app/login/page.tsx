"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FormEvent, useEffect, useState } from "react";

import { useDemoSession } from "@/components/providers/session-store";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-shell py-16 text-center font-bold">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const { status } = useDemoSession();
  const callbackUrl = normalizeCallbackUrl(params.get("callbackUrl"));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      window.location.replace(callbackUrl);
    }
  }, [callbackUrl, status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const csrfResponse = await fetch("/api/auth/csrf");
    const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };
    const body = new URLSearchParams({
      csrfToken,
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: "false",
      callbackUrl,
      json: "true"
    });
    const result = await fetch("/api/auth/callback/credentials?json=true", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!result.ok) {
      setError("Invalid email or password.");
      setSubmitting(false);
      return;
    }
    window.location.replace(callbackUrl);
  }

  if (status === "authenticated") {
    return (
      <div className="page-shell py-16">
        <div className="panel mx-auto grid max-w-md gap-4 p-6">
          <Link href="/" className="text-3xl font-black">
            8x<span className="text-saffron">market</span>
          </Link>
          <h1 className="text-2xl font-black">You are signed in</h1>
          <p className="text-sm text-coal/60">Redirecting to your account...</p>
          <Link href={callbackUrl} className="brass-button">
            Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <form onSubmit={submit} className="panel mx-auto grid max-w-md gap-4 p-6">
        <Link href="/" className="text-3xl font-black">
          8x<span className="text-saffron">market</span>
        </Link>
        <h1 className="text-2xl font-black">Sign in</h1>
        <input name="email" type="email" defaultValue="customer@8x.test" className="border border-coal/15 bg-white p-3" />
        <input name="password" type="password" defaultValue="8xDemo!Market2026" className="border border-coal/15 bg-white p-3" />
        <button className="brass-button disabled:cursor-wait disabled:opacity-70" type="submit" disabled={submitting || status === "loading"}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="text-sm font-bold text-pomegranate">{error}</p>}
        <p className="text-sm text-coal/60">Demo admin: admin@8x.test / 8xDemo!Market2026</p>
      </form>
    </div>
  );
}

function normalizeCallbackUrl(value: string | null) {
  if (!value) return "/dashboard";

  try {
    const parsed = new URL(value, window.location.origin);
    if (parsed.origin !== window.location.origin) return "/dashboard";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/dashboard";
  }
}
