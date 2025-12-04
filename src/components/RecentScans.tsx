import { File, Globe, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
interface RecentScan {
  id: string;
  target: string;
  type: "file" | "url";
  status: "clean" | "warning" | "danger";
  timestamp: string;
  engines: number;
}
const mockRecentScans: RecentScan[] = [{
  id: "1",
  target: "invoice_2024.pdf",
  type: "file",
  status: "clean",
  timestamp: "2 min ago",
  engines: 72
}, {
  id: "2",
  target: "https://secure-payment.example.com",
  type: "url",
  status: "warning",
  timestamp: "15 min ago",
  engines: 68
}, {
  id: "3",
  target: "setup_v2.3.1.exe",
  type: "file",
  status: "clean",
  timestamp: "1 hour ago",
  engines: 72
}, {
  id: "4",
  target: "https://download.trusted-source.org",
  type: "url",
  status: "clean",
  timestamp: "3 hours ago",
  engines: 70
}];
const RecentScans = () => {
  return <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-destructive-foreground">Recent Scans</h2>
        <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {mockRecentScans.map((scan, index) => <div key={scan.id} style={{
        animationDelay: `${index * 100}ms`
      }} className="flex items-center justify-between p-4 rounded-xl border border-border transition-all duration-200 cursor-pointer group animate-slide-up bg-secondary text-border">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${scan.type === "file" ? "bg-primary/10" : "bg-secondary"}`}>
                {scan.type === "file" ? <File className="h-5 w-5 text-primary" /> : <Globe className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[200px] md:max-w-[400px]">
                  {scan.target}
                </p>
                <p className="text-sm text-muted-foreground">
                  {scan.timestamp} • {scan.engines} engines
                </p>
              </div>
            </div>
            <StatusBadge status={scan.status} size="md" />
          </div>)}
      </div>
    </div>;
};
export default RecentScans;