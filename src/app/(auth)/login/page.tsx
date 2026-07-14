import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your ABABIL account to manage orders, downloads, and more.",
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue to your account.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
