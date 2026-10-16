import React from "react";
import { Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { ComplaintStatus } from "@/models/Complaint";

interface StatusBadgeProps {
  status: ComplaintStatus | string;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode; dot: string }
  > = {
    Pending: {
      label: "Pending Review",
      bg: "bg-amber-500/10",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-500/30",
      dot: "bg-amber-500",
      icon: <Clock className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />,
    },
    "In Progress": {
      label: "In Progress",
      bg: "bg-blue-500/10",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-500/30",
      dot: "bg-blue-500 animate-pulse",
      icon: <RefreshCw className={size === "sm" ? "w-3 h-3 animate-spin" : "w-4 h-4 animate-spin"} />,
    },
    Resolved: {
      label: "Resolved",
      bg: "bg-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-500/30",
      dot: "bg-emerald-500",
      icon: <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />,
    },
    Rejected: {
      label: "Rejected",
      bg: "bg-rose-500/10",
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-500/30",
      dot: "bg-rose-500",
      icon: <XCircle className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />,
    },
  };

  const config = configs[status] || configs["Pending"];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1 font-medium",
    md: "px-3 py-1 text-xs md:text-sm gap-1.5 font-semibold",
    lg: "px-4 py-1.5 text-sm md:text-base gap-2 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
