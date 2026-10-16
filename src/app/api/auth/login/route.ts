import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`login:${ip}`, 7, 60 * 1000); // 7 attempts per minute
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const db = await connectToDatabase();

    if (!db) {
      // Memory store fallback
      const user = memoryStore.getUserByEmail(email);
      if (!user || !user.password) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const tokenPayload = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = signToken(tokenPayload);
      await setAuthCookie(token);

      return NextResponse.json({
        success: true,
        message: "Logged in successfully",
        user: tokenPayload,
      });
    }

    try {
      // Query user and explicitly select password (which is select: false)
      const user = await User.findOne({ email }).select("+password");

      if (!user || !user.password) {
        // Fallback check in memory store
        const memUser = memoryStore.getUserByEmail(email);
        if (memUser && memUser.password) {
          const isMatch = await verifyPassword(password, memUser.password);
          if (isMatch) {
            const tokenPayload = {
              userId: memUser._id,
              name: memUser.name,
              email: memUser.email,
              role: memUser.role,
            };
            const token = signToken(tokenPayload);
            await setAuthCookie(token);
            return NextResponse.json({
              success: true,
              message: "Logged in successfully",
              user: tokenPayload,
            });
          }
        }

        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const tokenPayload = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = signToken(tokenPayload);
      await setAuthCookie(token);

      return NextResponse.json({
        success: true,
        message: "Logged in successfully",
        user: tokenPayload,
      });
    } catch {
      // Memory fallback if MongoDB throws error
      const user = memoryStore.getUserByEmail(email);
      if (!user || !user.password) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const tokenPayload = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = signToken(tokenPayload);
      await setAuthCookie(token);

      return NextResponse.json({
        success: true,
        message: "Logged in successfully",
        user: tokenPayload,
      });
    }
  } catch (error: unknown) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
