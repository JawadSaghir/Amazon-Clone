import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getAuthSecret } from "@/lib/auth-secret";

const demoUsers = [
  {
    id: "demo-customer",
    name: "Demo Customer",
    email: "customer@8x.test",
    role: "CUSTOMER",
    passwordHash: bcrypt.hashSync("password123", 10)
  },
  {
    id: "demo-admin",
    name: "Demo Admin",
    email: "admin@8x.test",
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("password123", 10)
  }
];

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        const password = credentials?.password;
        const user = demoUsers.find((entry) => entry.email === email);
        if (!user || !password) return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = String(token.role);
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
