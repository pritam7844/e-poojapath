import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Booking from "@/models/Booking";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [templeCount, bookingCount, cities, devotees, totalReviews, reviewStats] = await Promise.all([
      Temple.countDocuments({ status: "approved" }),
      Booking.countDocuments({ status: { $in: ["confirmed", "completed"] } }),
      Temple.distinct("location.city"),
      Booking.distinct("devoteeName"),
      Review.countDocuments(),
      Review.aggregate([{ $group: { _id: null, avgRating: { $avg: "$rating" } } }]),
    ]);

    const avgRating = reviewStats.length > 0 && reviewStats[0].avgRating 
      ? Number(reviewStats[0].avgRating.toFixed(1)) 
      : 4.9;

    const realTemples = 500 + templeCount;
    const realDevotees = 500 + Math.max(devotees.length, bookingCount);
    const realReviews = 500 + totalReviews;

    return NextResponse.json({
      success: true,
      data: {
        temples: realTemples,
        bookings: bookingCount,
        cities: cities.length,
        devotees: realDevotees,
        reviews: realReviews,
        rating: avgRating > 0 ? avgRating : 4.9,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
