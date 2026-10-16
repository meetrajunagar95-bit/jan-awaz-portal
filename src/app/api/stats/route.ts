import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Complaint from "@/models/Complaint";
import { COMPLAINT_CATEGORIES } from "@/lib/validators";

export async function GET() {
  try {
    await connectToDatabase();

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

    // Ensure all categories have a count even if 0
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
  } catch (error: unknown) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Failed to compute portal statistics" },
      { status: 500 }
    );
  }
}
