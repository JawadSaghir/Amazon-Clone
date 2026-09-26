"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell py-16 text-center">
      <div className="panel mx-auto max-w-xl p-10">
        <h1 className="font-display text-3xl font-semibold text-coal">Something went wrong</h1>
        <button type="button" onClick={reset} className="brass-button mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}
