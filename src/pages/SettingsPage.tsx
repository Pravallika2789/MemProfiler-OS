import { useMonitoring } from "@/context/MonitoringContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  const { settings, updateSettings } = useMonitoring();
  const [local, setLocal] = useState({ ...settings });

  const handleSave = () => {
    updateSettings(local);
    toast.success("Settings updated successfully");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monitoring Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interval">Refresh Interval (seconds)</Label>
              <Input id="interval" type="number" min={1} max={30} value={local.refreshInterval} onChange={(e) => setLocal({ ...local, refreshInterval: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="history">History Window (minutes)</Label>
              <Input id="history" type="number" min={1} max={60} value={local.historyWindow} onChange={(e) => setLocal({ ...local, historyWindow: Number(e.target.value) })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Alert Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warning">Warning Threshold (MB)</Label>
              <Input id="warning" type="number" min={100} value={local.warningThreshold} onChange={(e) => setLocal({ ...local, warningThreshold: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="critical">Critical Threshold (MB)</Label>
              <Input id="critical" type="number" min={200} value={local.criticalThreshold} onChange={(e) => setLocal({ ...local, criticalThreshold: Number(e.target.value) })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slope">Leak Slope Threshold (MB/tick)</Label>
            <Input id="slope" type="number" step={0.1} min={0.1} value={local.leakSlopeThreshold} onChange={(e) => setLocal({ ...local, leakSlopeThreshold: Number(e.target.value) })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
