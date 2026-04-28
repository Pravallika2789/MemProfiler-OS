import { useMonitoring } from "@/context/MonitoringContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, HardDrive, AlertTriangle, Activity } from "lucide-react";

export function StatsCards() {
  const { processes, alerts } = useMonitoring();

  const totalRss = processes.reduce((s, p) => s + p.rss, 0);
  const criticalCount = processes.filter((p) => p.status === "critical").length;
  const suspiciousCount = processes.filter((p) => p.status === "suspicious").length;
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  const stats = [
    { title: "Total RSS", value: `${(totalRss / 1024).toFixed(2)} GB`, icon: HardDrive, desc: `${processes.length} processes` },
    { title: "Active Processes", value: processes.length.toString(), icon: Cpu, desc: "Monitored" },
    { title: "Critical", value: criticalCount.toString(), icon: AlertTriangle, desc: `${suspiciousCount} suspicious`, critical: criticalCount > 0 },
    { title: "Active Alerts", value: unacknowledged.toString(), icon: Activity, desc: `${alerts.length} total`, critical: unacknowledged > 0 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.title} className={s.critical ? "border-status-critical/30 glow-critical" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{s.title}</CardTitle>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
