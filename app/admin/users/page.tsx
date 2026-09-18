const users = [
  ["Demo Customer", "customer@8x.test", "CUSTOMER"],
  ["Demo Admin", "admin@8x.test", "ADMIN"]
];

export default function AdminUsersPage() {
  return (
    <div className="panel p-5">
      <h1 className="text-3xl font-black">Users</h1>
      <div className="mt-5 grid gap-3">
        {users.map(([name, email, role]) => (
          <div key={email} className="grid gap-2 border border-coal/10 bg-paper p-4 sm:grid-cols-3">
            <p className="font-black">{name}</p>
            <p>{email}</p>
            <p className="font-bold">{role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
