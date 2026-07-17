import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Payment from "@/models/Payment";
import "@/models/User";
import { sendBookingConfirmation } from "@/services/aisensy.service";

export async function createBooking(data: Record<string, any>) {
  await connectDB();
  const duration = Number(data.subscriptionDuration || 1);
  const isPaid = data.paymentStatus === "paid";

  if (data.serviceType === "puja" && duration > 1) {
    const puja = await Puja.findById(data.service);
    const interval = puja?.subscriptionType || "monthly";
    const baseDate = new Date(data.date as string);
    const parentId = (data.orderId || data.paymentId || new Date().getTime().toString()) as string;

    const bookings = [];
    for (let i = 0; i < duration; i++) {
      const bookingDate = new Date(baseDate);
      if (interval === "weekly") {
        bookingDate.setDate(baseDate.getDate() + i * 7);
      } else {
        bookingDate.setMonth(baseDate.getMonth() + i);
      }

      const singleBookingData = {
        ...data,
        date: bookingDate,
        subscriptionParentId: parentId,
        subscriptionDuration: duration,
        subscriptionCycleIndex: i + 1,
      };

      const b = await Booking.create(singleBookingData);
      bookings.push(b);
      if (isPaid) {
        await Temple.findByIdAndUpdate(data.temple, { $inc: { totalBookings: 1 } });
        await Puja.findByIdAndUpdate(data.service, { $inc: { totalBooked: 1 } });
      }
    }
    if (data.orderId) {
      await Payment.create({
        user: data.user,
        booking: bookings[0]._id,
        orderId: data.orderId,
        amount: data.amount,
        status: isPaid ? "success" : "pending",
      });
    }
    return bookings[0];
  } else {
    const booking = await Booking.create(data);
    if (isPaid) {
      await Temple.findByIdAndUpdate(data.temple, { $inc: { totalBookings: 1 } });
      if (data.serviceType === "puja") {
        await Puja.findByIdAndUpdate(data.service, { $inc: { totalBooked: 1 } });
      }
    }
    if (data.orderId) {
      await Payment.create({
        user: data.user,
        booking: booking._id,
        orderId: data.orderId,
        amount: data.amount,
        status: isPaid ? "success" : "pending",
      });
    }
    return booking;
  }
}

export async function getUserBookings(userId: string) {
  await connectDB();
  return Booking.find({ user: userId })
    .populate("temple", "name slug coverImage location")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getBookingById(id: string) {
  await connectDB();
  return Booking.findById(id)
    .populate("user", "name email phone")
    .populate("temple", "name slug coverImage contactPhone contactEmail location owner")
    .lean();
}

export async function getTempleBookings(templeId: string) {
  await connectDB();
  return Booking.find({ temple: templeId })
    .populate("user", "name email phone")
    .sort({ createdAt: -1 })
    .lean();
}

export async function updateBooking(id: string, updates: Record<string, any>) {
  await connectDB();
  const existing = await Booking.findById(id).populate("user").populate("temple");
  if (!existing) return null;

  const wasPaid = existing.paymentStatus === "paid";
  const isPaidNow = updates.paymentStatus === "paid";

  if (!wasPaid && isPaidNow) {
    try {
      const userObj = existing.user as any;
      const templeObj = existing.temple as any;
      const phone = existing.whatsappPhone || userObj?.phone;
      const name = existing.devoteeName || userObj?.name;

      if (phone && name) {
        const dateStr = new Date(existing.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        sendBookingConfirmation(phone, name, {
          bookingId: existing._id.toString(),
          templeName: templeObj?.name || "Temple",
          serviceName: existing.serviceName || "Puja",
          date: dateStr,
          amount: existing.amount,
        }).catch((err) => {
          console.error("Failed to send booking confirmation WhatsApp in background:", err);
        });
      }
    } catch (err) {
      console.error("Error preparing booking confirmation WhatsApp message:", err);
    }
  }

  let updated;
  if (existing.orderId) {
    if (!wasPaid && isPaidNow) {
      const relatedBookings = await Booking.find({ orderId: existing.orderId });
      for (const rel of relatedBookings) {
        if (rel.paymentStatus !== "paid") {
          await Temple.findByIdAndUpdate(rel.temple, { $inc: { totalBookings: 1 } });
          if (rel.serviceType === "puja") {
            await Puja.findByIdAndUpdate(rel.service, { $inc: { totalBooked: 1 } });
          }
        }
      }
    }
    await Booking.updateMany({ orderId: existing.orderId }, updates);
    updated = await Booking.findById(id);

    // Also update Payment model
    const paymentUpdates: Record<string, any> = {};
    if (updates.paymentStatus === "paid") {
      paymentUpdates.status = "success";
    } else if (updates.paymentStatus === "failed") {
      paymentUpdates.status = "failed";
    }
    if (updates.paymentId) {
      paymentUpdates.paymentId = updates.paymentId;
    }
    if (updates.errorMessage) {
      paymentUpdates.errorMessage = updates.errorMessage;
    }
    await Payment.findOneAndUpdate({ orderId: existing.orderId }, { $set: paymentUpdates });
  } else {
    updated = await Booking.findByIdAndUpdate(id, updates, { new: true });
    if (!wasPaid && isPaidNow) {
      await Temple.findByIdAndUpdate(existing.temple, { $inc: { totalBookings: 1 } });
      if (existing.serviceType === "puja") {
        await Puja.findByIdAndUpdate(existing.service, { $inc: { totalBooked: 1 } });
      }
    }
  }

  return updated;
}

export async function getAllBookingsAdmin(filters: { status?: string; serviceType?: string; paymentStatus?: string } = {}) {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters.status)      query.status = filters.status;
  if (filters.serviceType) query.serviceType = filters.serviceType;
  if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
  return Booking.find(query)
    .populate("user", "name email phone")
    .populate("temple", "name")
    .sort({ createdAt: -1 })
    .lean();
}
