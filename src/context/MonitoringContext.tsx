import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { ProcessInfo, Alert, MonitoringSettings } from "@/utils/types";
import { initializeProcesses, tickProcesses, getAlerts, acknowledgeAlert as ackAlert, clearAlerts as clrAlerts } from "@/services/simulation";
import { toast } from "sonner";

interface MonitoringContextType {
  processes: ProcessInfo[];
  alerts: Alert[];
  isMonitoring: boolean;
  settings: MonitoringSettings;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  updateSettings: (s: Partial<MonitoringSettings>) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const MonitoringContext = createContext<MonitoringContextType | null>(null);

const DEFAULT_SETTINGS: MonitoringSettings = {
  refreshInterval: 3,
  warningThreshold: 500,
  criticalThreshold: 1000,
  historyWindow: 10,
  leakSlopeThreshold: 0.5,
};

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [settings, setSettings] = useState<MonitoringSettings>(DEFAULT_SETTINGS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startMonitoring = useCallback(() => {
    if (intervalRef.current) return;
    const procs = initializeProcesses();
    setProcesses(procs);
    setIsMonitoring(true);

    intervalRef.current = setInterval(() => {
      const { processes: updated, newAlerts } = tickProcesses(settings);
      setProcesses(updated);
      setAlerts(getAlerts());

      newAlerts.forEach((a) => {
        if (a.status === "critical") {
          toast.error(`🔴 ${a.processName}: Critical leak detected`, { description: a.reason, duration: 6000 });
        } else {
          toast.warning(`🟡 ${a.processName}: Suspicious pattern`, { description: a.reason, duration: 4000 });
        }
      });
    }, settings.refreshInterval * 1000);
  }, [settings]);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  const updateSettings = useCallback((partial: Partial<MonitoringSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleAcknowledge = useCallback((id: string) => {
    ackAlert(id);
    setAlerts(getAlerts());
  }, []);

  const handleClear = useCallback(() => {
    clrAlerts();
    setAlerts([]);
  }, []);

  // Restart interval when settings change
  useEffect(() => {
    if (isMonitoring) {
      stopMonitoring();
      // Small delay to restart
      const t = setTimeout(() => startMonitoring(), 100);
      return () => clearTimeout(t);
    }
  }, [settings.refreshInterval]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <MonitoringContext.Provider
      value={{
        processes,
        alerts,
        isMonitoring,
        settings,
        startMonitoring,
        stopMonitoring,
        updateSettings,
        acknowledgeAlert: handleAcknowledge,
        clearAlerts: handleClear,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const ctx = useContext(MonitoringContext);
  if (!ctx) throw new Error("useMonitoring must be used within MonitoringProvider");
  return ctx;
}
