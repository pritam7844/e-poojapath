export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import PixelEvent from "@/models/PixelEvent";
import MetaSetting from "@/models/MetaSetting";
import { getAdAccountInsights } from "@/services/meta.service";

async function getOrCreateMetaSetting() {
  let setting = await MetaSetting.findOne({ pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1347524480826624" });
  if (!setting) {
    setting = await MetaSetting.create({
      pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1347524480826624",
      pageViewOffset: 2872,
      viewContentOffset: 1699,
      initiateCheckoutOffset: 69,
    });
  }
  return setting;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const setting = await getOrCreateMetaSetting();

    // 1. Fetch Meta Ads Account Insights (from Meta Graph API)
    const metaApiResult = await getAdAccountInsights("this_month");

    // 2. Query Real Pixel Events logged in MongoDB since tracking started
    const [dbPageViews, dbViewContents, dbInitiateCheckouts, dbLeads, dbPurchases] = await Promise.all([
      PixelEvent.countDocuments({ eventName: "PageView" }),
      PixelEvent.countDocuments({ eventName: "ViewContent" }),
      PixelEvent.countDocuments({ eventName: "InitiateCheckout" }),
      PixelEvent.countDocuments({ eventName: "Lead" }),
      PixelEvent.countDocuments({ eventName: "Purchase" }),
    ]);

    // 3. Query REAL Bookings & Revenue directly from Database
    const [totalBookings, paidBookings, revenueAgg, recentBookings, metaAdsBookings, metaAdsPaidBookings, metaAdsRevenueAgg] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ paymentStatus: "paid" }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Booking.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .select("devoteeName serviceName serviceType amount paymentStatus status utmSource utmCampaign fbclid createdAt")
        .lean(),
      Booking.countDocuments({
        $or: [
          { utmSource: { $in: ["meta", "facebook", "instagram", "fb", "ig"] } },
          { fbclid: { $exists: true, $ne: "" } },
        ],
      }),
      Booking.countDocuments({
        paymentStatus: "paid",
        $or: [
          { utmSource: { $in: ["meta", "facebook", "instagram", "fb", "ig"] } },
          { fbclid: { $exists: true, $ne: "" } },
        ],
      }),
      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            $or: [
              { utmSource: { $in: ["meta", "facebook", "instagram", "fb", "ig"] } },
              { fbclid: { $exists: true, $ne: "" } },
            ],
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const metaRevenue = metaAdsRevenueAgg[0]?.total || totalRevenue;
    const pixelId = setting.pixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1347524480826624";

    // Real conversion rate calculation
    const conversionRate = totalBookings > 0
      ? ((paidBookings / totalBookings) * 100).toFixed(1)
      : "0.0";

    // Dynamic Pixel Funnel Event calculation combining Meta Events Manager baseline + live tracked events
    const pageView = setting.pageViewOffset + dbPageViews;
    const viewContent = setting.viewContentOffset + dbViewContents;
    const initiateCheckout = setting.initiateCheckoutOffset + dbInitiateCheckouts;
    const lead = Math.max(dbLeads, totalBookings);
    const purchase = Math.max(dbPurchases, paidBookings);

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
          totalMetaBookings: metaAdsBookings > 0 ? metaAdsBookings : totalBookings,
          paidMetaBookings: metaAdsPaidBookings > 0 ? metaAdsPaidBookings : paidBookings,
          metaRevenue,
          conversionRate,
          totalAllBookings: totalBookings,
        },
        pixelEvents: {
          pageView,
          viewContent,
          initiateCheckout,
          lead,
          purchase,
        },
        setting: {
          pageViewOffset: setting.pageViewOffset,
          viewContentOffset: setting.viewContentOffset,
          initiateCheckoutOffset: setting.initiateCheckoutOffset,
        },
        recentActivity: recentBookings,
      },
    });
  } catch (error: any) {
    console.error("Error fetching Meta insights:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { pageViewOffset, viewContentOffset, initiateCheckoutOffset } = body;

    await connectDB();

    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1347524480826624";
    const setting = await MetaSetting.findOneAndUpdate(
      { pixelId },
      {
        $set: {
          ...(pageViewOffset !== undefined && { pageViewOffset: Number(pageViewOffset) }),
          ...(viewContentOffset !== undefined && { viewContentOffset: Number(viewContentOffset) }),
          ...(initiateCheckoutOffset !== undefined && { initiateCheckoutOffset: Number(initiateCheckoutOffset) }),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    console.error("Error updating Meta settings:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
