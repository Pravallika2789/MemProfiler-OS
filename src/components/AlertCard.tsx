import { Alert as AlertType } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: AlertType;
  onAcknowledge: (id: string) => void;
}

export function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  return (
    <Card className={cn(
      "transition-all",
      alert.status === "critical" && "glow-critical border-status-critical/30",
      alert.status === "suspicious" && "glow-warning border-status-warning/30",
      alert.acknowledged && "opacity-60"
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn(
              "h-5 w-5 shrink-0",
              alert.status === "critical" ? "text-status-critical" : "text-status-warning"
            )} />
            <div>
              <p className="font-semibold text-sm">{alert.processName} <span className="text-muted-foreground font-normal">PID: {alert.pid}</span></p>
              <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={alert.status} />
            {!alert.acknowledged && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAcknowledge(alert.id)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-status-warning mt-0.5 shrink-0" />
            <p className="text-xs">{alert.reason}</p>
          </div>
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs">{alert.suggestion}</p>
          </div>
        </div>

        {alert.acknowledged && (
          <div className="flex items-center gap-1 text-xs text-status-normal">
            <CheckCircle className="h-3 w-3" /> Acknowledged
          </div>
        )}
      </CardContent>
    </Card>
  );
}
