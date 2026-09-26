"use client";

import { signIn } from "next-auth/react";
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
    const result = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      callbackUrl,
      redirect: true
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setSubmitting(false);
    }
  }

  if (status === "authenticated") {
    return (
      <div className="page-shell py-16">
        <div className="panel mx-auto grid max-w-md gap-4 p-8">
          <Link href="/" className="font-display text-3xl font-semibold text-coal">
            8x<span className="text-amazonOrange">bazaar</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold">You are signed in</h1>
          <p className="text-sm text-muted">Redirecting to your account...</p>
          <Link href={callbackUrl} className="brass-button">
            Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <form onSubmit={submit} autoComplete="off" className="panel mx-auto grid max-w-md gap-4 p-8 transition duration-200 hover:shadow-panel">
        <Link href="/" className="font-display text-3xl font-semibold text-coal">
          8x<span className="text-amazonOrange">bazaar</span>
        </Link>
        <h1 className="font-display text-2xl font-semibold">Sign in</h1>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-inkSoft">Email address</span>
          <input
            suppressHydrationWarning
            name="email"
            type="email"
            autoComplete="off"
            placeholder="Email address"
            className="rounded-xl border border-line bg-paper p-3 text-sm outline-none transition duration-200 focus:border-amazonOrange focus:bg-white focus:shadow-sm"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-inkSoft">Password</span>
          <input
            suppressHydrationWarning
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            className="rounded-xl border border-line bg-paper p-3 text-sm outline-none transition duration-200 focus:border-amazonOrange focus:bg-white focus:shadow-sm"
          />
        </label>
        <button suppressHydrationWarning className="brass-button mt-1 transition duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70" type="submit" disabled={submitting || status === "loading"}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="text-sm font-bold text-pomegranate">{error}</p>}
        <p className="text-center text-sm text-muted">
          New to 8x Bazaar?{" "}
          <Link href="/signup" className="font-semibold text-amazonOrangeDark hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

function normalizeCallbackUrl(value: string | null) {
  if (!value) return "/dashboard";

  try {
    const parsed = new URL(value, window.location.origin);
    if (parsed.origin !== window.location.origin) return "/dashboard";
    if (parsed.pathname === "/login" || parsed.pathname === "/api/auth/signin") {
      return normalizeCallbackUrl(parsed.searchParams.get("callbackUrl"));
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/dashboard";
  }
}
