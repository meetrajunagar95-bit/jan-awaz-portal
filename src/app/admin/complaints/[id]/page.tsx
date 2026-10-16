"use client";

import React, { useState, useEffect, useCallback, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Image as ImageIcon,
  Copy,
  Check,
} from "lucide-react";
import { IComplaint, ComplaintStatus } from "@/models/Complaint";
import { COMPLAINT_STATUSES } from "@/lib/validators";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";
import Timeline from "@/components/Timeline";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ComplaintDetailContent({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [complaint, setComplaint] = useState<IComplaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string } | null>(null);

  // Form state
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("Pending");
  const [remarks, setRemarks] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchComplaintAndAdmin = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();

      if (!authData.authenticated || authData.user?.role !== "admin") {
        router.push("/admin/login");
        return;
      }
      setAdminUser(authData.user);

      const res = await fetch(`/api/complaints/${encodeURIComponent(id)}`);
      const data = await res.json();

      if (data.success && data.complaint) {
        setComplaint(data.complaint);
        setNewStatus(data.complaint.status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchComplaintAndAdmin();
  }, [fetchComplaintAndAdmin]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide action remarks explaining this status change.",
      });
      return;
    }

    setUpdating(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          remarks: remarks.trim(),
          officerName: adminUser?.name || "Grievance Officer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to update status.",
        });
      } else {
        setComplaint(data.complaint);
        setRemarks("");
        setStatusMessage({
          type: "success",
          text: `Status successfully updated to "${newStatus}"!`,
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred while updating status.",
      });
    } finally {
      setUpdating(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading grievance docket...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Complaint Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested complaint identifier could not be located in the municipal database.
        </p>
        <Link
          href="/admin/complaints"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Complaints Desk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          href="/admin/complaints"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints Registry</span>
        </Link>

        <span className="text-xs text-slate-400">
          Official Municipal Redressal Case File
        </span>
      </div>

      {/* Grievance Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {complaint.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Lodge Date: {formatDate(complaint.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {complaint.location}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center min-w-[180px] shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Current Stage
          </span>
          <div className="mt-1">
            <StatusBadge status={complaint.status} size="lg" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left (Details & Updater), Right (Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Details & Action Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Citizen Contact Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
              Citizen Contact Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" /> Full Name:
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{complaint.name}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email:
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{complaint.email}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone:
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {complaint.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Grievance Description Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
              Reported Situation & Description
            </h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>
          </div>

          {/* Attached Photo */}
          {complaint.imageUrl && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Citizen Evidence Photo</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 flex items-center justify-center max-h-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={complaint.imageUrl}
                  alt="Site evidence"
                  className="max-h-80 w-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* Status Update & Remark Action Box (Officer Controls) */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-slate-900 dark:to-blue-950/20 border-2 border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider border-b border-blue-200/60 dark:border-blue-900/50 pb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Officer Action & Status Updater</span>
            </div>

            {statusMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Update Grievance Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {COMPLAINT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Acting Officer */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Signing Officer
                  </label>
                  <input
                    type="text"
                    disabled
                    value={adminUser?.name || "Chief Grievance Officer"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Officer Action Remarks / Resolution Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Field inspection conducted. Contractor issued repair notice with a 48-hour completion deadline..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {updating ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Commit Status Update & Append Timeline</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Live Timeline Record */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Full Audit Timeline</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Public and internal chronological record
            </p>
          </div>

          <Timeline timeline={complaint.timeline} />
        </div>
      </div>
    </div>
  );
}

export default function AdminComplaintDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ComplaintDetailContent params={params} />
    </Suspense>
  );
}
