import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getOTP, deleteOTP } from "@/lib/utils/otpStore";
import { generateToken } from "@/lib/utils/jwt";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Get stored OTP
    const stored = getOTP(email);
    if (!stored || !stored.hashedOTP) {
      return NextResponse.json(
        { error: "OTP not found or expired" },
        { status: 400 }
      );
    }

    // 2️⃣ Verify OTP
    const isValid = await bcrypt.compare(otp, stored.hashedOTP);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 401 }
      );
    }

    // 3️⃣ Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(stored.password, 10);

      user = await prisma.user.create({
        data: {
          name: stored.name,
          email,
          password: hashedPassword,
          role: stored.role,
        },
      });
    }

    // 4️⃣ Cleanup OTP
    deleteOTP(email);

    // 5️⃣ Generate JWT
    const token = generateToken(user);

    return NextResponse.json(
      { token, user },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
