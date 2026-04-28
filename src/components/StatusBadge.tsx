import { ProcessStatus } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  normal: { label: "Normal", className: "bg-status-normal-bg text-status-normal border-status-normal/30" },
  suspicious: { label: "Suspicious", className: "bg-status-warning-bg text-status-warning border-status-warning/30" },
  critical: { label: "Critical", className: "bg-status-critical-bg text-status-critical border-status-critical/30" },
};

export function StatusBadge({ status }: { status: ProcessStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
      <span className={cn(
        "inline-block w-2 h-2 rounded-full mr-1.5",
        status === "normal" && "bg-status-normal",
        status === "suspicious" && "bg-status-warning",
        status === "critical" && "bg-status-critical"
      )} />
      {config.label}
    </Badge>
  );
}
