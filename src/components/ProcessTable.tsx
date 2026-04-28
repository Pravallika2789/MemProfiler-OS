import { ProcessInfo } from "@/utils/types";
import { StatusBadge } from "./StatusBadge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProcessTableProps {
  processes: ProcessInfo[];
  onSelectProcess?: (p: ProcessInfo) => void;
  selectedPid?: number;
}

type SortField = "name" | "rss" | "vms" | "memPercent" | "status";

export function ProcessTable({ processes, onSelectProcess, selectedPid }: ProcessTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("rss");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = processes.filter(
      (p) => p.name.toLowerCase().includes(q) || p.pid.toString().includes(q)
    );
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "status") {
        const order = { normal: 0, suspicious: 1, critical: 2 };
        cmp = order[a.status] - order[b.status];
      } else cmp = (a[sortField] as number) - (b[sortField] as number);
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [processes, search, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="h-8 -ml-3 text-xs font-semibold text-muted-foreground hover:text-foreground" onClick={() => toggleSort(field)}>
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search processes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/50"
        />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3"><SortHeader field="name">Process</SortHeader></th>
              <th className="text-right p-3 hidden sm:table-cell"><SortHeader field="rss">RSS (MB)</SortHeader></th>
              <th className="text-right p-3 hidden md:table-cell"><SortHeader field="vms">VMS (MB)</SortHeader></th>
              <th className="text-right p-3 hidden sm:table-cell"><SortHeader field="memPercent">Mem %</SortHeader></th>
              <th className="text-center p-3"><SortHeader field="status">Status</SortHeader></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.pid}
                onClick={() => onSelectProcess?.(p)}
                className={cn(
                  "border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/30",
                  selectedPid === p.pid && "bg-primary/5",
                  p.status === "critical" && "bg-status-critical-bg/50"
                )}
              >
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">PID: {p.pid}</div>
                </td>
                <td className="text-right p-3 font-mono text-xs hidden sm:table-cell">{p.rss.toFixed(1)}</td>
                <td className="text-right p-3 font-mono text-xs hidden md:table-cell">{p.vms.toFixed(1)}</td>
                <td className="text-right p-3 font-mono text-xs hidden sm:table-cell">{p.memPercent.toFixed(2)}%</td>
                <td className="text-center p-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
