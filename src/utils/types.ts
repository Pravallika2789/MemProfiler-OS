export type ProcessStatus = "normal" | "suspicious" | "critical";

export interface ProcessInfo {
  pid: number;
  name: string;
  rss: number; // MB
  vms: number; // MB
  memPercent: number;
  status: ProcessStatus;
  history: MemorySnapshot[];
}

export interface MemorySnapshot {
  timestamp: number;
  rss: number;
  vms: number;
  memPercent: number;
}

export interface Alert {
  id: string;
  pid: number;
  processName: string;
  status: ProcessStatus;
  message: string;
  reason: string;
  suggestion: string;
  timestamp: number;
  acknowledged: boolean;
}

export interface MonitoringSettings {
  refreshInterval: number; // seconds
  warningThreshold: number; // MB
  criticalThreshold: number; // MB
  historyWindow: number; // minutes
  leakSlopeThreshold: number; // MB/min
}
