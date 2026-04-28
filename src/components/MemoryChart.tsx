import { ProcessInfo } from "@/utils/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemoryChartProps {
  process: ProcessInfo;
  title?: string;
}

export function MemoryChart({ process, title }: MemoryChartProps) {
  const data = process.history.slice(-60).map((s) => ({
    time: new Date(s.timestamp).toLocaleTimeString(),
    RSS: Number(s.rss.toFixed(1)),
    VMS: Number((s.vms / 4).toFixed(1)), // Scale down VMS for visual
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title || `${process.name} (PID: ${process.pid})`}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="RSS" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="VMS" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} opacity={0.6} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface MultiProcessChartProps {
  processes: ProcessInfo[];
}

export function MultiProcessChart({ processes }: MultiProcessChartProps) {
  const latest = processes.map((p) => ({
    name: p.name,
    RSS: Number(p.rss.toFixed(1)),
    VMS: Number((p.vms / 10).toFixed(1)),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Process Memory Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latest}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="RSS" stroke="hsl(var(--chart-1))" strokeWidth={2} />
            <Line type="monotone" dataKey="VMS" stroke="hsl(var(--chart-4))" strokeWidth={2} opacity={0.6} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
