import mongoose, { Schema, Document, Model } from "mongoose";

export type ComplaintCategory =
  | "Roads"
  | "Water"
  | "Electricity"
  | "Sanitation"
  | "Education"
  | "Health"
  | "Other";

export type ComplaintStatus =
  | "Pending"
  | "In Progress"
  | "Resolved"
  | "Rejected";

export interface ITimelineItem {
  status: ComplaintStatus;
  message: string;
  updatedBy: string;
  timestamp: Date;
}

export interface IComplaint extends Document {
  complaintId: string;
  name: string;
  email: string;
  phone: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  status: ComplaintStatus;
  remarks?: string;
  timeline: ITimelineItem[];
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineItemSchema = new Schema<ITimelineItem>(
  {
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    updatedBy: {
      type: String,
      required: true,
      default: "System",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ComplaintSchema = new Schema<IComplaint>(
  {
    complaintId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Citizen name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Roads",
        "Water",
        "Electricity",
        "Sanitation",
        "Education",
        "Health",
        "Other",
      ],
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Detailed description is required"],
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    location: {
      type: String,
      required: [true, "Location or area is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
      index: true,
    },
    remarks: {
      type: String,
      default: "Complaint received and queued for review.",
      trim: true,
    },
    timeline: {
      type: [TimelineItemSchema],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate unique Complaint ID (e.g., JA-2026-0001)
ComplaintSchema.pre("save", async function () {
  if (!this.complaintId) {
    const currentYear = new Date().getFullYear();
    // Count existing complaints for this year to create sequential ID
    const count = await mongoose.models.Complaint.countDocuments();
    const sequentialNum = String(count + 1).padStart(4, "0");
    this.complaintId = `JA-${currentYear}-${sequentialNum}`;
  }

  // If timeline is empty on creation, add initial entry
  if (this.timeline.length === 0) {
    this.timeline.push({
      status: this.status || "Pending",
      message: "Grievance submitted by citizen and registered in portal.",
      updatedBy: "Citizen Portal",
      timestamp: new Date(),
    });
  }
});

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);

export default Complaint;
