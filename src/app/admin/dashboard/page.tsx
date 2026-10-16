"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Calendar,
  MapPin,
} from "lucide-react";
import CategoryChart from "@/components/CategoryChart";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";

interface StatsData {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
  categoryCounts: Record<string, number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentComplaints: any[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    resolutionRate: 0,
    categoryCounts: {},
    recentComplaints: [],
  });
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  const checkAdminAndLoadStats = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();

      if (!authData.authenticated || authData.user?.role !== "admin") {
        router.push("/admin/login");
        return;
      }

      setAdminName(authData.user.name);

      const statsRes = await fetch("/api/stats");
      const statsJson = await statsRes.json();

      if (statsJson.success && statsJson.stats) {
        setStats(statsJson.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAdminAndLoadStats();
  }, [checkAdminAndLoadStats]);

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading municipal control dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Chief Grievance Redressal Officer Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Command & Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Logged in as <strong>{adminName}</strong>. Review real-time ward grievances, assign work orders, and audit resolution efficiency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/admin/complaints"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Manage All Complaints</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total */}
        <Link
          href="/admin/complaints"
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Filed</span>
            <FileText className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.total}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Across all 7 departments</p>
        </Link>

        {/* Pending */}
        <Link
          href="/admin/complaints?status=Pending"
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-2">
            {stats.pending}
          </h3>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400 mt-1">Awaiting inspection</p>
        </Link>

        {/* In Progress */}
        <Link
          href="/admin/complaints?status=In Progress"
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          </div>
          <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
            {stats.inProgress}
          </h3>
          <p className="text-[11px] text-blue-700/80 dark:text-blue-400 mt-1">Field squad deployed</p>
        </Link>

        {/* Resolved */}
        <Link
          href="/admin/complaints?status=Resolved"
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">
            {stats.resolved}
          </h3>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-1">
            {stats.resolutionRate}% resolution rate
          </p>
        </Link>

        {/* Rejected */}
        <Link
          href="/admin/complaints?status=Rejected"
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-3xl font-extrabold text-rose-600 mt-2">
            {stats.rejected}
          </h3>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-400 mt-1">Invalid / Duplicate</p>
        </Link>
      </div>

      {/* Main Grid: Chart + Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Breakdown Chart Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Department Grievance Distribution</span>
              </h2>
              <p className="text-xs text-slate-500">Live breakdown across civic sectors</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              {stats.total} Total
            </span>
          </div>

          <CategoryChart data={stats.categoryCounts} total={stats.total} />
        </div>

        {/* Recent Grievances Activity */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Recent Incoming Grievances</span>
              </h2>
              <p className="text-xs text-slate-500">Latest submissions requiring review</p>
            </div>

            <Link
              href="/admin/complaints"
              className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentComplaints.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No recent grievances registered.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentComplaints.map((item) => (
                <Link
                  key={item._id}
                  href={`/admin/complaints/${item._id}`}
                  className="block p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {item.complaintId}
                      </span>
                      <CategoryBadge category={item.category} showIcon={false} />
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {item.location}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
