import { useMonitoring } from "@/context/MonitoringContext";
import { StatsCards } from "@/components/StatsCards";
import { ProcessTable } from "@/components/ProcessTable";
import { MemoryChart } from "@/components/MemoryChart";
import { useState } from "react";
import { ProcessInfo } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function DashboardPage() {
  const { processes, isMonitoring, startMonitoring } = useMonitoring();
  const [selectedProcess, setSelectedProcess] = useState<ProcessInfo | null>(null);

  if (!isMonitoring) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Play className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Start Monitoring</h2>
        <p className="text-muted-foreground max-w-md">Click the button to begin real-time process memory monitoring with leak detection.</p>
        <Button size="lg" onClick={startMonitoring}>
          <Play className="h-4 w-4 mr-2" /> Start Monitoring
        </Button>
      </div>
    );
  }

  const selected = selectedProcess ? processes.find((p) => p.pid === selectedProcess.pid) || selectedProcess : null;

  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid lg:grid-cols-2 gap-6">
        <ProcessTable
          processes={processes}
          onSelectProcess={setSelectedProcess}
          selectedPid={selected?.pid}
        />
        <div className="space-y-4">
          {selected ? (
            <MemoryChart process={selected} />
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground text-sm">
              Select a process to view memory chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
