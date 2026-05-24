import { Badge } from "@/components/ui/badge";
import { VerificationStatus } from "@/types";

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const variant = status === "approved" ? "success" : status === "pending" ? "warning" : "danger";
  return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
}
