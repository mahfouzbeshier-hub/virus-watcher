import { Shield, Clock, Hash, Globe, FileText, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Progress } from "@/components/ui/progress";
import type { ScanResult, ScanEngine } from "@/lib/virusTotal";

interface ScanResultsProps {
  target: string;
  type: "file" | "url";
  isScanning: boolean;
  result?: ScanResult | null;
  error?: string | null;
}

const ScanResults = ({ target, type, isScanning, result, error }: ScanResultsProps) => {
  const stats = result?.stats;
  const engines = result?.engines || [];
  const status = result?.status;

  const cleanCount = stats?.undetected || 0;
  const harmlessCount = stats?.harmless || 0;
  const maliciousCount = stats?.malicious || 0;
  const suspiciousCount = stats?.suspicious || 0;
  const totalEngines = stats?.total || engines.length;

  const overallStatus = maliciousCount > 0 ? "danger" : 
                        suspiciousCount > 0 ? "warning" : 
                        status === "completed" ? "clean" : "scanning";

  const progress = status === "completed" ? 100 : 
                   status === "queued" ? 10 :
                   status === "in-progress" ? 50 : 0;

  if (error) {
    return (
      <div className="w-full animate-fade-in">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Scan Error</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Summary Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
              overallStatus === "clean" ? "bg-success/10" : 
              overallStatus === "warning" ? "bg-warning/10" : 
              overallStatus === "danger" ? "bg-destructive/10" : "bg-primary/10"
            }`}>
              <Shield className={`h-8 w-8 ${
                overallStatus === "clean" ? "text-success" : 
                overallStatus === "warning" ? "text-warning" : 
                overallStatus === "danger" ? "text-destructive" : "text-primary"
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-foreground">Scan Results</h3>
                <StatusBadge status={overallStatus} size="md" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground font-mono truncate max-w-[300px] md:max-w-[500px]">
                {target}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{cleanCount + harmlessCount}</p>
              <p className="text-muted-foreground">Clean</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{maliciousCount}</p>
              <p className="text-muted-foreground">Malicious</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{suspiciousCount}</p>
              <p className="text-muted-foreground">Suspicious</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalEngines}</p>
              <p className="text-muted-foreground">Engines</p>
            </div>
          </div>
        </div>

        {status !== "completed" && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {status === "queued" ? "Queued for analysis..." : 
                 status === "in-progress" ? "Scanning in progress..." : 
                 "Initializing scan..."}
              </span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Details Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            {type === "file" ? (
              <FileText className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">Type:</span>
            <span className="text-foreground font-medium capitalize">{type}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Scan Time:</span>
            <span className="text-foreground font-medium">
              {result?.date ? new Date(result.date * 1000).toLocaleTimeString() : new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Status:</span>
            <span className="text-foreground font-medium capitalize">{status || 'pending'}</span>
          </div>
        </div>
      </div>

      {/* Engines Grid */}
      {engines.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Security Vendors ({engines.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {engines.map((engine, index) => (
              <div
                key={engine.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border animate-scale-in"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {engine.name}
                </span>
                <StatusBadge 
                  status={engine.status as "clean" | "warning" | "danger" | "scanning" | "unknown"} 
                  size="sm" 
                  showIcon={true} 
                  label="" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanResults;
