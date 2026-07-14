import Link from "next/link";
import { Wrench, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteService } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Services — ABABIL Admin",
  description: "Manage digital services.",
};

export default async function AdminServicesPage() {
  const services = await prisma.digitalService.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
            Digital services
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {services.length} service{services.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button href="/admin/services/new">
          <Plus className="h-4 w-4" />
          New service
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services yet"
          description="Create your first digital service."
          actionLabel="New service"
          actionHref="/admin/services/new"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Charge</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-brand-navy-800">
                      {s.name}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {s.category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {formatPrice(Number(s.serviceCharge))}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={s.isActive ? "green" : "gray"}>
                          {s.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {s.isFeatured && <Badge variant="amber">Featured</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/services/${s.id}`}
                          className="text-sm font-medium text-brand-green-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton onDelete={deleteService.bind(null, s.id)} />
                      </div>
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
