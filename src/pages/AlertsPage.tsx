import { useMonitoring } from "@/context/MonitoringContext";
import { AlertCard } from "@/components/AlertCard";
import { Button } from "@/components/ui/button";
import { Trash2, Bell } from "lucide-react";

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, clearAlerts } = useMonitoring();

  const sorted = [...alerts].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-sm text-muted-foreground">{alerts.filter((a) => !a.acknowledged).length} unacknowledged alerts</p>
        </div>
        {alerts.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAlerts}>
            <Trash2 className="h-3 w-3 mr-1" /> Clear All
          </Button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No alerts yet</p>
          <p className="text-sm">Alerts will appear here when suspicious or critical memory patterns are detected.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((a) => (
            <AlertCard key={a.id} alert={a} onAcknowledge={acknowledgeAlert} />
          ))}
        </div>
      )}
    </div>
  );
}
