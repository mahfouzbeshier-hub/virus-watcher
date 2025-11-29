import { useState, useEffect } from "react";
import { Shield, Clock, Hash, Globe, FileText } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Progress } from "@/components/ui/progress";

interface Engine {
  name: string;
  status: "clean" | "warning" | "danger" | "scanning";
  category?: string;
}

interface ScanResultsProps {
  target: string;
  type: "file" | "url";
  isScanning: boolean;
}

const mockEngines: Engine[] = [
  { name: "Avira", status: "clean", category: "Antivirus" },
  { name: "BitDefender", status: "clean", category: "Antivirus" },
  { name: "ClamAV", status: "clean", category: "Antivirus" },
  { name: "ESET-NOD32", status: "clean", category: "Antivirus" },
  { name: "F-Secure", status: "clean", category: "Antivirus" },
  { name: "Kaspersky", status: "clean", category: "Antivirus" },
  { name: "Malwarebytes", status: "clean", category: "Antivirus" },
  { name: "McAfee", status: "clean", category: "Antivirus" },
  { name: "Microsoft", status: "clean", category: "Antivirus" },
  { name: "Norton", status: "clean", category: "Antivirus" },
  { name: "Sophos", status: "clean", category: "Antivirus" },
  { name: "Trend Micro", status: "clean", category: "Antivirus" },
  { name: "Google Safe", status: "clean", category: "Reputation" },
  { name: "PhishTank", status: "clean", category: "Reputation" },
  { name: "URLhaus", status: "clean", category: "Reputation" },
  { name: "OpenPhish", status: "clean", category: "Reputation" },
];

const ScanResults = ({ target, type, isScanning }: ScanResultsProps) => {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (isScanning) {
      setEngines([]);
      setProgress(0);
      setScanComplete(false);

      // Simulate scanning
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanComplete(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      // Add engines progressively
      mockEngines.forEach((engine, index) => {
        setTimeout(() => {
          setEngines((prev) => [...prev, { ...engine, status: "scanning" }]);
          setTimeout(() => {
            setEngines((prev) =>
              prev.map((e) =>
                e.name === engine.name
                  ? { ...e, status: Math.random() > 0.95 ? "warning" : "clean" }
                  : e
              )
            );
          }, 500 + Math.random() * 1000);
        }, index * 150);
      });

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const cleanCount = engines.filter((e) => e.status === "clean").length;
  const warningCount = engines.filter((e) => e.status === "warning" || e.status === "danger").length;
  const scanningCount = engines.filter((e) => e.status === "scanning").length;

  const overallStatus = warningCount > 0 ? "warning" : scanningCount > 0 ? "scanning" : "clean";

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Summary Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
              overallStatus === "clean" ? "bg-success/10" : 
              overallStatus === "warning" ? "bg-warning/10" : "bg-primary/10"
            }`}>
              <Shield className={`h-8 w-8 ${
                overallStatus === "clean" ? "text-success" : 
                overallStatus === "warning" ? "text-warning" : "text-primary"
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
              <p className="text-2xl font-bold text-success">{cleanCount}</p>
              <p className="text-muted-foreground">Clean</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{warningCount}</p>
              <p className="text-muted-foreground">Flagged</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{engines.length}</p>
              <p className="text-muted-foreground">Engines</p>
            </div>
          </div>
        </div>

        {!scanComplete && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Scanning progress</span>
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
            <span className="text-foreground font-medium">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">SHA-256:</span>
            <span className="text-foreground font-mono text-xs truncate max-w-[200px]">
              a7f5397b...9e2d4c8b
            </span>
          </div>
        </div>
      </div>

      {/* Engines Grid */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Security Vendors ({engines.length}/{mockEngines.length})
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {engines.map((engine, index) => (
            <div
              key={engine.name}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-sm font-medium text-foreground">{engine.name}</span>
              <StatusBadge status={engine.status} size="sm" showIcon={true} label="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanResults;
