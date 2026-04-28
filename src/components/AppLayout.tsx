import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useMonitoring } from "@/context/MonitoringContext";
import { Button } from "@/components/ui/button";
import { Play, Square, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isMonitoring, startMonitoring, stopMonitoring, alerts } = useMonitoring();
  const unack = alerts.filter((a) => !a.acknowledged).length;
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-semibold hidden sm:inline">Memory Usage Profiler & Leak Detector</span>
            </div>
            <div className="flex items-center gap-2">
              {isMonitoring ? (
                <Button variant="destructive" size="sm" onClick={stopMonitoring}>
                  <Square className="h-3 w-3 mr-1" /> Stop
                </Button>
              ) : (
                <Button size="sm" onClick={startMonitoring}>
                  <Play className="h-3 w-3 mr-1" /> Start Monitoring
                </Button>
              )}
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/alerts")}>
                <Bell className="h-4 w-4" />
                {unack > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-status-critical text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                    {unack}
                  </span>
                )}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
