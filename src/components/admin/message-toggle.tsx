"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleMessageRead } from "@/lib/actions/admin";

/** Toggles a contact message between read / unread, then refreshes. */
export function MessageToggle({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await toggleMessageRead(id, !read);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={read ? "outline" : "primary"}
      size="sm"
      onClick={handleClick}
      disabled={pending}
    >
      {read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
      {read ? "Mark unread" : "Mark read"}
    </Button>
  );
}
