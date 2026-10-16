import React from "react";
import { COMPLAINT_CATEGORIES } from "@/lib/validators";

interface CategoryChartProps {
  data: Record<string, number>;
  total: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  Roads: { bg: "bg-orange-500/10", bar: "bg-orange-500", text: "text-orange-700 dark:text-orange-400" },
  Water: { bg: "bg-cyan-500/10", bar: "bg-cyan-500", text: "text-cyan-700 dark:text-cyan-400" },
  Electricity: { bg: "bg-amber-500/10", bar: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
  Sanitation: { bg: "bg-emerald-500/10", bar: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" },
  Education: { bg: "bg-indigo-500/10", bar: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-400" },
  Health: { bg: "bg-rose-500/10", bar: "bg-rose-500", text: "text-rose-700 dark:text-rose-400" },
  Other: { bg: "bg-slate-500/10", bar: "bg-slate-500", text: "text-slate-700 dark:text-slate-400" },
};

export default function CategoryChart({ data, total }: CategoryChartProps) {
  const safeTotal = total > 0 ? total : 1;

  return (
    <div className="space-y-4">
      {COMPLAINT_CATEGORIES.map((cat) => {
        const count = data[cat] || 0;
        const percentage = total > 0 ? Math.round((count / safeTotal) * 100) : 0;
        const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;

        return (
          <div key={cat} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-200">{cat}</span>
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                  {count} {count === 1 ? "complaint" : "complaints"}
                </span>
                <span className="text-slate-400 w-8 text-right">{percentage}%</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bar} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${Math.max(percentage, count > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
