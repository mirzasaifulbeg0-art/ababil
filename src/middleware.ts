import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Auth middleware. Uses the edge-safe config; the `authorized` callback in
 * auth.config.ts decides who may access /admin and /dashboard. Unauthenticated
 * users are redirected to /login automatically by NextAuth.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
