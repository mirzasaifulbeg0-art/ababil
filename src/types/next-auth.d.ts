import type { DefaultSession } from "next-auth";

/**
 * Extend NextAuth's types so `session.user.id` and `session.user.role` are
 * strongly typed everywhere we read the session.
 */
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
