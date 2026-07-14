import { Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageToggle } from "@/components/admin/message-toggle";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Messages — ABABIL Admin",
  description: "View contact messages.",
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
          Messages
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {messages.length} message{messages.length === 1 ? "" : "s"} · {unread}{" "}
          unread
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages yet"
          description="Contact form submissions will appear here."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id} className={m.read ? "" : "border-brand-green-200"}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-brand-navy-800">
                        {m.subject || "(No subject)"}
                      </h3>
                      {m.read ? (
                        <Badge variant="gray">Read</Badge>
                      ) : (
                        <Badge variant="green">Unread</Badge>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {m.name} · {m.email}
                      {m.phone ? ` · ${m.phone}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {formatDate(m.createdAt)}
                    </span>
                    <MessageToggle id={m.id} read={m.read} />
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                  {m.message}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
