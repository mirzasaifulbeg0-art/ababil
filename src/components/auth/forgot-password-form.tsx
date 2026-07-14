"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Placeholder password-reset UI.
 *
 * NOTE: password reset email delivery is NOT wired up yet — there is no email
 * backend. This form simply confirms submission to the user. Hook up a real
 * "send reset link" action + email provider before relying on it.
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No real email backend yet — just show the friendly confirmation.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-brand-green-100 bg-brand-green-50 px-4 py-4 text-sm text-brand-green-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-600" />
          <p>
            If an account exists for <strong>{email}</strong>, we&apos;ll email
            reset instructions shortly.
          </p>
        </div>
        <Button href="/login" variant="outline" className="w-full">
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Send reset instructions
      </Button>

      <p className="text-center text-sm text-slate-500">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-green-700 hover:text-brand-green-800"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
