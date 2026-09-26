import bcrypt from "bcryptjs";
import { MongoClient, type Collection, type ObjectId } from "mongodb";

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
const globalForMongo = globalThis as unknown as { authMongoClient?: MongoClient };

type DbAuthUser = {
  _id?: ObjectId;
  name: string;
  email: string;
  role?: string;
  passwordHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

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

async function authUsersCollection(): Promise<Collection<DbAuthUser> | null> {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return null;

  const client =
    globalForMongo.authMongoClient ??
    new MongoClient(databaseUrl, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
  if (!globalForMongo.authMongoClient) {
    await client.connect();
    globalForMongo.authMongoClient = client;
  }

  return client.db().collection<DbAuthUser>("User");
}

function mapRole(role: string): AuthUser["role"] {
  return role === "ADMIN" ? "ADMIN" : "CUSTOMER";
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error.code === "P2002" || error.code === 11000);
}

async function findDatabaseAuthUserByEmail(email: string) {
  if (!databaseEnabled()) return null;

  try {
    const users = await authUsersCollection();
    const user = await users?.findOne({ email: normalizeEmail(email) });

    if (!user?.passwordHash) return null;

    return {
      id: user._id?.toString() ?? user.email,
      name: user.name,
      email: user.email,
      role: mapRole(user.role ?? "CUSTOMER"),
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
      const users = await authUsersCollection();
      if (!users) throw new Error("Auth database is not configured.");

      await users.createIndex({ email: 1 }, { unique: true });
      const existingUser = await users.findOne({ email: normalizedEmail });
      if (existingUser) {
        return { user: null, error: "An account with this email already exists." };
      }

      const now = new Date();
      const result = await users.insertOne({
        name: input.name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "CUSTOMER",
        createdAt: now,
        updatedAt: now
      });

      return {
        user: {
          id: result.insertedId.toString(),
          name: input.name.trim(),
          email: normalizedEmail,
          role: "CUSTOMER",
          passwordHash
        } satisfies AuthUser,
        error: null
      };
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return { user: null, error: "An account with this email already exists." };
      }

      console.error("Registration failed while creating user.", error);
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
