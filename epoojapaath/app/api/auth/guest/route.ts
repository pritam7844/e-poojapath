import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import { z } from "zod";

const GuestSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  otp: z.string().min(6, "Verification code must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = GuestSchema.parse(body);

    await connectDB();

    const phone = data.phone.trim();
    // Clean phone number for consistency (remove spaces, dashes, parentheses, plus sign)
    const cleanPhone = phone.replace(/[\s\-()+]/g, "");

    // 1. Verify OTP first
    // If AiSensy is not configured, we allow "123456" as a test/development fallback
    const isTestFallback = data.otp === "123456" && !process.env.AISENSY_API_KEY;
    if (!isTestFallback) {
      const otpRecord = await Otp.findOne({ phone: cleanPhone });
      if (!otpRecord) {
        return NextResponse.json(
          { success: false, error: "No verification code sent or it has expired. Please send OTP again." },
          { status: 400 }
        );
      }

      if (otpRecord.otp !== data.otp) {
        return NextResponse.json(
          { success: false, error: "Invalid verification code. Please try again." },
          { status: 400 }
        );
      }

      // Check expiry date manually in case TTL background delete hasn't executed yet
      if (new Date() > otpRecord.expiresAt) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return NextResponse.json(
          { success: false, error: "Verification code has expired. Please send OTP again." },
          { status: 400 }
        );
      }

      // Delete the OTP after successful validation to prevent reuse
      await Otp.deleteOne({ _id: otpRecord._id });
    }

    const email = `guest_${cleanPhone}@epoojapaath.com`;

    const secret = process.env.NEXTAUTH_SECRET || "guest_secret_salt_123";
    const rawPassword = `guest_pwd_${cleanPhone}_${secret.substring(0, 8)}`;

    // Find if user already exists with this phone or email
    let user = await User.findOne({
      $or: [{ phone: cleanPhone }, { email: email }],
    });

    if (!user) {
      // In case they bypassed the send OTP check
      const hashedPassword = await bcrypt.hash(rawPassword, 12);
      user = await User.create({
        name: "Devotee",
        email: email,
        phone: cleanPhone,
        password: hashedPassword,
        role: "user",
        isBlocked: false,
      });
    } else {
      if (user.isBlocked) {
        return NextResponse.json(
          { success: false, error: "This mobile number is blocked." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      email: email,
      password: rawPassword,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Guest login failed";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
