export default function ProfilePage() {
  return (
    <div className="panel grid gap-4 p-6">
      <h1 className="text-3xl font-black">Profile</h1>
      <input defaultValue="Demo Customer" className="border border-coal/15 bg-white p-3" />
      <input defaultValue="customer@8x.test" className="border border-coal/15 bg-white p-3" />
      <button className="brass-button w-fit">Save profile</button>
    </div>
  );
}
