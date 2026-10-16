import React from "react";
import Link from "next/link";
import { ShieldAlert, Heart, Phone, MapPin, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Emergency & Helpline strip */}
      <div className="bg-slate-950/80 border-b border-slate-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Phone className="w-3.5 h-3.5" />
            <span>Civic Emergency Helplines:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>National Emergency: <strong className="text-white">112</strong></span>
            <span>•</span>
            <span>Water Supply: <strong className="text-white">1916</strong></span>
            <span>•</span>
            <span>Electricity Board: <strong className="text-white">1912</strong></span>
            <span>•</span>
            <span>Municipal Sanitation: <strong className="text-white">1800-233-1224</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">Jan Awaz Portal</span>
                <p className="text-xs text-orange-400 font-medium">जन आवाज सेवा</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An open, citizen-first public grievance redressal portal bridging
              the gap between residents and civic authorities for prompt,
              accountable resolution of municipal issues.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/submit" className="hover:text-blue-400 transition-colors">
                  Submit New Grievance
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-blue-400 transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Citizen Account & History
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-blue-400 transition-colors">
                  Officer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Major Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Roads & Infrastructure</li>
              <li>Drinking Water & Drainage</li>
              <li>Electricity & Streetlights</li>
              <li>Public Sanitation & Waste</li>
              <li>Public Health & Vector Control</li>
              <li>School & Education Amenities</li>
            </ul>
          </div>

          {/* College Project Attribution */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Project</span>
            </div>
            <p className="text-xs font-medium text-white">
              Sir Bhavsinhji Polytechnic Institute of Technology
            </p>
            <p className="text-[11px] text-slate-400">
              Department of Information Technology (5th Semester)
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>Bhavnagar, Gujarat, India</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Jan Awaz Portal. Developed for Public Welfare & Academic Excellence.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using Next.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
