import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";
import Temple from "@/models/Temple";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Fetch the latest 12 reviews and populate user & temple names
    const reviews = await Review.find()
      .populate("user", "name city")
      .populate("temple", "name")
      .populate("booking", "devoteeName")
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const totalReviews = await Review.countDocuments();
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" }
        }
      }
    ]);
    const averageRating = stats.length > 0 && stats[0].avgRating 
      ? Number(stats[0].avgRating.toFixed(1)) 
      : 4.8;

    return NextResponse.json({
      success: true,
      data: reviews,
      totalReviews,
      averageRating,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load testimonials" },
      { status: 500 }
    );
  }
}
