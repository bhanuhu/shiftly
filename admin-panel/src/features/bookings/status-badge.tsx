import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const variant = status === "delivered" ? "success" : status === "cancelled" ? "danger" : status === "pending" ? "warning" : "accent";
  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}
