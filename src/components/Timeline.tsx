import React from "react";
import { CheckCircle2, Clock, AlertCircle, User, Calendar } from "lucide-react";
import { ITimelineItem } from "@/models/Complaint";
import StatusBadge from "./StatusBadge";

interface TimelineProps {
  timeline: ITimelineItem[];
}

export default function Timeline({ timeline }: TimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No activity recorded yet.</p>
      </div>
    );
  }

  // Format date cleanly
  const formatDate = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {timeline.map((item, index) => {
        const isLatest = index === timeline.length - 1;
        return (
          <div key={index} className="relative group">
            {/* Step marker dot */}
            <div
              className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                isLatest
                  ? "bg-blue-600 border-blue-200 text-white shadow-md shadow-blue-500/30 scale-110"
                  : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500"
              }`}
            >
              {item.status === "Resolved" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : item.status === "Rejected" ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
            </div>

            {/* Content card */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                isLatest
                  ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <StatusBadge status={item.status} size="sm" />
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(item.timestamp)}
                </span>
              </div>

              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {item.message}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <User className="w-3.5 h-3.5" />
                <span>Action by: </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {item.updatedBy || "System"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
