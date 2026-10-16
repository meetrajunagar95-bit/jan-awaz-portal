import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Complaint from "@/models/Complaint";
import { COMPLAINT_CATEGORIES } from "@/lib/validators";
import { memoryStore } from "@/lib/memory-store";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      const all = memoryStore.getComplaints();
      const total = all.length;
      const pending = all.filter((c) => c.status === "Pending").length;
      const inProgress = all.filter((c) => c.status === "In Progress").length;
      const resolved = all.filter((c) => c.status === "Resolved").length;
      const rejected = all.filter((c) => c.status === "Rejected").length;

      const categoryCounts: Record<string, number> = {};
      for (const cat of COMPLAINT_CATEGORIES) {
        categoryCounts[cat] = all.filter((c) => c.category === cat).length;
      }

      const recentComplaints = all.slice(0, 5).map((c) => ({
        complaintId: c.complaintId,
        title: c.title,
        category: c.category,
        status: c.status,
        createdAt: c.createdAt,
        location: c.location,
      }));

      const resolutionRate =
        total > 0 ? Math.round((resolved / total) * 100) : 0;

      return NextResponse.json({
        success: true,
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          rejected,
          resolutionRate,
          categoryCounts,
          recentComplaints,
        },
      });
    }

    try {
      const [
        total,
        pending,
        inProgress,
        resolved,
        rejected,
        categoryCountsRaw,
        recentComplaints,
      ] = await Promise.all([
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: "Pending" }),
        Complaint.countDocuments({ status: "In Progress" }),
        Complaint.countDocuments({ status: "Resolved" }),
        Complaint.countDocuments({ status: "Rejected" }),
        Complaint.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
        ]),
        Complaint.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("complaintId title category status createdAt location")
          .lean(),
      ]);

      const categoryCounts: Record<string, number> = {};
      for (const cat of COMPLAINT_CATEGORIES) {
        categoryCounts[cat] = 0;
      }
      for (const item of categoryCountsRaw) {
        if (item._id && categoryCounts[item._id] !== undefined) {
          categoryCounts[item._id] = item.count;
        }
      }

      const resolutionRate =
        total > 0 ? Math.round((resolved / total) * 100) : 0;

      return NextResponse.json({
        success: true,
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          rejected,
          resolutionRate,
          categoryCounts,
          recentComplaints,
        },
      });
    } catch {
      const all = memoryStore.getComplaints();
      const total = all.length;
      const pending = all.filter((c) => c.status === "Pending").length;
      const inProgress = all.filter((c) => c.status === "In Progress").length;
      const resolved = all.filter((c) => c.status === "Resolved").length;
      const rejected = all.filter((c) => c.status === "Rejected").length;

      const categoryCounts: Record<string, number> = {};
      for (const cat of COMPLAINT_CATEGORIES) {
        categoryCounts[cat] = all.filter((c) => c.category === cat).length;
      }

      const recentComplaints = all.slice(0, 5);
      const resolutionRate =
        total > 0 ? Math.round((resolved / total) * 100) : 0;

      return NextResponse.json({
        success: true,
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          rejected,
          resolutionRate,
          categoryCounts,
          recentComplaints,
        },
      });
    }
  } catch (error: unknown) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Failed to generate system analytics" },
      { status: 500 }
    );
  }
}
