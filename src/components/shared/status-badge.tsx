import { Badge } from "@/components/ui/badge";

type Variant = React.ComponentProps<typeof Badge>["variant"];

const MAP: Record<string, { label: string; variant: Variant }> = {
  // Orders
  PENDING: { label: "Pending", variant: "amber" },
  PAID: { label: "Paid", variant: "green" },
  PROCESSING: { label: "Processing", variant: "blue" },
  SHIPPED: { label: "Shipped", variant: "blue" },
  DELIVERED: { label: "Delivered", variant: "green" },
  CANCELLED: { label: "Cancelled", variant: "red" },
  REFUNDED: { label: "Refunded", variant: "gray" },
  FAILED: { label: "Failed", variant: "red" },
  // Service requests
  SUBMITTED: { label: "Submitted", variant: "amber" },
  IN_REVIEW: { label: "In Review", variant: "blue" },
  IN_PROGRESS: { label: "In Progress", variant: "blue" },
  COMPLETED: { label: "Completed", variant: "green" },
  REJECTED: { label: "Rejected", variant: "red" },
};

/** Maps an order/service status enum to a coloured badge. */
export function StatusBadge({ status }: { status: string }) {
  const cfg = MAP[status] ?? { label: status, variant: "gray" as Variant };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
