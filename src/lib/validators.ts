import { z } from "zod";

/**
 * Basic HTML / script sanitization to prevent XSS.
 * Removes dangerous tags and replaces angle brackets.
 */
export function sanitizeString(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim();
}

/**
 * Protect against NoSQL injection by ensuring inputs are simple primitives,
 * preventing object injections like { "$gt": "" }.
 */
export function sanitizeQueryInput(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }
  return input.trim();
}

// Allowed complaint categories
export const COMPLAINT_CATEGORIES = [
  "Roads",
  "Water",
  "Electricity",
  "Sanitation",
  "Education",
  "Health",
  "Other",
] as const;

export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number];

// Allowed complaint statuses
export const COMPLAINT_STATUSES = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
] as const;

export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const complaintSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .transform(sanitizeString),
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9+ -]+$/, "Phone number can only contain digits and + -")
    .trim(),
  category: z.enum(COMPLAINT_CATEGORIES, {
    message: "Please select a valid category",
  }),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title cannot exceed 150 characters")
    .transform(sanitizeString),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description cannot exceed 3000 characters")
    .transform(sanitizeString),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location cannot exceed 200 characters")
    .transform(sanitizeString),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Allow data:image URI up to 3MB or standard HTTP URL
      if (val.startsWith("data:image/")) {
        // approx 4MB string length for 3MB binary
        return val.length < 4 * 1024 * 1024;
      }
      return val.startsWith("http://") || val.startsWith("https://");
    }, "Image must be a valid image file under 3MB or a valid URL"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .transform(sanitizeString),
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional()
    .or(z.literal("")),
});

export const updateStatusSchema = z.object({
  status: z.enum(COMPLAINT_STATUSES, {
    message: "Invalid status value",
  }),
  remarks: z
    .string()
    .min(3, "Remarks must be at least 3 characters")
    .max(1000, "Remarks cannot exceed 1000 characters")
    .transform(sanitizeString),
  officerName: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeString(val) : "Grievance Officer")),
});
