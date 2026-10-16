import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Code2,
  Database,
  Globe2,
  Send,
  Layers,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      {/* Title & Vision */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>Diploma in Information Technology — Semester 5 Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Jan Awaz Portal
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          &ldquo;Jan Awaz&rdquo; (The Voice of the People) is a full-stack civic technology
          platform designed to modernize municipal public grievance redressal through
          transparency, accountability, and real-time tracking.
        </p>
      </div>

      {/* College & Author Attribution Card */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Institutional Affiliation
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Sir Bhavsinhji Polytechnic Institute of Technology
            </h2>
            <p className="text-xs text-slate-300">
              Government of Gujarat, Directorate of Technical Education • Bhavnagar, Gujarat
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 uppercase font-semibold">Course & Branch</span>
            <p className="font-bold text-white text-sm mt-1">Diploma in Information Technology</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 uppercase font-semibold">Academic Semester</span>
            <p className="font-bold text-white text-sm mt-1">5th Semester Major Project</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 uppercase font-semibold">Project Domain</span>
            <p className="font-bold text-white text-sm mt-1">Full-Stack Civic E-Governance</p>
          </div>
        </div>
      </div>

      {/* Problem Statement & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">The Problem</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Disconnected Citizens & Lost Complaints
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            In traditional municipal systems, citizens file paper complaints or post on unmonitored
            social media groups without any guaranteed ticket number or timeline. Issues linger for
            months without accountability, causing repeated road hazards, water leaks, and hygiene risks.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Solution</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Direct Digital Channel with Audit Trail
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Jan Awaz Portal generates a verifiable Complaint ID (e.g. JA-2026-0001) for every issue.
            Every status update by municipal engineers appends an immutable timeline with timestamps,
            action notes, and accountable officer signatures.
          </p>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Modern Cloud Architecture
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Technical Stack & Justification
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Selected intentionally to deliver 24x7 high availability without needing a personal PC server.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <Code2 className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Next.js 16 (App Router)</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Provides unified React server components and serverless API endpoints for optimal SEO and performance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <Database className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">MongoDB Atlas + Mongoose</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cloud NoSQL database free tier running 24x7 with Mongoose schema validation and timeline arrays.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <Layers className="w-6 h-6 text-cyan-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tailwind CSS</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Utility-first responsive styling with civic design tokens, dark mode support, and accessibility.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <Globe2 className="w-6 h-6 text-purple-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Vercel Serverless Edge</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Continuous 24x7 cloud deployment with automatic SSL, zero server maintenance, and fast response times.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Lodge a Grievance Now</span>
        </Link>
      </div>
    </div>
  );
}
