import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth configuration.
 *
 * This file contains NO database or bcrypt code so it can run inside Next.js
 * middleware (the Edge runtime). The Credentials provider — which needs Prisma
 * and bcrypt — is added in `auth.ts`, which only runs in the Node runtime.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [], // real providers are injected in auth.ts
  callbacks: {
    // Copy id + role onto the JWT the first time (when `user` is present).
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    // Expose id + role to the session object read on the server/client.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // Runs in middleware for every matched route. Guards admin + dashboard.
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;

      if (path.startsWith("/admin")) return isLoggedIn && role === "ADMIN";
      if (path.startsWith("/dashboard")) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
