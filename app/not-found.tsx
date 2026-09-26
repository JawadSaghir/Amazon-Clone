import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell py-16 text-center">
      <div className="panel mx-auto max-w-xl p-10">
        <h1 className="font-display text-3xl font-semibold text-coal">Page not found</h1>
        <Link href="/" className="brass-button mt-6">
          Back home
        </Link>
      </div>
    </div>
  );
}
