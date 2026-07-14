import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your ABABIL account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          Forgot your password?
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your email and we&apos;ll send you reset instructions.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
