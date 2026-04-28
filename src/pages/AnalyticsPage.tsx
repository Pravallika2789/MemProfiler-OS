import { useMonitoring } from "@/context/MonitoringContext";
import { MemoryChart, MultiProcessChart } from "@/components/MemoryChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function AnalyticsPage() {
  const { processes, isMonitoring, startMonitoring } = useMonitoring();

  if (!isMonitoring) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h2 className="text-2xl font-bold">No Data Yet</h2>
        <p className="text-muted-foreground">Start monitoring to see analytics.</p>
        <Button onClick={startMonitoring}><Play className="h-4 w-4 mr-2" /> Start</Button>
      </div>
    );
  }

  // Aggregate timeline
  const timelineLength = Math.min(...processes.map((p) => p.history.length), 60);
  const timeline = Array.from({ length: timelineLength }, (_, i) => {
    const idx = processes[0].history.length - timelineLength + i;
    const totalRss = processes.reduce((s, p) => s + (p.history[idx]?.rss || 0), 0);
    return {
      time: new Date(processes[0].history[idx]?.timestamp || 0).toLocaleTimeString(),
      totalRSS: Number((totalRss / 1024).toFixed(2)),
    };
  });

  const topProcesses = [...processes].sort((a, b) => b.rss - a.rss).slice(0, 4);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total System Memory Usage (GB)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="totalRSS" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <MultiProcessChart processes={processes} />

      <div className="grid md:grid-cols-2 gap-4">
        {topProcesses.map((p) => (
          <MemoryChart key={p.pid} process={p} title={`${p.name} — ${p.rss.toFixed(0)} MB`} />
        ))}
      </div>
    </div>
  );
}
