import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="page-shell py-16 text-center">
      <div className="panel mx-auto max-w-xl p-10">
        <h1 className="text-3xl font-black">Order ready for test payment</h1>
        <p className="mt-3 text-coal/65">The checkout API created a server-calculated order contract.</p>
        <Link href="/dashboard/orders" className="brass-button mt-6">
          View orders
        </Link>
      </div>
    </div>
  );
}
