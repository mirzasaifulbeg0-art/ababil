import { handlers } from "@/lib/auth";

// NextAuth mounts its GET/POST endpoints (sign-in, callback, session, etc.).
export const { GET, POST } = handlers;
