"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Edits the logged-in user's name + phone. Email is shown read-only (it's the
 * account identifier). Uses the `updateProfile` server action via useActionState.
 */
export function ProfileForm({
  defaultName,
  defaultPhone,
  email,
}: {
  defaultName: string;
  defaultPhone: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.ok && (
        <div className="flex items-center gap-2 rounded-xl border border-brand-green-100 bg-brand-green-50 px-4 py-3 text-sm text-brand-green-800">
          <CheckCircle2 className="h-4 w-4" />
          Profile updated successfully.
        </div>
      )}
      {state?.error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={defaultName}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          readOnly
          disabled
          className="bg-slate-50 text-slate-500"
        />
        <p className="mt-1 text-xs text-slate-400">
          Your email is used to sign in and can&apos;t be changed here.
        </p>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Optional"
          defaultValue={defaultPhone}
        />
      </div>

      <Button type="submit" variant="primary" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
