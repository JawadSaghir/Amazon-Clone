import bcrypt from "bcryptjs";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  passwordHash: string;
};

const demoUsers: AuthUser[] = [
  {
    id: "demo-customer",
    name: "Demo Customer",
    email: "customer@8x.test",
    role: "CUSTOMER",
    passwordHash: bcrypt.hashSync("8xDemo!Market2026", 10)
  },
  {
    id: "demo-admin",
    name: "Demo Admin",
    email: "admin@8x.test",
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("8xDemo!Market2026", 10)
  }
];

const globalForUsers = globalThis as unknown as { registeredUsers?: AuthUser[] };

function registeredUsers() {
  if (!globalForUsers.registeredUsers) {
    globalForUsers.registeredUsers = [];
  }
  return globalForUsers.registeredUsers;
}

export function findAuthUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return [...demoUsers, ...registeredUsers()].find((user) => user.email === normalizedEmail) ?? null;
}

export async function createAuthUser(input: { name: string; email: string; password: string }) {
  const normalizedEmail = input.email.trim().toLowerCase();
  if (findAuthUserByEmail(normalizedEmail)) {
    return { user: null, error: "An account with this email already exists." };
  }

  const user: AuthUser = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email: normalizedEmail,
    role: "CUSTOMER",
    passwordHash: await bcrypt.hash(input.password, 10)
  };

  registeredUsers().push(user);
  return { user, error: null };
}
