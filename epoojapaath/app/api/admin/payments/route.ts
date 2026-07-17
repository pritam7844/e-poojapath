import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import "@/models/User";
import "@/models/Booking";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, any> = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate("user", "name email phone")
      .populate("booking", "serviceName serviceType date devoteeName whatsappPhone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    console.error("Error fetching payments admin:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
