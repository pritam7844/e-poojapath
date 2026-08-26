import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PixelEvent from "@/models/PixelEvent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, path, utmSource, utmCampaign, utmMedium, fbclid, metadata } = body;

    if (!eventName) {
      return NextResponse.json({ success: false, error: "Missing eventName" }, { status: 400 });
    }

    await connectDB();

    await PixelEvent.create({
      eventName,
      path: path || "",
      utmSource: utmSource || "",
      utmCampaign: utmCampaign || "",
      utmMedium: utmMedium || "",
      fbclid: fbclid || "",
      metadata: metadata || {},
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error logging pixel event:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
