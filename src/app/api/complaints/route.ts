import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Complaint from "@/models/Complaint";
import { complaintSchema, sanitizeQueryInput } from "@/lib/validators";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getAuthUser } from "@/lib/auth";

/**
 * GET /api/complaints
 * Fetch complaints with search, category/status filtering, and pagination.
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = sanitizeQueryInput(searchParams.get("search") || "");
    const category = sanitizeQueryInput(searchParams.get("category") || "");
    const status = sanitizeQueryInput(searchParams.get("status") || "");
    const startDate = sanitizeQueryInput(searchParams.get("startDate") || "");
    const endDate = sanitizeQueryInput(searchParams.get("endDate") || "");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const sortBy = searchParams.get("sortBy") === "asc" ? 1 : -1;

    // Build Mongoose filter safely without NoSQL injection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // End of that day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { complaintId: regex },
        { title: regex },
        { description: regex },
        { location: regex },
        { name: regex },
        { email: regex },
      ];
    }

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: sortBy })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      complaints,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/complaints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/complaints
 * Submit a new grievance.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    // Rate limit: 6 complaint submissions per 10 minutes per IP
    const rateCheck = checkRateLimit(`submit:${ip}`, 6, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Submission rate limit exceeded. Please wait ${rateCheck.resetInSeconds} seconds before submitting another grievance.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = complaintSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if citizen is logged in
    const authUser = await getAuthUser();

    const complaintData = {
      ...validation.data,
      userId: authUser?.userId || undefined,
    };

    const newComplaint = await Complaint.create(complaintData);

    return NextResponse.json(
      {
        success: true,
        message: "Grievance submitted successfully",
        complaintId: newComplaint.complaintId,
        complaint: newComplaint,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/complaints error:", error);
    return NextResponse.json(
      { error: "Failed to submit grievance. Please try again later." },
      { status: 500 }
    );
  }
}
