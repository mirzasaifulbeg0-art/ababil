"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitContact } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, undefined);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-brand-green-100 bg-brand-green-50/60 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold text-brand-navy-800">
          Message sent
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          Thanks for reaching out. We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g. 98765 43210"
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject (optional)</Label>
          <Input id="subject" name="subject" placeholder="How can we help?" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Write your message…"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? "Sending…" : "Send message"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
