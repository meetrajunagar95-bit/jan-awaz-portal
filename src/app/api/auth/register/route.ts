import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many registration attempts. Please wait ${rateCheck.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;

    const db = await connectToDatabase();

    if (!db) {
      const existing = memoryStore.getUserByEmail(email);
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      const hashedPassword = await hashPassword(password);
      const newUser = memoryStore.createUser({
        name,
        email,
        passwordHash: hashedPassword,
        role: "citizen",
        phone: phone || undefined,
      });

      const tokenPayload = {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      const token = signToken(tokenPayload);
      await setAuthCookie(token);

      return NextResponse.json(
        {
          success: true,
          message: "Registration successful",
          user: tokenPayload,
        },
        { status: 201 }
      );
    }

    try {
      // Check if user already exists
      const existing = await User.findOne({ email });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "citizen",
        phone: phone || undefined,
      });

      const tokenPayload = {
        userId: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      const token = signToken(tokenPayload);
      await setAuthCookie(token);

      return NextResponse.json(
        {
          success: true,
          message: "Registration successful",
          user: tokenPayload,
        },
        { status: 201 }
      );
    } catch {
      // Memory fallback
      const existing = memoryStore.getUserByEmail(email);
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      const hashedPassword = await hashPassword(password);
      const newUser = memoryStore.createUser({
        name,
        email,
        passwordHash: hashedPassword,
        role: "citizen",
        phone: phone || undefined,
      });

      const tokenPayload = {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      const token = signToken(tokenPayload);
      await setAuthCookie(token);

      return NextResponse.json(
        {
          success: true,
          message: "Registration successful",
          user: tokenPayload,
        },
        { status: 201 }
      );
    }
  } catch (error: unknown) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
