import { ProcessInfo, MemorySnapshot, Alert, MonitoringSettings } from "@/utils/types";
import { detectLeakStatus } from "@/utils/leak-detection";

const PROCESS_TEMPLATES = [
  { name: "chrome", baseRss: 350, baseVms: 1200, leaky: false },
  { name: "node-server", baseRss: 180, baseVms: 600, leaky: true },
  { name: "python-worker", baseRss: 120, baseVms: 400, leaky: false },
  { name: "java-app", baseRss: 450, baseVms: 1500, leaky: true },
  { name: "nginx", baseRss: 25, baseVms: 80, leaky: false },
  { name: "postgres", baseRss: 200, baseVms: 700, leaky: false },
  { name: "redis", baseRss: 80, baseVms: 200, leaky: false },
  { name: "electron-app", baseRss: 280, baseVms: 900, leaky: true },
  { name: "go-service", baseRss: 40, baseVms: 150, leaky: false },
  { name: "docker-daemon", baseRss: 90, baseVms: 350, leaky: false },
  { name: "webpack-dev", baseRss: 300, baseVms: 800, leaky: true },
  { name: "vscode", baseRss: 400, baseVms: 1300, leaky: false },
];

let processes: ProcessInfo[] = [];
let tickCount = 0;
let alerts: Alert[] = [];
let alertIdCounter = 0;

export function initializeProcesses(): ProcessInfo[] {
  processes = PROCESS_TEMPLATES.map((t, i) => ({
    pid: 1000 + i * 137,
    name: t.name,
    rss: t.baseRss + Math.random() * 50,
    vms: t.baseVms + Math.random() * 100,
    memPercent: 0,
    status: "normal",
    history: [],
  }));

  // Initialize history
  const totalMem = 16384;
  processes.forEach((p) => {
    p.memPercent = (p.rss / totalMem) * 100;
    for (let i = 0; i < 20; i++) {
      p.history.push({
        timestamp: Date.now() - (20 - i) * 3000,
        rss: p.rss + (Math.random() - 0.5) * 10,
        vms: p.vms + (Math.random() - 0.5) * 20,
        memPercent: p.memPercent + (Math.random() - 0.5) * 0.5,
      });
    }
  });

  tickCount = 0;
  alerts = [];
  return processes;
}

export function tickProcesses(settings: MonitoringSettings): { processes: ProcessInfo[]; newAlerts: Alert[] } {
  tickCount++;
  const totalMem = 16384;
  const newAlerts: Alert[] = [];

  processes.forEach((p, i) => {
    const template = PROCESS_TEMPLATES[i];
    const noise = (Math.random() - 0.5) * 15;

    if (template.leaky) {
      // Simulate leak: gradual increase with some noise
      p.rss += 2 + Math.random() * 3 + noise * 0.3;
      p.vms += 3 + Math.random() * 5;
    } else {
      // Normal fluctuation
      p.rss = Math.max(template.baseRss * 0.7, p.rss + noise);
      p.vms = Math.max(template.baseVms * 0.7, p.vms + (Math.random() - 0.5) * 20);
    }

    p.memPercent = (p.rss / totalMem) * 100;

    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      rss: p.rss,
      vms: p.vms,
      memPercent: p.memPercent,
    };
    p.history.push(snapshot);

    // Keep history manageable
    if (p.history.length > 200) {
      p.history = p.history.slice(-200);
    }

    const detection = detectLeakStatus(
      p.history,
      settings.leakSlopeThreshold,
      settings.warningThreshold,
      settings.criticalThreshold
    );

    const prevStatus = p.status;
    p.status = detection.status;

    if (detection.status !== "normal" && detection.status !== prevStatus) {
      const alert: Alert = {
        id: `alert-${++alertIdCounter}`,
        pid: p.pid,
        processName: p.name,
        status: detection.status,
        message: `${p.name} (PID: ${p.pid}) — ${detection.status === "critical" ? "Critical memory leak detected" : "Suspicious memory pattern"}`,
        reason: detection.reason,
        suggestion: detection.suggestion,
        timestamp: Date.now(),
        acknowledged: false,
      };
      newAlerts.push(alert);
    }
  });

  alerts = [...alerts, ...newAlerts];
  return { processes: [...processes], newAlerts };
}

export function getAlerts(): Alert[] {
  return [...alerts];
}

export function acknowledgeAlert(id: string) {
  alerts = alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a));
}

export function clearAlerts() {
  alerts = [];
}
