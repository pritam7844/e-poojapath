import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TempleRequest from "@/models/TempleRequest";
import { z } from "zod";

const TempleRequestSchema = z.object({
  templeName: z.string().min(2, "Temple name is too short"),
  deity: z.string().optional(),
  city: z.string().min(2, "City is too short"),
  state: z.string().min(2, "State is too short"),
  contactName: z.string().min(2, "Contact name is too short"),
  phone: z.string().regex(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  notes: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  fbclid: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Parse/validate with zod
    const parsedData = TempleRequestSchema.parse(body);

    // Save to MongoDB
    const request = await TempleRequest.create({
      templeName: parsedData.templeName,
      deity: parsedData.deity || "",
      city: parsedData.city,
      state: parsedData.state,
      contactName: parsedData.contactName,
      phone: parsedData.phone,
      email: parsedData.email || undefined,
      notes: parsedData.notes || "",
      status: "pending",
      utmSource: parsedData.utmSource,
      utmMedium: parsedData.utmMedium,
      utmCampaign: parsedData.utmCampaign,
      fbclid: parsedData.fbclid,
    });

    return NextResponse.json({
      success: true,
      message: "Temple listing request submitted successfully! Our team will contact you shortly. 🙏",
      data: request,
    });
  } catch (err: any) {
    console.error("Error creating temple request:", err);
    if (err instanceof z.ZodError) {
      const errorMsg = err.errors.map(e => e.message).join(", ");
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit request" },
      { status: 500 }
    );
  }
}
