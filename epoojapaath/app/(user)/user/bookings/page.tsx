import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { getUserBookings } from "@/services/booking.service";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import Link from "next/link";
import type { IBooking } from "@/types";
import { Calendar, ArrowRight, Inbox, Sparkles, LayoutDashboard } from "lucide-react";

export default async function UserBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await getUserBookings(session.user.id!).catch(() => []) as (IBooking & { _id: string })[];

  // Group subscription bookings
  const groupedList: any[] = [];
  const subMap = new Map<string, any[]>();

  for (const b of bookings) {
    if (b.subscriptionParentId) {
      if (!subMap.has(b.subscriptionParentId)) {
        subMap.set(b.subscriptionParentId, []);
      }
      subMap.get(b.subscriptionParentId)!.push(b);
    } else {
      groupedList.push(b);
    }
  }

  for (const [parentId, list] of Array.from(subMap.entries())) {
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = list[0];
    const last = list[list.length - 1];

    groupedList.push({
      ...first,
      isSubGroup: true,
      subStartDate: first.date,
      subEndDate: last.date,
      allSubBookings: list,
    });
  }

  // Sort by date descending
  groupedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Extract date details
  const getCalendarDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return { day, month, year };
  };

  const statusMap: Record<string, any> = { 
    pending: "pending", 
    confirmed: "approved", 
    completed: "completed", 
    cancelled: "cancelled" 
  };

  return (
    <DashboardShell 
      title="My Bookings" 
      subtitle="All your puja and chadawa bookings in one place."
      action={<Link href="/user/dashboard" className="text-saffron text-sm hover:underline">← Dashboard</Link>}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {groupedList.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl p-8">
            <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg text-foreground font-semibold">No Bookings Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Ready to book your first auspicious Puja or sacred offering?</p>
            <Link href="/puja" className="btn-saffron mt-5 inline-block text-sm py-2.5 px-6 shadow-sm">
              Explore Pujas 🛕
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedList.map((b) => {
              const { day, month, year } = getCalendarDate(b.date);
              
              let displayStatus = b.status;
              if (b.isSubGroup) {
                const completedCount = b.allSubBookings.filter((x: any) => x.status === "completed").length;
                displayStatus = completedCount === b.subscriptionDuration ? "completed" : "active";
              }

              return (
                <div 
                  key={b._id.toString()}
                  className="bg-card border border-border/80 hover:border-saffron/40 rounded-3xl p-5 shadow-sm transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Calendar Badge Indicator */}
                    {b.isSubGroup ? (
                      <div className="flex flex-col items-center justify-center bg-saffron/10 border border-saffron/20 rounded-2xl px-3 py-3.5 min-w-[64px] text-center shadow-sm shrink-0">
                        <Calendar className="w-6 h-6 text-saffron" />
                        <span className="text-[8px] font-bold text-saffron/90 uppercase tracking-wider mt-1.5 leading-none">Sub</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center bg-saffron/10 border border-saffron/20 rounded-2xl px-3 py-2.5 min-w-[64px] text-center shadow-sm shrink-0">
                        <span className="text-lg font-bold text-saffron leading-none">{day}</span>
                        <span className="text-[9px] font-bold text-saffron/80 uppercase tracking-wider mt-1 leading-none">{month}</span>
                        <span className="text-[8px] text-muted-foreground mt-0.5 leading-none">{year}</span>
                      </div>
                    )}

                    {/* Booking Description Details */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-sm md:text-base text-foreground font-semibold group-hover:text-saffron transition-colors leading-snug break-words w-full">
                          {b.serviceName}
                        </h3>
                        {b.isSubGroup && (
                          <span className="bg-red-500/10 text-red-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {b.subscriptionDuration} Months Sub
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-saffron font-medium flex items-center gap-1">
                        <span>🛕</span>
                        <span>{typeof b.temple === "object" ? b.temple.name : "Temple"}</span>
                      </p>

                      {/* Packages and Offerings subtext */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5 w-full">
                        {b.selectedPackage && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-muted/60 border border-border/80 text-muted-foreground px-2 py-0.5 rounded-md">
                            📦 {b.selectedPackage}
                          </span>
                        )}
                        {b.selectedChadawa && b.selectedChadawa.length > 0 && (
                          <span className="inline-flex items-start gap-1 text-[10px] bg-saffron/5 border border-saffron/10 text-saffron px-2 py-0.5 rounded-md font-medium whitespace-normal break-words text-left" title={b.selectedChadawa.map((c: any) => c.name).join(", ")}>
                            <span className="shrink-0">🌸 Offerings:</span>
                            <span>{b.selectedChadawa.map((c: any) => c.name).join(", ")}</span>
                          </span>
                        )}
                        {b.selectedItems && b.selectedItems.length > 0 && (
                          <span className="inline-flex items-start gap-1 text-[10px] bg-saffron/5 border border-saffron/10 text-saffron px-2 py-0.5 rounded-md font-medium whitespace-normal break-words text-left" title={b.selectedItems.map((c: any) => c.name).join(", ")}>
                            <span className="shrink-0">🌸 Offerings:</span>
                            <span>{b.selectedItems.map((c: any) => c.name).join(", ")}</span>
                          </span>
                        )}
                      </div>
                      
                      {b.isSubGroup && (
                        <p className="text-[10px] text-muted-foreground">
                          Period: {formatDateShort(b.subStartDate)} - {formatDateShort(b.subEndDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Status, Pricing and Actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 w-full sm:w-auto pt-3.5 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-muted-foreground block">Amount Paid</span>
                      <span className="text-base font-heading font-bold text-saffron">{formatCurrency(b.amount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={statusMap[displayStatus] || "pending"}>
                        {b.isSubGroup 
                          ? `${b.allSubBookings.filter((x: any) => x.status === "completed").length}/${b.subscriptionDuration} Done`
                          : b.status
                        }
                      </Badge>
                      <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge>
                      
                      <Link 
                        href={`/user/bookings/${b._id}`} 
                        className="bg-saffron text-white hover:bg-deep-gold shadow-sm px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition"
                      >
                        Details
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
