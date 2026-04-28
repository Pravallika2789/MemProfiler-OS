import { MemorySnapshot, ProcessStatus } from "./types";

export function linearRegression(data: { x: number; y: number }[]): { slope: number; intercept: number; r2: number } {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };

  const sumX = data.reduce((s, d) => s + d.x, 0);
  const sumY = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);
  const sumY2 = data.reduce((s, d) => s + d.y * d.y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const ssRes = data.reduce((s, d) => s + Math.pow(d.y - (slope * d.x + intercept), 2), 0);
  const ssTot = data.reduce((s, d) => s + Math.pow(d.y - sumY / n, 2), 0);
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, r2 };
}

export function movingAverage(values: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

export function detectLeakStatus(
  history: MemorySnapshot[],
  slopeThreshold: number = 0.5,
  warningMB: number = 500,
  criticalMB: number = 1000
): { status: ProcessStatus; reason: string; suggestion: string } {
  if (history.length < 5) {
    return { status: "normal", reason: "Insufficient data", suggestion: "Continue monitoring" };
  }

  const latest = history[history.length - 1];
  const data = history.map((s, i) => ({ x: i, y: s.rss }));
  const { slope, r2 } = linearRegression(data);

  // Check continuous increase
  const recentWindow = history.slice(-10);
  let continuousIncrease = true;
  for (let i = 1; i < recentWindow.length; i++) {
    if (recentWindow[i].rss < recentWindow[i - 1].rss) {
      continuousIncrease = false;
      break;
    }
  }

  // Moving average trend
  const maValues = movingAverage(history.map(s => s.rss), 5);
  const maTrend = maValues.length >= 2 ? maValues[maValues.length - 1] - maValues[maValues.length - 2] : 0;

  if (latest.rss > criticalMB && slope > slopeThreshold && r2 > 0.7) {
    return {
      status: "critical",
      reason: "Memory usage is continuously increasing with strong linear trend → Possible memory leak due to unfreed objects or retained references",
      suggestion: "Investigate heap dumps, check for event listener leaks, review large object allocations, and consider restarting the process",
    };
  }

  if (continuousIncrease && slope > slopeThreshold * 0.5) {
    return {
      status: "critical",
      reason: "Continuous memory growth detected over recent samples → Likely memory leak from accumulating data structures",
      suggestion: "Profile memory allocations, check for growing arrays/maps, review closure scopes, and implement proper cleanup",
    };
  }

  if (latest.rss > warningMB || (slope > slopeThreshold * 0.3 && r2 > 0.5)) {
    return {
      status: "suspicious",
      reason: maTrend > 0
        ? "Gradual memory increase detected → Possible inefficient data handling or large object retention"
        : "High memory usage detected → Consider closing unused resources or optimizing memory allocation",
      suggestion: "Monitor closely, review recent code changes, consider implementing object pooling or caching limits",
    };
  }

  if (maTrend > 2) {
    return {
      status: "suspicious",
      reason: "Frequent spikes in memory → Possible inefficient data handling or temporary large allocations",
      suggestion: "Review data processing pipelines, implement streaming for large datasets, add memory pressure monitoring",
    };
  }

  return {
    status: "normal",
    reason: "Memory usage is stable within normal parameters",
    suggestion: "No action required — continue standard monitoring",
  };
}
