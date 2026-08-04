import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { getBookingById } from "@/services/booking.service";
import type { IBooking, ITemple } from "@/types";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import { connectDB } from "@/lib/db";
import { BookingDetailClient } from "@/components/bookings/BookingDetailClient";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const booking = await getBookingById(params.id).catch(() => null) as (IBooking & { _id: string; temple: ITemple & { _id: string } }) | null;
  if (!booking) notFound();

  const bookingUserId = typeof booking.user === "object" && booking.user !== null
    ? (booking.user as any)._id?.toString()
    : booking.user?.toString();

  const templeOwnerId = typeof booking.temple === "object" && booking.temple !== null
    ? (booking.temple as any).owner?.toString()
    : null;

  if (bookingUserId !== session.user.id && session.user.role !== "admin" && templeOwnerId !== session.user.id) {
    redirect("/user/bookings");
  }

  await connectDB();
  const reviewRaw = await Review.findOne({ booking: params.id }).lean();
  const review = reviewRaw ? JSON.parse(JSON.stringify(reviewRaw)) : null;

  let subscriptionBookings: any[] = [];
  if (booking.subscriptionParentId) {
    const rawSubs = await Booking.find({ subscriptionParentId: booking.subscriptionParentId })
      .sort({ date: 1 })
      .lean();
    subscriptionBookings = JSON.parse(JSON.stringify(rawSubs));
  }

  let serviceImage = "";
  try {
    if (booking.serviceType === "puja") {
      const pujaDoc = await Puja.findById(booking.service).select("image").lean();
      if (pujaDoc && (pujaDoc as any).image) {
        serviceImage = (pujaDoc as any).image;
      }
    } else if (booking.serviceType === "chadawa") {
      const chadawaDoc = await Chadawa.findById(booking.service).select("image").lean();
      if (chadawaDoc && (chadawaDoc as any).image) {
        serviceImage = (chadawaDoc as any).image;
      }
    }
  } catch (err) {
    console.error("Error fetching service image:", err);
  }

  return (
    <BookingDetailClient
      booking={JSON.parse(JSON.stringify(booking))}
      review={review}
      subscriptionBookings={subscriptionBookings}
      serviceImage={serviceImage}
      userRole={session.user.role}
      userId={session.user.id}
    />
  );
}
