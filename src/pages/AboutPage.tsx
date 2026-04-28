import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Cpu, HardDrive, Layers } from "lucide-react";

const concepts = [
  {
    icon: HardDrive,
    title: "RSS (Resident Set Size)",
    desc: "The portion of a process's memory that is held in RAM. This is the actual physical memory consumed by the process, excluding swapped-out memory.",
  },
  {
    icon: Layers,
    title: "Virtual Memory (VMS)",
    desc: "The total amount of virtual address space allocated to a process, including memory mapped files, shared libraries, and swap. VMS is typically much larger than RSS.",
  },
  {
    icon: Cpu,
    title: "Memory Leaks",
    desc: "A memory leak occurs when a program allocates memory but fails to release it after use. Over time, this causes the process's memory usage to grow continuously, eventually degrading system performance.",
  },
  {
    icon: Bug,
    title: "Leak Detection Algorithms",
    desc: "This tool uses linear regression, moving average analysis, continuous growth detection, and threshold-based slope analysis to identify memory leaks and classify processes as Normal, Suspicious, or Critical.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">About MemProfiler</h1>
        <p className="text-muted-foreground">
          Memory Usage Profiler & Leak Detector is a frontend visualization tool that monitors process memory consumption,
          detects abnormal patterns like memory leaks, and provides intelligent explanations with actionable suggestions.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Key Concepts</h2>
        <div className="grid gap-4">
          {concepts.map((c) => (
            <Card key={c.title}>
              <CardContent className="p-5 flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Detection Methods</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li><strong>Linear Regression</strong> — Fits a trend line to detect consistent upward slopes (R² {'>'} 0.7 = strong leak signal)</li>
          <li><strong>Moving Average</strong> — Smooths noise and identifies underlying growth trends</li>
          <li><strong>Continuous Growth</strong> — Checks if recent samples show monotonic increase</li>
          <li><strong>Threshold Analysis</strong> — Flags processes exceeding configurable memory limits</li>
        </ul>
      </section>
    </div>
  );
}
