import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: true, hasActiveBooking: false });
    }

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");

    if (!serviceId) {
      return NextResponse.json({ success: false, error: "Missing serviceId" }, { status: 400 });
    }

    await connectDB();

    // Get beginning of today in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find any paid booking for this service that is scheduled for today or in the future
    const activeBooking = await Booking.findOne({
      user: session.user.id,
      service: serviceId,
      paymentStatus: "paid",
      date: { $gte: today }
    })
      .select("_id")
      .lean();

    if (activeBooking) {
      return NextResponse.json({
        success: true,
        hasActiveBooking: true,
        bookingId: (activeBooking as any)._id.toString()
      });
    }

    return NextResponse.json({ success: true, hasActiveBooking: false });
  } catch (error: any) {
    console.error("Error checking active booking:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
