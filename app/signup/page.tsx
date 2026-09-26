"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, type FormEvent, useState } from "react";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="page-shell py-16 text-center font-bold">Loading sign up...</div>}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = normalizeCallbackUrl(params.get("callbackUrl"));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? "Could not create your account.");
      setSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false
    });

    if (result?.error) {
      setError("Account created, but sign in failed. Please sign in manually.");
      setSubmitting(false);
      return;
    }

    router.replace(callbackUrl);
  }

  return (
    <div className="page-shell py-16">
      <form onSubmit={submit} autoComplete="off" className="panel mx-auto grid max-w-md gap-4 p-8 transition duration-200 hover:shadow-panel">
        <Link href="/" className="font-display text-3xl font-semibold text-coal">
          8x<span className="text-amazonOrange">bazaar</span>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-muted">Sign up to save carts, track orders, and manage your account.</p>
        </div>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-inkSoft">Full name</span>
          <input
            suppressHydrationWarning
            name="name"
            type="text"
            autoComplete="off"
            minLength={2}
            required
            placeholder="Full name"
            className="rounded-xl border border-line bg-paper p-3 text-sm outline-none transition duration-200 focus:border-amazonOrange focus:bg-white focus:shadow-sm"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-inkSoft">Email address</span>
          <input
            suppressHydrationWarning
            name="email"
            type="email"
            autoComplete="off"
            required
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
            minLength={8}
            required
            placeholder="At least 8 characters"
            className="rounded-xl border border-line bg-paper p-3 text-sm outline-none transition duration-200 focus:border-amazonOrange focus:bg-white focus:shadow-sm"
          />
        </label>
        <button suppressHydrationWarning className="brass-button mt-1 transition duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </button>
        {error && <p className="text-sm font-bold text-pomegranate">{error}</p>}
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-amazonOrangeDark hover:underline">
            Sign in
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
    if (parsed.pathname === "/login" || parsed.pathname === "/signup" || parsed.pathname === "/api/auth/signin") {
      return normalizeCallbackUrl(parsed.searchParams.get("callbackUrl"));
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/dashboard";
  }
}
