import { Shield, FileSearch, Globe, Users } from "lucide-react";

const stats = [
  {
    icon: FileSearch,
    value: "2.5M+",
    label: "Files Scanned",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Globe,
    value: "850K+",
    label: "URLs Analyzed",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Shield,
    value: "72+",
    label: "Security Engines",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Users,
    value: "500K+",
    label: "Active Users",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const Stats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} mb-4`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground text-center mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
