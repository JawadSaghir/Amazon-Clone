"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-shell py-16 text-center font-bold">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = normalizeCallbackUrl(params.get("callbackUrl"));
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
      callbackUrl
    });
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <div className="page-shell py-16">
      <form onSubmit={submit} className="panel mx-auto grid max-w-md gap-4 p-6">
        <Link href="/" className="text-3xl font-black">
          8x<span className="text-saffron">market</span>
        </Link>
        <h1 className="text-2xl font-black">Sign in</h1>
        <input name="email" type="email" defaultValue="customer@8x.test" className="border border-coal/15 bg-white p-3" />
        <input name="password" type="password" defaultValue="password123" className="border border-coal/15 bg-white p-3" />
        <button className="brass-button" type="submit">
          Sign in
        </button>
        {error && <p className="text-sm font-bold text-pomegranate">{error}</p>}
        <p className="text-sm text-coal/60">Demo admin: admin@8x.test / password123</p>
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
