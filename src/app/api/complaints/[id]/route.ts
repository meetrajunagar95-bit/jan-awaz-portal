import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Complaint from "@/models/Complaint";
import { updateStatusSchema } from "@/lib/validators";
import { getAuthUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/complaints/[id]
 * Fetch a single complaint by MongoDB ObjectId or Complaint ID (e.g., JA-2026-0001)
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Complaint identifier is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let complaint = null;

    // Check if the id is a valid Mongo ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint = await Complaint.findById(id);
    }

    // If not found or not ObjectId, query by complaintId (case-insensitive)
    if (!complaint) {
      complaint = await Complaint.findOne({
        complaintId: { $regex: new RegExp(`^${id.trim()}$`, "i") },
      });
    }

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found. Please check your Complaint ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      complaint,
    });
  } catch (error: unknown) {
    console.error("GET /api/complaints/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve complaint details" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/complaints/[id]
 * Update complaint status and append remark to history timeline (Admin protected).
 */
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required to update complaint status." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { status, remarks, officerName } = validation.data;

    await connectToDatabase();

    let complaint = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint = await Complaint.findById(id);
    }
    if (!complaint) {
      complaint = await Complaint.findOne({
        complaintId: { $regex: new RegExp(`^${id.trim()}$`, "i") },
      });
    }

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // Append to timeline
    complaint.timeline.push({
      status,
      message: remarks,
      updatedBy: officerName || authUser.name || "Grievance Officer",
      timestamp: new Date(),
    });

    complaint.status = status;
    complaint.remarks = remarks;

    await complaint.save();

    return NextResponse.json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error: unknown) {
    console.error("PATCH /api/complaints/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update complaint status" },
      { status: 500 }
    );
  }
}
