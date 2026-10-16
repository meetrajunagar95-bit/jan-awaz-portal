"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Droplet,
  Zap,
  Trash2,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  FileCheck2,
  RefreshCw,
} from "lucide-react";

interface PortalStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
  categoryCounts: Record<string, number>;
}

export default function HomePage() {
  const router = useRouter();
  const [trackId, setTrackId] = useState("");
  const [stats, setStats] = useState<PortalStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    resolutionRate: 0,
    categoryCounts: {},
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (e) {
      console.error("Failed to load statistics:", e);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackId.trim()) {
      router.push(`/track?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  const categories = [
    {
      name: "Roads",
      desc: "Potholes, broken footpaths, traffic signals, road repairs",
      icon: <Compass className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50",
    },
    {
      name: "Water",
      desc: "Pipeline bursts, drinking water shortage, drainage overflow",
      icon: <Droplet className="w-6 h-6 text-cyan-600" />,
      bg: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900/50",
    },
    {
      name: "Electricity",
      desc: "Dark streetlights, power fluctuations, hazardous exposed wires",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50",
    },
    {
      name: "Sanitation",
      desc: "Uncollected garbage, overflowing bins, open dumps, hygiene",
      icon: <Trash2 className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50",
    },
    {
      name: "Education",
      desc: "School safety, classroom infrastructure, public school amenities",
      icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50",
    },
    {
      name: "Health",
      desc: "Mosquito breeding, stagnant water, hospital & clinic cleanliness",
      icon: <HeartPulse className="w-6 h-6 text-rose-600" />,
      bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50",
    },
    {
      name: "Other",
      desc: "Public encroachments, noise nuisance, other municipal issues",
      icon: <HelpCircle className="w-6 h-6 text-slate-600" />,
      bg: "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative civic background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-orange-500 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Civic Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-blue-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Digital India & Smart City Civic Redressal Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Empowering Citizen Voices for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
              Transparent Municipal Action
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Jan Awaz Portal bridges citizens directly with municipal departments.
            Lodge grievances with photo proof, receive an official Complaint ID, and
            track real-time resolution updates from field officers.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              <span>Submit a Grievance</span>
            </Link>

            <Link
              href="/track"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Track Existing Grievance</span>
            </Link>
          </div>

          {/* Quick Track Input Bar */}
          <div className="pt-8 max-w-xl mx-auto">
            <form
              onSubmit={handleTrackSubmit}
              className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-1.5 shadow-2xl focus-within:border-blue-400 transition-colors"
            >
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g. JA-2026-0001)..."
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                className="w-full bg-transparent border-0 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 transition-colors"
              >
                Track Now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Complaints */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Grievances
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {loadingStats ? "..." : stats.total}
              </h3>
            </div>
          </div>

          {/* Pending Action */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending Action
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-0.5">
                {loadingStats ? "..." : stats.pending}
              </h3>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                In Progress
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-0.5">
                {loadingStats ? "..." : stats.inProgress}
              </h3>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resolved Issues
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-0.5">
                  {loadingStats ? "..." : stats.resolved}
                </h3>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                  {stats.resolutionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Citizen Grievance Categories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            What issue are you facing today?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select a municipal department to quickly register your grievance with
            the designated zonal authority.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/submit?category=${encodeURIComponent(cat.name)}`}
              className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between group ${cat.bg}`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Lodge Grievance</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {stats.categoryCounts[cat.name] || 0} registered
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How Jan Awaz Portal Resolves Your Grievance
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              End-to-end transparency from initial citizen submission to verified on-ground resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Submit Grievance
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Provide your contact details, pick the issue category, describe the problem, and optionally attach a photo of the site.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Unique Tracking ID
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive an instant Complaint ID (e.g. JA-2026-0001) generated immediately to track status anytime without a login.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Department Assignment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The grievance is automatically queued to the designated ward engineer and field inspection team for verification.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Verified Resolution
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Officers document inspection notes, update the public timeline, and mark the grievance as Resolved once work is finished.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Trust Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free & Open Citizen Access</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Have a civic issue in your locality?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Don’t let municipal problems go unnoticed. Raise your voice, register
              the complaint, and let the administration know what needs fixing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/submit"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-900 hover:bg-slate-100 transition-colors shadow-md"
            >
              Lodge Complaint Now
            </Link>
            <Link
              href="/about"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
