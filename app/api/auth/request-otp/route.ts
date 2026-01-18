import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/utils/emailSender";
import { setOTP } from "@/lib/utils/otpStore";

export async function POST(req: Request) {
  try {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(3),
      password: z.string().min(6),
      role: z.enum(["BUYER", "SELLER"]),
    });

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { email, name, password, role } = body;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Generate 4-digit OTP
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = await bcrypt.hash(otp, 4);

    // Store OTP + signup data
    setOTP(email, {
      hashedOTP,
      name,
      password,
      role,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return NextResponse.json({
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error("Request OTP error:", err);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
