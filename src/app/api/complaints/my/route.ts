import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Complaint from "@/models/Complaint";
import { getAuthUser } from "@/lib/auth";
import { memoryStore } from "@/lib/memory-store";

/**
 * GET /api/complaints/my
 * Fetch complaints submitted by the logged-in citizen
 */
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view your complaints." },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      const citizenComplaints = memoryStore.getComplaints({
        userId: user.userId,
        email: user.email,
      });

      return NextResponse.json({
        success: true,
        complaints: citizenComplaints,
      });
    }

    try {
      const complaints = await Complaint.find({
        $or: [{ userId: user.userId }, { email: user.email.toLowerCase() }],
      })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        complaints,
      });
    } catch {
      const citizenComplaints = memoryStore.getComplaints({
        userId: user.userId,
        email: user.email,
      });

      return NextResponse.json({
        success: true,
        complaints: citizenComplaints,
      });
    }
  } catch (error: unknown) {
    console.error("GET /api/complaints/my error:", error);
    return NextResponse.json(
      { error: "Failed to fetch citizen complaints" },
      { status: 500 }
    );
  }
}
