"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  MapPin,
  Clock,
  FileQuestion,
  Image as ImageIcon,
  MessageSquareQuote,
} from "lucide-react";
import { IComplaint } from "@/models/Complaint";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";
import Timeline from "@/components/Timeline";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<IComplaint | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = useCallback(async (idToSearch: string) => {
    const trimmed = idToSearch.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMessage("");
    setComplaint(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error || "No grievance found with this Complaint ID. Please verify."
        );
      } else {
        setComplaint(data.complaint);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Network error occurred while fetching grievance status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId, handleSearch]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchId);
  };

  const handleCopyId = () => {
    if (complaint?.complaintId) {
      navigator.clipboard.writeText(complaint.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Header & Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
          <Search className="w-3.5 h-3.5" />
          <span>Real-time Public Redressal Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Track Grievance Status
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter your official Complaint ID (e.g., <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">JA-2026-0001</span>)
          to see department assignment, inspection progress, and action remarks.
        </p>

        {/* Search Input Box */}
        <form onSubmit={onFormSubmit} className="pt-2">
          <div className="relative flex items-center bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-1.5 shadow-lg focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              required
              placeholder="Enter Complaint ID (e.g. JA-2026-0001)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-transparent border-0 px-3 py-2.5 text-sm md:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none uppercase font-mono font-bold"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white shrink-0 shadow-md transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-800 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Grievance Not Found</p>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{errorMessage}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Tip: You can try sample complaints such as <strong className="text-blue-600 font-mono">JA-2026-0001</strong> or <strong className="text-blue-600 font-mono">JA-2026-0002</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Initial state guide */}
      {!searched && !loading && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <FileQuestion className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            No grievance searched yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Grievances registered through Jan Awaz Portal are publicly trackable
            with complete transparency. Try checking sample complaint:
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            {["JA-2026-0001", "JA-2026-0002", "JA-2026-0003", "JA-2026-0004"].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSearchId(id);
                  handleSearch(id);
                }}
                className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Complaint Details & Timeline */}
      {complaint && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Status Header Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                  {complaint.complaintId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Copy ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <CategoryBadge category={complaint.category} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {complaint.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Registered on {formatDate(complaint.createdAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {complaint.location}
                </span>
              </div>
            </div>

            <div className="shrink-0 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1.5 min-w-[180px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Current Status
              </span>
              <div>
                <StatusBadge status={complaint.status} size="lg" />
              </div>
            </div>
          </div>

          {/* Grid: Left = Details & Photo, Right = Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Complaint Details */}
            <div className="lg:col-span-6 space-y-6">
              {/* Description Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
                  Grievance Description
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              {/* Latest Officer Remarks */}
              <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 rounded-3xl p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Latest Action Remark</span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">
                  &ldquo;{complaint.remarks || "Under review by municipal grievance desk."}&rdquo;
                </p>
              </div>

              {/* Attached Photo Preview */}
              {complaint.imageUrl && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4" />
                    <span>Uploaded Site Photo</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-80 bg-slate-950 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={complaint.imageUrl}
                      alt="Grievance site evidence"
                      className="max-h-80 w-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Resolution Timeline */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Resolution History Timeline</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {complaint.timeline.length} updates recorded
                </span>
              </div>

              <Timeline timeline={complaint.timeline} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
