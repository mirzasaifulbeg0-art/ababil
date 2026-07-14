import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your free ABABIL account to shop, download books, and track orders.",
};

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Join ABABIL — it only takes a minute.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
