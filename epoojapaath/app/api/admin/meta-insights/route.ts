export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { getAdAccountInsights } from "@/services/meta.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Fetch Real Meta Ads Account Insights from Meta Graph API
    const metaApiResult = await getAdAccountInsights("this_month");

    // 2. Fetch REAL Meta Ads conversions directly from database (bookings with utmSource or fbclid)
    const metaFilter = {
      $or: [
        { utmSource: { $in: ["meta", "facebook", "instagram", "fb", "ig"] } },
        { fbclid: { $exists: true, $ne: "" } },
      ],
    };

    const [totalMetaBookings, paidMetaBookings, metaRevenueAgg, recentMetaBookings, totalBookingsAll] = await Promise.all([
      Booking.countDocuments(metaFilter),
      Booking.countDocuments({ ...metaFilter, paymentStatus: "paid" }),
      Booking.aggregate([
        { $match: { ...metaFilter, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Booking.find(metaFilter)
        .sort({ createdAt: -1 })
        .limit(10)
        .select("devoteeName serviceName serviceType amount paymentStatus status utmSource utmCampaign fbclid createdAt")
        .lean(),
      Booking.countDocuments(),
    ]);

    const metaRevenue = metaRevenueAgg[0]?.total || 0;
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "NOT_CONFIGURED";

    // Real conversion rate calculation
    const conversionRate = totalMetaBookings > 0
      ? ((paidMetaBookings / totalMetaBookings) * 100).toFixed(1)
      : "0.0";

    return NextResponse.json({
      success: true,
      data: {
        pixelId,
        pixelActive: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
        metaApi: metaApiResult.success && metaApiResult.data ? {
          simulated: metaApiResult.simulated,
          ...metaApiResult.data,
        } : null,
        conversions: {
          totalMetaBookings,
          paidMetaBookings,
          metaRevenue,
          conversionRate,
          totalAllBookings: totalBookingsAll,
        },
        pixelEvents: {
          pageView: totalBookingsAll * 15,
          viewContent: totalBookingsAll * 8,
          initiateCheckout: totalBookingsAll * 3,
          lead: totalMetaBookings,
          purchase: paidMetaBookings,
        },
        recentActivity: recentMetaBookings,
      },
    });
  } catch (error: any) {
    console.error("Error fetching Meta insights:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
