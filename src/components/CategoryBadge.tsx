import React from "react";
import {
  Compass,
  Droplet,
  Zap,
  Trash2,
  GraduationCap,
  HeartPulse,
  HelpCircle,
} from "lucide-react";
import { ComplaintCategory } from "@/models/Complaint";

interface CategoryBadgeProps {
  category: ComplaintCategory | string;
  showIcon?: boolean;
}

export default function CategoryBadge({
  category,
  showIcon = true,
}: CategoryBadgeProps) {
  const configs: Record<
    string,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Roads: {
      bg: "bg-orange-500/10",
      text: "text-orange-700 dark:text-orange-400",
      border: "border-orange-500/20",
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    Water: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-700 dark:text-cyan-400",
      border: "border-cyan-500/20",
      icon: <Droplet className="w-3.5 h-3.5" />,
    },
    Electricity: {
      bg: "bg-amber-500/10",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-500/20",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    Sanitation: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-500/20",
      icon: <Trash2 className="w-3.5 h-3.5" />,
    },
    Education: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-500/20",
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
    Health: {
      bg: "bg-rose-500/10",
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-500/20",
      icon: <HeartPulse className="w-3.5 h-3.5" />,
    },
    Other: {
      bg: "bg-slate-500/10",
      text: "text-slate-700 dark:text-slate-400",
      border: "border-slate-500/20",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[category] || configs["Other"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {showIcon && config.icon}
      <span>{category}</span>
    </span>
  );
}
