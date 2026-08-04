import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { getBookingById } from "@/services/booking.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { IBooking, ITemple } from "@/types";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import { connectDB } from "@/lib/db";
import { BookingReviewForm } from "@/components/bookings/BookingReviewForm";
import { AdminBookingStatusChanger } from "@/components/admin/AdminBookingStatusChanger";
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Users, 
  Gift, 
  Wallet, 
  MessageSquare, 
  Info
} from "lucide-react";

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

  const backLink = session.user.role === "admin" ? "/admin/bookings" : "/user/bookings";

  return (
    <DashboardShell
      title="Booking Details"
      subtitle={`Booking #${booking._id.toString().slice(-8).toUpperCase()}`}
      action={<Link href={backLink} className="text-saffron text-sm hover:underline">← All Bookings</Link>}
    >
      {/* 2-Column Responsive Grid to avoid empty side space and make layout professional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ────── LEFT COLUMN: MAIN CONTENT (2/3 width) ────── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Success Banner */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="font-heading text-xl md:text-2xl text-foreground">Booking Confirmed!</h1>
                    <p className="text-xs text-muted-foreground">Order Ref: #{booking._id.toString().slice(-12).toUpperCase()}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  Your booking for <span className="font-semibold text-foreground">{booking.serviceName}</span> is successful. We will perform the puja with full devotion.
                </p>
              </div>
              
              {/* Puja / Temple Image Banner Thumbnail */}
              <div className="hidden sm:block shrink-0 relative w-24 h-24 rounded-2xl overflow-hidden border border-border shadow-sm bg-background">
                <Image 
                  src={serviceImage || (typeof booking.temple === "object" && booking.temple.coverImage) || "/kasbeswari.jpg"} 
                  alt={booking.serviceName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {session.user.role === "admin" && (
              <div className="border-t border-border/50 mt-4 pt-3 flex justify-end">
                <AdminBookingStatusChanger bookingId={booking._id.toString()} currentStatus={booking.status} />
              </div>
            )}
          </div>

          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Booking ID Card */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Booking ID</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-base md:text-lg font-bold text-green-600 tracking-wide select-all">
                  EP-{booking._id.toString().slice(-8).toUpperCase()}
                </span>
                <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 text-xs font-bold">
                  ✓
                </span>
              </div>
            </div>

            {/* Puja Date Card */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-saffron" />
                Puja Date
              </span>
              <div className="mt-2">
                <span className="font-heading text-base text-foreground">
                  {formatDate(booking.date)}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Vedic Muhurat Scheduled</p>
              </div>
            </div>
          </div>

          {/* Devotee Details */}
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
            <h2 className="font-heading text-base md:text-lg text-foreground mb-4 border-b border-border/40 pb-2">Devotee Information</h2>
            <dl className="grid grid-cols-2 gap-4 text-xs md:text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-foreground mt-0.5">{booking.devoteeName}</dd>
              </div>
              {booking.gotra && (
                <div>
                  <dt className="text-muted-foreground">Gotra</dt>
                  <dd className="font-medium text-foreground mt-0.5">{booking.gotra}</dd>
                </div>
              )}
              {booking.sankalp && (
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Sankalp / Intention</dt>
                  <dd className="font-medium text-foreground mt-0.5 leading-relaxed">{booking.sankalp}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Booking Details Box */}
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 space-y-5 shadow-sm">
            <h3 className="font-heading text-base md:text-lg text-foreground border-b border-border/40 pb-2">Your Booking Details</h3>
            
            {/* Service Card */}
            <div className="flex gap-4 p-4 bg-muted/30 border border-border/50 rounded-2xl">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border border-border/80 bg-background">
                <Image
                  src={typeof booking.temple === "object" ? (booking.temple.coverImage || "/kasbeswari.jpg") : "/kasbeswari.jpg"}
                  alt={booking.serviceName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-heading text-sm md:text-base text-foreground leading-snug">{booking.serviceName}</h4>
                    <span className="font-heading text-sm md:text-base text-saffron shrink-0">
                      {formatCurrency(booking.selectedPackagePrice || (booking.amount - (booking.selectedChadawa?.reduce((sum: number, item: any) => sum + (item.total || (item.price * item.qty)), 0) || 0) - (booking.prasadDelivery ? 151 : 0) - (booking.dakshina || 0)))}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-saffron shrink-0" />
                    {typeof booking.temple === "object" ? booking.temple.name : "Temple"}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={({ pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" } as any)[booking.status] || "pending"}>
                    {booking.status}
                  </Badge>
                  {booking.selectedPackage && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {booking.selectedPackage}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Chadawa Items (If exists) */}
            {((booking.selectedChadawa && booking.selectedChadawa.length > 0) || (booking.selectedItems && booking.selectedItems.length > 0)) && (
              <div className="border-t border-border/50 pt-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sacred Offerings Added</p>
                <div className="space-y-2">
                  {/* Puja Chadawa */}
                  {booking.selectedChadawa?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-saffron shrink-0" />
                        {item.name} <span className="text-saffron font-semibold">×{item.qty}</span>
                      </span>
                      <span className="font-medium text-foreground">{formatCurrency(item.total || (item.price * item.qty))}</span>
                    </div>
                  ))}
                  
                  {/* Standard Chadawa Items */}
                  {booking.selectedItems?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-saffron shrink-0" />
                        {item.name} <span className="text-saffron font-semibold">×{item.qty}</span>
                      </span>
                      <span className="font-medium text-foreground">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prasad Delivery Fee */}
            {booking.prasadDelivery && (
              <div className="border-t border-border/50 pt-3 flex justify-between text-xs text-muted-foreground">
                <span>Prasad Delivery Fee</span>
                <span className="font-medium text-foreground">{booking.serviceType === "puja" ? "₹151" : "Requested"}</span>
              </div>
            )}

            {/* Pandit Ji Dakshina */}
            {booking.dakshina && booking.dakshina > 0 ? (
              <div className="border-t border-border/50 pt-3 flex justify-between text-xs text-muted-foreground">
                <span>Pandit Ji Dakshina</span>
                <span className="font-medium text-foreground">{formatCurrency(booking.dakshina)}</span>
              </div>
            ) : null}

            {/* Payment summary footer */}
            <div className="border-t border-border/50 pt-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-saffron" />
                Total Paid
              </span>
              <span className="font-heading text-lg text-saffron">{formatCurrency(booking.amount)}</span>
            </div>
          </div>

          {/* Subscription Schedule */}
          {subscriptionBookings.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
              <h2 className="font-heading text-base text-foreground mb-4">📅 Subscription Schedule ({booking.subscriptionDuration} Months)</h2>
              <div className="space-y-3">
                {subscriptionBookings.map((b: any, idx: number) => (
                  <div 
                    key={b._id} 
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs md:text-sm transition-all ${
                      b._id === booking._id.toString() 
                        ? "border-saffron bg-saffron/5 shadow-sm" 
                        : "border-border bg-card-bg/40 hover:bg-card-bg/70"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-1.5">
                        <span>Cycle {b.subscriptionCycleIndex} of {b.subscriptionDuration}</span>
                        {b._id === booking._id.toString() && (
                          <span className="bg-saffron text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                            Viewing
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(b.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={({ pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" } as any)[b.status] || "pending"}>
                        {b.status}
                      </Badge>
                      {b._id !== booking._id.toString() && (
                        <Link href={`/user/bookings/${b._id}`} className="text-xs text-saffron hover:underline font-semibold">
                          Details →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prasad Delivery Address */}
          {booking.prasadDelivery && (
            <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
              <h2 className="font-heading text-base text-foreground mb-3">Prasad Delivery Address</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{booking.prasadAddress || "Address not provided"}</p>
            </div>
          )}

          {/* Payment Reference */}
          {booking.paymentId && (
            <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
              <h2 className="font-heading text-base text-foreground mb-4">Payment Reference</h2>
              <dl className="space-y-2 text-xs md:text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Payment ID</dt>
                  <dd className="font-mono text-foreground text-xs select-all">{booking.paymentId}</dd>
                </div>
                {booking.orderId && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Order ID</dt>
                    <dd className="font-mono text-foreground text-xs select-all">{booking.orderId}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Video Prasad */}
          {booking.videoUrl && (
            <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
              <h2 className="font-heading text-base text-foreground mb-3">Puja Video 🙏</h2>
              <video src={booking.videoUrl} controls className="w-full rounded-xl" />
            </div>
          )}

          {/* Marketing Attribution Details (Admin Only) */}
          {session.user.role === "admin" && (booking.utmSource || booking.utmMedium || booking.utmCampaign || booking.fbclid) && (
            <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
              <h2 className="font-heading text-base text-foreground mb-4">Marketing Attribution (Admin Only)</h2>
              <dl className="space-y-2 text-xs md:text-sm">
                {booking.utmSource && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">UTM Source</dt>
                    <dd className="font-medium text-foreground select-all">{booking.utmSource}</dd>
                  </div>
                )}
                {booking.utmMedium && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">UTM Medium</dt>
                    <dd className="font-medium text-foreground select-all">{booking.utmMedium}</dd>
                  </div>
                )}
                {booking.utmCampaign && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">UTM Campaign</dt>
                    <dd className="font-medium text-foreground select-all">{booking.utmCampaign}</dd>
                  </div>
                )}
                {booking.fbclid && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground shrink-0">FB Click ID</dt>
                    <dd className="font-mono text-foreground text-xs select-all truncate max-w-[280px]" title={booking.fbclid}>{booking.fbclid}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Review Form */}
          {(booking.status === "completed" || booking.status === "confirmed") && bookingUserId === session.user.id && (
            <BookingReviewForm
              bookingId={booking._id.toString()}
              templeId={typeof booking.temple === "object" ? booking.temple._id.toString() : booking.temple}
              initialReview={review}
              defaultReviewerName={booking.devoteeName || session?.user?.name || ""}
              defaultCity={(session?.user as any)?.city || ""}
            />
          )}
        </div>

        {/* ────── RIGHT COLUMN: SIDEBAR (1/3 width) ────── */}
        <div className="space-y-6">
          
          {/* What Happens Next? Flowchart Section */}
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2">
              <Calendar className="w-5 h-5 text-saffron" />
              <h3 className="font-heading text-base text-foreground">What Happens Next?</h3>
            </div>
            
            {/* Step Timeline (Vertical Stack on Sidebar) */}
            <div className="space-y-6 relative pl-6 border-l-2 border-saffron/10 ml-3.5">
              
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-heading text-xs font-bold border-2 border-background">
                  1
                </div>
                <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight">Booking Confirmed</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">We have successfully received your booking and devotee details.</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-heading text-xs font-bold border-2 border-background">
                  2
                </div>
                <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight">Puja Performed</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Priest will conduct the sacred ritual on <span className="font-semibold text-saffron">{formatDate(booking.date)}</span>.</p>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-heading text-xs font-bold border-2 border-background">
                  3
                </div>
                <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight">Video Shared</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Live photos and video proof will be shared directly on WhatsApp.</p>
              </div>
              
              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-heading text-xs font-bold border-2 border-background">
                  4
                </div>
                <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight">Prasad Delivery</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Sacred Prasad will be packed and shipped to your address.</p>
              </div>
            </div>
          </div>

          {/* WhatsApp Notification Alert */}
          {booking.whatsappPhone && (
            <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-4.5 flex items-start gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.016 14.11 1.001 12.008 1c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L2.46 21.052l4.187-1.898zm11.111-5.158c-.3-.15-1.774-.875-2.031-.969-.258-.094-.446-.14-.633.14-.187.281-.726.906-.89 1.094-.164.188-.328.21-.628.06-1.3-.65-2.292-1.144-3.238-2.766-.252-.43.252-.4.72-.943.08-.094.04-.176-.02-.326-.06-.15-.446-1.077-.611-1.477-.16-.39-.348-.337-.478-.344-.124-.007-.267-.008-.41-.008-.143 0-.377.054-.574.271-.197.216-.752.734-.752 1.79s.77 2.078.878 2.224c.108.146 1.516 2.315 3.673 3.247.513.222.913.355 1.225.454.515.163.984.14 1.354.085.412-.061 1.774-.726 2.022-1.428.249-.702.249-1.303.174-1.428-.075-.124-.26-.188-.56-.338z" />
                </svg>
              </div>
              <p className="text-xs text-green-800 leading-normal">
                You will receive live photo and video updates on WhatsApp: <span className="font-semibold">{booking.whatsappPhone}</span>
              </p>
            </div>
          )}

          {/* Need Help Card */}
          <div className="bg-gradient-to-br from-saffron/5 to-deep-gold/5 border border-amber-100 rounded-3xl p-5 space-y-4 shadow-sm">
            <div>
              <h4 className="font-heading text-sm md:text-base text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-saffron" />
                Need Help?
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Our support team is here for you. We provide instant response and booking assistance.</p>
            </div>
            <a
              href={`https://wa.me/919976543210?text=Hi, I need help with my booking EP-${booking._id.toString().slice(-8).toUpperCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow transition flex items-center justify-center gap-1.5 w-full text-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.016 14.11 1.001 12.008 1c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L2.46 21.052l4.187-1.898zm11.111-5.158c-.3-.15-1.774-.875-2.031-.969-.258-.094-.446-.14-.633.14-.187.281-.726.906-.89 1.094-.164.188-.328.21-.628.06-1.3-.65-2.292-1.144-3.238-2.766-.252-.43.252-.4.72-.943.08-.094.04-.176-.02-.326-.06-.15-.446-1.077-.611-1.477-.16-.39-.348-.337-.478-.344-.124-.007-.267-.008-.41-.008-.143 0-.377.054-.574.271-.197.216-.752.734-.752 1.79s.77 2.078.878 2.224c.108.146 1.516 2.315 3.673 3.247.513.222.913.355 1.225.454.515.163.984.14 1.354.085.412-.061 1.774-.726 2.022-1.428.249-.702.249-1.303.174-1.428-.075-.124-.26-.188-.56-.338z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Important Note Info Bar */}
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4.5 flex items-start gap-3 shadow-sm">
            <Info className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-normal">
              Please ensure your WhatsApp number is active to receive your Puja photo, video, and delivery updates.
            </p>
          </div>

          {/* Saffron Sanskrit Shloka Box */}
          <div className="bg-saffron/10 border border-saffron/20 rounded-3xl p-5 space-y-3 shadow-sm">
            <div className="text-3xl text-saffron select-none">ॐ</div>
            <div>
              <p className="font-sanskrit text-saffron/90 text-sm leading-relaxed font-medium">
                सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः।<br />
                सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत्॥
              </p>
              <p className="text-[9px] text-muted-foreground/80 mt-2">
                May all sentient beings be at peace, may no one suffer from illnesses, may all see auspiciousness, and may none experience misery.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
