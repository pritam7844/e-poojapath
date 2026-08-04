"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BookingReviewForm } from "@/components/bookings/BookingReviewForm";
import { AdminBookingStatusChanger } from "@/components/admin/AdminBookingStatusChanger";
import { DashboardShell } from "@/components/shared/DashboardShell";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Gift,
  Wallet,
  MessageSquare,
  Info,
  ShieldCheck,
  Share2,
  Download,
  Home,
  ArrowRight
} from "lucide-react";

interface BookingDetailClientProps {
  booking: any;
  review: any;
  subscriptionBookings: any[];
  serviceImage: string;
  userRole: string;
  userId: string;
}

export function BookingDetailClient({
  booking,
  review,
  subscriptionBookings,
  serviceImage,
  userRole,
  userId
}: BookingDetailClientProps) {

  const backLink = userRole === "admin" ? "/admin/bookings" : "/user/bookings";

  // Calculations for pricing breakdown
  const chadawaTotal = (booking.selectedChadawa?.reduce((sum: number, item: any) => sum + (item.total || (item.price * item.qty)), 0) || 0) +
    (booking.selectedItems?.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0) || 0);
  const prasadFee = booking.prasadDelivery ? (booking.serviceType === "puja" ? 151 : 0) : 0;
  const dakshinaFee = booking.dakshina || 0;
  const pkgPrice = booking.selectedPackagePrice ?? (booking.amount - chadawaTotal - prasadFee - dakshinaFee);
  const totalChadawaCount = (booking.selectedChadawa?.length || 0) + (booking.selectedItems?.length || 0);

  const bookingUserId = typeof booking.user === "object" && booking.user !== null
    ? (booking.user as any)._id?.toString()
    : booking.user?.toString();

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: 'ePoojapaath Booking',
        text: `My booking for ${booking.serviceName} is confirmed! ID: EP-${booking._id.toString().slice(-8).toUpperCase()}`,
        url: window.location.href,
      }).catch(console.error);
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };

  return (
    <DashboardShell
      title="Booking Details"
      subtitle={`Booking #${booking._id.toString().slice(-8).toUpperCase()}`}
      action={<Link href={backLink} className="text-saffron text-sm hover:underline">← All Bookings</Link>}
    >
      {/* 2-Column Responsive Grid */}
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
                  Thank you for your devotion. Your <span className="font-semibold text-foreground">{booking.serviceName}</span> at {typeof booking.temple === "object" ? booking.temple.name : "the temple"} has been successfully booked. We will perform the puja with full devotion.
                </p>
              </div>

              {/* Puja / Temple Image Banner Thumbnail */}
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border border-border shadow-sm bg-background shrink-0">
                <Image 
                  src={serviceImage || (typeof booking.temple === "object" && booking.temple !== null && booking.temple.coverImage) || "/kasbeswari.jpg"} 
                  alt={booking.serviceName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {userRole === "admin" && (
              <div className="border-t border-border/50 mt-4 pt-3 flex justify-end">
                <AdminBookingStatusChanger bookingId={booking._id.toString()} currentStatus={booking.status} />
              </div>
            )}
          </div>

          {/* Premium 3-Column Metadata Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Booking ID */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Booking ID</span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="font-mono text-base font-bold text-green-600 tracking-wide select-all">
                  EP-{booking._id.toString().slice(-8).toUpperCase()}
                </span>
                <span className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 text-[10px] font-bold">
                  ✓
                </span>
              </div>
            </div>

            {/* Puja Date */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-saffron shrink-0" />
                Puja Date
              </span>
              <div className="mt-2">
                <span className="font-heading text-sm md:text-base text-foreground leading-tight block">
                  {formatDate(booking.date)}
                </span>
              </div>
            </div>

            {/* Total Paid */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Paid</span>
              <div className="mt-2">
                <span className="font-heading text-base md:text-lg text-saffron font-bold leading-none block">
                  {formatCurrency(booking.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* WhatsApp Alert and Share Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-green-500/5 border border-green-500/15 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.016 14.11 1.001 12.008 1c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L2.46 21.052l4.187-1.898zm11.111-5.158c-.3-.15-1.774-.875-2.031-.969-.258-.094-.446-.14-.633.14-.187.281-.726.906-.89 1.094-.164.188-.328.21-.628.06-1.3-.65-2.292-1.144-3.238-2.766-.252-.43.252-.4.72-.943.08-.094.04-.176-.02-.326-.06-.15-.446-1.077-.611-1.477-.16-.39-.348-.337-.478-.344-.124-.007-.267-.008-.41-.008-.143 0-.377.054-.574.271-.197.216-.752.734-.752 1.79s.77 2.078.878 2.224c.108.146 1.516 2.315 3.673 3.247.513.222.913.355 1.225.454.515.163.984.14 1.354.085.412-.061 1.774-.726 2.022-1.428.249-.702.249-1.303.174-1.428-.075-.124-.26-.188-.56-.338z" />
                </svg>
              </div>
              <p className="text-xs text-green-800 leading-snug">
                You will receive live photo and video updates on WhatsApp: <span className="font-semibold">{booking.whatsappPhone || "Provided Number"}</span>
              </p>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-green-100 text-green-700 hover:text-green-800 text-xs font-semibold px-3.5 py-2 border border-green-200 rounded-full transition shadow-sm self-end sm:self-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Booking
            </button>
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

          {/* Subscription Schedule */}
          {subscriptionBookings.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
              <h2 className="font-heading text-base text-foreground mb-4 border-b border-border/40 pb-2">📅 Subscription Schedule ({booking.subscriptionDuration} Months)</h2>
              <div className="space-y-3">
                {subscriptionBookings.map((b: any, idx: number) => (
                  <div
                    key={b._id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs md:text-sm transition-all ${b._id === booking._id.toString()
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
              <h2 className="font-heading text-base text-foreground mb-4 border-b border-border/40 pb-2">Payment Reference</h2>
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

          {/* Review Form */}
          {(booking.status === "completed" || booking.status === "confirmed") && bookingUserId === userId && (
            <BookingReviewForm
              bookingId={booking._id.toString()}
              templeId={typeof booking.temple === "object" ? booking.temple._id.toString() : booking.temple}
              initialReview={review}
              defaultReviewerName={booking.devoteeName || ""}
              defaultCity=""
            />
          )}
        </div>

        {/* ────── RIGHT COLUMN: SIDEBAR (1/3 width) ────── */}
        <div className="space-y-6">

          {/* Your Booking Details (Right Card) */}
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <h3 className="font-heading text-base md:text-lg text-foreground">Your Booking Details</h3>
              <button
                onClick={handlePrint}
                className="text-xs text-saffron hover:text-amber-700 font-semibold flex items-center gap-1 bg-saffron/5 px-2.5 py-1 rounded-full border border-saffron/10 transition"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>

            {/* Service Card info */}
            <div className="flex gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border/80 bg-background">
                <Image
                  src={typeof booking.temple === "object" ? (booking.temple.coverImage || "/kasbeswari.jpg") : "/kasbeswari.jpg"}
                  alt={booking.serviceName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading text-xs md:text-sm text-foreground leading-snug truncate">{booking.serviceName}</h4>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-2.5 h-2.5 text-saffron shrink-0" />
                  {typeof booking.temple === "object" ? booking.temple.name : "Temple"}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={statusMap[booking.status] || "pending"}>
                    {booking.status}
                  </Badge>
                  {booking.selectedPackage && (
                    <span className="text-[10px] text-muted-foreground leading-none">
                      {booking.selectedPackage}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Offerings list breakdown inside Details */}
            {((booking.selectedChadawa && booking.selectedChadawa.length > 0) || (booking.selectedItems && booking.selectedItems.length > 0)) && (
              <div className="border-t border-border/40 pt-4.5 space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Chadawa Added ({totalChadawaCount})</p>
                <div className="space-y-2.5">
                  {/* Puja Chadawa */}
                  {booking.selectedChadawa?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 truncate pr-2">
                        <Gift className="w-3.5 h-3.5 text-saffron shrink-0" />
                        <span className="truncate">{item.name}</span>
                        <span className="text-saffron font-bold shrink-0">×{item.qty}</span>
                      </span>
                      <span className="font-medium text-foreground shrink-0">{formatCurrency(item.total || (item.price * item.qty))}</span>
                    </div>
                  ))}

                  {/* Standard Chadawa Items */}
                  {booking.selectedItems?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 truncate pr-2">
                        <Gift className="w-3.5 h-3.5 text-saffron shrink-0" />
                        <span className="truncate">{item.name}</span>
                        <span className="text-saffron font-bold shrink-0">×{item.qty}</span>
                      </span>
                      <span className="font-medium text-foreground shrink-0">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Pricing List */}
            <div className="border-t border-border/40 pt-4.5 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Puja Package ({booking.selectedPackage || "Standard"})</span>
                <span className="font-medium text-foreground">{formatCurrency(pkgPrice)}</span>
              </div>
              {chadawaTotal > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Chadawa ({totalChadawaCount} Items)</span>
                  <span className="font-medium text-foreground">{formatCurrency(chadawaTotal)}</span>
                </div>
              )}
              {booking.prasadDelivery && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Prasad Delivery</span>
                  <span className="font-medium text-foreground">{booking.serviceType === "puja" ? "₹151" : "Requested"}</span>
                </div>
              )}
              {dakshinaFee > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Pandit Ji Dakshina</span>
                  <span className="font-medium text-foreground">{formatCurrency(dakshinaFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Fee</span>
                <span className="font-medium text-foreground">₹0</span>
              </div>

              <div className="border-t border-border/40 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">Total Paid</span>
                <span className="font-heading text-lg text-saffron font-bold">{formatCurrency(booking.amount)}</span>
              </div>
            </div>

            {/* 100% Secure Payment Strip */}
            <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <div className="text-[10px] text-green-800 leading-tight">
                <span className="font-semibold block">100% Secure Payment</span>
                <span>Your payment details are safe with us.</span>
              </div>
            </div>
          </div>

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

        </div>
      </div>

      {/* ────── NEW FULL-WIDTH SECTION FOR BALANCE ────── */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Need Help Card */}
        <div className="bg-gradient-to-br from-saffron/5 to-deep-gold/5 border border-amber-100 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-heading text-base text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-saffron" />
              Need Help?
            </h4>
            <p className="text-xs text-muted-foreground mt-1.5">Our support team is here for you. We provide instant response and guidance.</p>
          </div>
          <a
            href={`https://wa.me/919976543210?text=Hi, I need help with my booking EP-${booking._id.toString().slice(-8).toUpperCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-5 py-3 rounded-full shadow transition flex items-center justify-center gap-2 w-full text-center mt-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.016 14.11 1.001 12.008 1c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L2.46 21.052l4.187-1.898zm11.111-5.158c-.3-.15-1.774-.875-2.031-.969-.258-.094-.446-.14-.633.14-.187.281-.726.906-.89 1.094-.164.188-.328.21-.628.06-1.3-.65-2.292-1.144-3.238-2.766-.252-.43.252-.4.72-.943.08-.094.04-.176-.02-.326-.06-.15-.446-1.077-.611-1.477-.16-.39-.348-.337-.478-.344-.124-.007-.267-.008-.41-.008-.143 0-.377.054-.574.271-.197.216-.752.734-.752 1.79s.77 2.078.878 2.224c.108.146 1.516 2.315 3.673 3.247.513.222.913.355 1.225.454.515.163.984.14 1.354.085.412-.061 1.774-.726 2.022-1.428.249-.702.249-1.303.174-1.428-.075-.124-.26-.188-.56-.338z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Important Note Info Bar */}
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-3xl p-6 flex items-start gap-4.5 shadow-sm justify-center flex-col">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-saffron shrink-0" />
            <span className="font-heading text-sm font-semibold text-amber-900">Important Note</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Please ensure your WhatsApp mobile number is active. All live updates (including photos, videos, and proof of your puja or offering) as well as prasad tracking details will be sent directly to your registered number.
          </p>
        </div>
      </div>

      {/* Saffron Sanskrit Shloka Box (Full Width) */}
      <div className="mt-8 bg-saffron/10 border border-saffron/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 max-w-5xl mx-auto">
        <div className="text-4xl text-saffron select-none">ॐ</div>
        <div className="text-center md:text-left space-y-2">
          <p className="font-sanskrit text-saffron/90 text-sm md:text-base leading-relaxed font-semibold">
            सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत्॥
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground/80 leading-relaxed">
            May all sentient beings be at peace, may no one suffer from illnesses, may all see auspiciousness, and may none experience misery.
          </p>
        </div>
      </div>

      {/* ────── TRUST BADGES SECTION ────── */}
      <div className="border-t border-border/60 pt-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center max-w-5xl mx-auto">
          {/* Badge 1 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron">
              <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11m0 0l-3-3m3 3l3-3M5 21h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2zm7-17l7 5H5l7-5z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-foreground">Official Temple Puja</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">Puja performed at the temple by verified priests.</p>
          </div>

          {/* Badge 2 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-foreground">Secure Payments</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">Multiple safe payment options with 100% security.</p>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron">
              <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-foreground">Video Proof</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">Receive live sankalp video on WhatsApp after puja.</p>
          </div>

          {/* Badge 4 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-foreground">Prasad Delivery</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">Sacred Prasad delivered directly to your address.</p>
          </div>

          {/* Badge 5 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-foreground">24/7 Support</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">Devotee support team is here to assist you anytime.</p>
          </div>
        </div>
      </div>

      {/* ────── BACK HOME & VIEW MY BOOKINGS NAVIGATION BUTTONS ────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-border/60 pt-8 mt-10">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 border-2 border-border text-foreground hover:bg-muted text-sm font-semibold px-6 py-3 rounded-full transition w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/user/dashboard"
          className="flex items-center justify-center gap-2 bg-saffron hover:bg-deep-gold text-white text-sm font-semibold px-8 py-3 rounded-full shadow transition w-full sm:w-auto"
        >
          View My Bookings
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </DashboardShell>
  );
}
