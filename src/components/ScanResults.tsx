import { Shield, Clock, Hash, Globe, FileText, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
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

// Extended demo engine data with varied threat types
const demoEngines: ScanEngine[] = [
  // Malicious/Phishing detections (shown first)
  { name: "BitDefender", category: "malicious", result: "Phishing", status: "danger" },
  { name: "CRDF", category: "malicious", result: "Malicious", status: "danger" },
  { name: "CyRadar", category: "malicious", result: "Phishing", status: "danger" },
  { name: "Fortinet", category: "malicious", result: "Phishing", status: "danger" },
  { name: "G-Data", category: "malicious", result: "Phishing", status: "danger" },
  { name: "Lionic", category: "malicious", result: "Phishing", status: "danger" },
  { name: "Seclookup", category: "malicious", result: "Malicious", status: "danger" },
  { name: "Sophos", category: "malicious", result: "Phishing", status: "danger" },
  { name: "VIPRE", category: "malicious", result: "Phishing", status: "danger" },
  { name: "Webroot", category: "malicious", result: "Malicious", status: "danger" },
  // Suspicious detections
  { name: "alphaMountain.ai", category: "suspicious", result: "Suspicious", status: "warning" },
  { name: "ESET", category: "suspicious", result: "Suspicious", status: "warning" },
  { name: "Forcepoint ThreatSeeker", category: "suspicious", result: "Suspicious", status: "warning" },
  { name: "Gridinsoft", category: "suspicious", result: "Suspicious", status: "warning" },
  // Clean detections
  { name: "Abusix", category: "harmless", result: null, status: "clean" },
  { name: "Acronis", category: "harmless", result: null, status: "clean" },
  { name: "ADMINUSLabs", category: "harmless", result: null, status: "clean" },
  { name: "AILabs (MONITORAPP)", category: "harmless", result: null, status: "clean" },
  { name: "AlienVault", category: "harmless", result: null, status: "clean" },
  { name: "Antiy-AVL", category: "harmless", result: null, status: "clean" },
  { name: "Artists Against 419", category: "harmless", result: null, status: "clean" },
  { name: "benkow.cc", category: "harmless", result: null, status: "clean" },
  { name: "BlockList", category: "harmless", result: null, status: "clean" },
  { name: "Blueliv", category: "harmless", result: null, status: "clean" },
  { name: "Certego", category: "harmless", result: null, status: "clean" },
  { name: "Chong Lua Dao", category: "harmless", result: null, status: "clean" },
  { name: "CINS Army", category: "harmless", result: null, status: "clean" },
  { name: "CMC Threat Intelligence", category: "harmless", result: null, status: "clean" },
  { name: "Criminal IP", category: "harmless", result: null, status: "clean" },
  { name: "Cyble", category: "harmless", result: null, status: "clean" },
  { name: "Avast", category: "harmless", result: null, status: "clean" },
  { name: "AVG", category: "harmless", result: null, status: "clean" },
  { name: "Avira", category: "harmless", result: null, status: "clean" },
  { name: "ClamAV", category: "harmless", result: null, status: "clean" },
  { name: "Comodo", category: "harmless", result: null, status: "clean" },
  { name: "CrowdStrike", category: "harmless", result: null, status: "clean" },
  { name: "Cylance", category: "harmless", result: null, status: "clean" },
  { name: "DrWeb", category: "harmless", result: null, status: "clean" },
  { name: "Emsisoft", category: "harmless", result: null, status: "clean" },
  { name: "F-Secure", category: "harmless", result: null, status: "clean" },
  { name: "FireEye", category: "harmless", result: null, status: "clean" },
  { name: "Google", category: "harmless", result: null, status: "clean" },
  { name: "Ikarus", category: "harmless", result: null, status: "clean" },
  { name: "K7", category: "harmless", result: null, status: "clean" },
  { name: "Kaspersky", category: "harmless", result: null, status: "clean" },
  { name: "Malwarebytes", category: "harmless", result: null, status: "clean" },
  { name: "MaxSecure", category: "harmless", result: null, status: "clean" },
  { name: "McAfee", category: "harmless", result: null, status: "clean" },
  { name: "Microsoft", category: "harmless", result: null, status: "clean" },
  { name: "NANO", category: "harmless", result: null, status: "clean" },
  { name: "Norton", category: "harmless", result: null, status: "clean" },
  { name: "Panda", category: "harmless", result: null, status: "clean" },
  { name: "Qihoo 360", category: "harmless", result: null, status: "clean" },
  { name: "Rising", category: "harmless", result: null, status: "clean" },
  { name: "SUPERAntiSpyware", category: "harmless", result: null, status: "clean" },
  { name: "Sangfor", category: "harmless", result: null, status: "clean" },
  { name: "Symantec", category: "harmless", result: null, status: "clean" },
  { name: "TACHYON", category: "harmless", result: null, status: "clean" },
  { name: "Tencent", category: "harmless", result: null, status: "clean" },
  { name: "TrendMicro", category: "harmless", result: null, status: "clean" },
  { name: "Trustlook", category: "harmless", result: null, status: "clean" },
  { name: "VBA32", category: "harmless", result: null, status: "clean" },
  { name: "ViRobot", category: "harmless", result: null, status: "clean" },
  { name: "Yandex", category: "harmless", result: null, status: "clean" },
  { name: "Zillya", category: "harmless", result: null, status: "clean" },
  { name: "ZoneAlarm", category: "harmless", result: null, status: "clean" },
  { name: "Zoner", category: "harmless", result: null, status: "clean" },
  { name: "AhnLab", category: "harmless", result: null, status: "clean" },
  { name: "Alibaba", category: "harmless", result: null, status: "clean" },
  { name: "Antiy", category: "harmless", result: null, status: "clean" },
  { name: "Arcabit", category: "harmless", result: null, status: "clean" },
  { name: "Baidu", category: "harmless", result: null, status: "clean" },
  { name: "Bkav", category: "harmless", result: null, status: "clean" },
  { name: "CAT-QuickHeal", category: "harmless", result: null, status: "clean" },
  { name: "CMC", category: "harmless", result: null, status: "clean" },
  { name: "Cybereason", category: "harmless", result: null, status: "clean" },
  { name: "Cyren", category: "harmless", result: null, status: "clean" },
  { name: "DeepInstinct", category: "harmless", result: null, status: "clean" },
  { name: "Elastic", category: "harmless", result: null, status: "clean" },
  { name: "Jiangmin", category: "harmless", result: null, status: "clean" },
  { name: "K7GW", category: "harmless", result: null, status: "clean" },
  { name: "Kingsoft", category: "harmless", result: null, status: "clean" },
  { name: "MAX", category: "harmless", result: null, status: "clean" },
  { name: "MicroWorld", category: "harmless", result: null, status: "clean" },
  { name: "Paloalto", category: "harmless", result: null, status: "clean" },
  { name: "Phishing DB", category: "harmless", result: null, status: "clean" },
  { name: "Skyhigh", category: "harmless", result: null, status: "clean" },
  { name: "Snort", category: "harmless", result: null, status: "clean" },
  { name: "SpamAssassin", category: "harmless", result: null, status: "clean" },
  { name: "Sucuri", category: "harmless", result: null, status: "clean" },
];

const ScanResults = ({ target, type, isScanning, result, error }: ScanResultsProps) => {
  const stats = result?.stats;
  const engines = result?.engines && result.engines.length > 0 ? result.engines : demoEngines;
  const status = result?.status || "completed";

  const cleanCount = stats?.undetected || 84;
  const harmlessCount = stats?.harmless || 0;
  const maliciousCount = stats?.malicious || 10;
  const suspiciousCount = stats?.suspicious || 4;
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

      {/* Engines Table */}
      {engines.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30">
            <h4 className="text-lg font-semibold text-foreground">
              Security Vendors Analysis ({engines.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-border">
            {/* Sort engines: threats first, then clean */}
            {[...engines]
              .sort((a, b) => {
                const priority = { danger: 0, warning: 1, unknown: 2, scanning: 3, clean: 4 };
                return (priority[a.status] || 4) - (priority[b.status] || 4);
              })
              .map((engine, index) => (
                <div
                  key={engine.name}
                  className={`flex items-center justify-between px-4 py-3 border-b border-border/30 ${
                    index % 2 === 0 ? 'md:border-r md:border-r-border/30' : ''
                  } hover:bg-secondary/20 transition-colors`}
                >
                  <span className="text-sm font-medium text-foreground">
                    {engine.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {engine.status === "clean" && (
                      <>
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-success font-medium">Clean</span>
                      </>
                    )}
                    {engine.status === "danger" && (
                      <>
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-sm text-destructive font-medium">
                          {engine.result || "Malicious"}
                        </span>
                      </>
                    )}
                    {engine.status === "warning" && (
                      <>
                        <Info className="w-4 h-4 text-warning" />
                        <span className="text-sm text-warning font-medium">
                          {engine.result || "Suspicious"}
                        </span>
                      </>
                    )}
                    {(engine.status === "unknown" || engine.status === "scanning") && (
                      <>
                        <Info className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-medium">Unknown</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanResults;
