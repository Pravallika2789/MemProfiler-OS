import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart3, Shield, Bell, Zap, Bug, ArrowRight } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Real-Time Monitoring", desc: "Track RSS, VMS, and memory percentage of all running processes with live updates." },
  { icon: Shield, title: "Leak Detection", desc: "Advanced algorithms detect continuous growth, slope trends, and moving average anomalies." },
  { icon: Bell, title: "Smart Alerts", desc: "Get instant notifications with detailed explanations and actionable fix suggestions." },
  { icon: Zap, title: "High Performance", desc: "Optimized rendering with debounced updates and efficient chart animations." },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
          <Bug className="h-4 w-4" /> Memory Profiler v1.0
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Memory Usage Profiler<br />
          <span className="text-primary">& Leak Detector</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Monitor system memory in real-time, detect abnormal patterns and memory leaks,
          and get intelligent suggestions to resolve issues — all from your browser.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/about")}>
            Learn More
          </Button>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <Card key={f.title} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-6 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
