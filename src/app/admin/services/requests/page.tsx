import { ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { updateServiceRequestStatus } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Service requests — ABABIL Admin",
  description: "Manage digital service requests.",
};

const STATUSES = [
  "SUBMITTED",
  "IN_REVIEW",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
] as const;

export default async function AdminServiceRequestsPage() {
  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true, user: true },
  });

  async function updateStatus(formData: FormData) {
    "use server";
    await updateServiceRequestStatus(formData);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
          Service requests
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {requests.length} request{requests.length === 1 ? "" : "s"}
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No service requests yet"
          description="Requests submitted by customers will appear here."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Applicant</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="font-medium text-brand-navy-800">
                        {r.fullName}
                      </div>
                      <div className="text-xs text-slate-500">{r.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {r.service.name}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3">
                      <form
                        action={updateStatus}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="requestId" value={r.id} />
                        <Select
                          name="status"
                          defaultValue={r.status}
                          className="h-9 w-40"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.replace(/_/g, " ")}
                            </option>
                          ))}
                        </Select>
                        <Button type="submit" size="sm" variant="outline">
                          Update
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
