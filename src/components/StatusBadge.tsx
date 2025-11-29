import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";

type Status = "clean" | "warning" | "danger" | "scanning" | "unknown";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  label?: string;
}

const statusConfig = {
  clean: {
    icon: CheckCircle,
    label: "Clean",
    className: "bg-success/10 text-success border-success/30",
  },
  warning: {
    icon: AlertTriangle,
    label: "Suspicious",
    className: "bg-warning/10 text-warning border-warning/30",
  },
  danger: {
    icon: XCircle,
    label: "Malicious",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  scanning: {
    icon: Loader2,
    label: "Scanning",
    className: "bg-primary/10 text-primary border-primary/30",
  },
  unknown: {
    icon: AlertTriangle,
    label: "Unknown",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const sizeConfig = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

const StatusBadge = ({ status, size = "md", showIcon = true, label }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isScanning = status === "scanning";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.className,
        sizeConfig[size]
      )}
    >
      {showIcon && (
        <Icon className={cn("h-3.5 w-3.5", isScanning && "animate-spin")} />
      )}
      {label || config.label}
    </span>
  );
};

export default StatusBadge;
