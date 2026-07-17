import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import { sendOtp } from "@/services/aisensy.service";
import { z } from "zod";

const SendOtpSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SendOtpSchema.parse(body);

    await connectDB();

    const phone = data.phone.trim();
    // Clean phone number (remove spaces, dashes, parentheses, plus sign)
    const cleanPhone = phone.replace(/[\s\-()+]/g, "");

    // Generate a 6-digit random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5 minutes validity
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save or update the OTP in MongoDB
    await Otp.findOneAndUpdate(
      { phone: cleanPhone },
      { otp: generatedOtp, expiresAt },
      { upsert: true, new: true }
    );

    // Send the OTP via AiSensy
    const result = await sendOtp(cleanPhone, data.name, generatedOtp);

    if (result.simulated) {
      return NextResponse.json({
        success: true,
        simulated: true,
        otp: generatedOtp,
      });
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to send OTP via WhatsApp" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send OTP";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
