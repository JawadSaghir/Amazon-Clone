export default function AddressesPage() {
  return (
    <div className="panel p-6">
      <h1 className="text-3xl font-black">Addresses</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="border border-coal/10 bg-paper p-4">
          <p className="font-black">Home</p>
          <p className="mt-2 text-sm text-coal/70">12 Market Road, Lahore, 54000, Pakistan</p>
        </div>
        <div className="border border-coal/10 bg-paper p-4">
          <p className="font-black">Office</p>
          <p className="mt-2 text-sm text-coal/70">Connaught Place, New Delhi, 110001, India</p>
        </div>
      </div>
    </div>
  );
}
