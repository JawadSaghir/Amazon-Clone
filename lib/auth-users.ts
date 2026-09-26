import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

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

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function registeredUsers() {
  if (!globalForUsers.registeredUsers) {
    globalForUsers.registeredUsers = [];
  }
  return globalForUsers.registeredUsers;
}

function localAuthUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  return [...demoUsers, ...registeredUsers()].find((user) => user.email === normalizedEmail) ?? null;
}

function databaseEnabled() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function mapRole(role: string): AuthUser["role"] {
  return role === "ADMIN" ? "ADMIN" : "CUSTOMER";
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

async function findDatabaseAuthUserByEmail(email: string) {
  if (!databaseEnabled()) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) }
    });

    if (!user?.passwordHash) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: mapRole(user.role),
      passwordHash: user.passwordHash
    } satisfies AuthUser;
  } catch {
    return null;
  }
}

export async function findAuthUserByEmail(email: string) {
  return localAuthUserByEmail(email) ?? (await findDatabaseAuthUserByEmail(email));
}

export async function createAuthUser(input: { name: string; email: string; password: string }) {
  const normalizedEmail = normalizeEmail(input.email);
  const localUser = localAuthUserByEmail(normalizedEmail);
  if (localUser) {
    return { user: null, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  if (databaseEnabled()) {
    try {
      const user = await prisma.user.create({
        data: {
          name: input.name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: "CUSTOMER"
        }
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: mapRole(user.role),
          passwordHash: user.passwordHash ?? passwordHash
        } satisfies AuthUser,
        error: null
      };
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return { user: null, error: "An account with this email already exists." };
      }

      return { user: null, error: "We could not create your account right now. Please try again." };
    }
  }

  const user: AuthUser = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email: normalizedEmail,
    role: "CUSTOMER",
    passwordHash
  };

  registeredUsers().push(user);
  return { user, error: null };
}
