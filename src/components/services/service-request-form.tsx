"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitServiceRequest } from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ServiceRequestForm({
  serviceId,
  defaultName,
  defaultEmail,
}: {
  serviceId: string;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitServiceRequest,
    undefined
  );

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-brand-green-100 bg-brand-green-50/60 px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold text-brand-navy-800">
          Application received
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          Thank you! Our team will review your request and reach out to you
          shortly on the phone number you provided.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          required
          defaultValue={defaultName}
          placeholder="Your full name"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="e.g. 98765 43210"
          />
        </div>
        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Tell us anything that will help us process your application…"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? "Submitting…" : "Submit application"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
