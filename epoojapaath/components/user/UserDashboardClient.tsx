"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Search, 
  ArrowRight, 
  Gift, 
  Sparkles,
  CheckCircle2,
  Clock,
  Coins,
  Inbox,
  BookmarkCheck
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { IBooking } from "@/types";

interface UserDashboardClientProps {
  userName: string;
  initialBookings: (IBooking & { _id: string })[];
}

export function UserDashboardClient({ userName, initialBookings }: UserDashboardClientProps) {
  const [bookings, setBookings] = useState<(IBooking & { _id: string })[]>(initialBookings);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings">("overview");

  // Filter and search states
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = useSearchParams();

  // Sync tab with URL parameter on mount and when searchParams change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "bookings") {
      setActiveTab("bookings");
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "overview" | "bookings") => {
    setActiveTab(tab);
    const newUrl = tab === "overview" ? "/user/dashboard" : "/user/dashboard?tab=bookings";
    window.history.pushState(null, "", newUrl);
  };

  // Poll bookings in background to keep data real-time
  useEffect(() => {
    let active = true;

    const interval = setInterval(async () => {
      try {
        setIsSyncing(true);
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const resData = await res.json();
        if (resData.success && active) {
          setBookings(resData.data);
        }
      } catch (err) {
        console.error("Error updating dashboard data:", err);
      } finally {
        setTimeout(() => {
          if (active) setIsSyncing(false);
        }, 800);
      }
    }, 8000); // Poll every 8 seconds

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const paid      = bookings.filter((b) => b.paymentStatus === "paid").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const pending   = bookings.filter((b) => b.status === "pending").length;

  // Filtered and searched bookings list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = filterStatus === "all" || b.status === filterStatus;
      
      const templeName = typeof b.temple === "object" ? b.temple.name : "Temple";
      const searchContent = `${b.serviceName} ${templeName} ${b.selectedPackage || ""}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  // Extract day and month for calendar card badge
  const getCalendarDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return { day, month, year };
  };

  return (
    <div className="space-y-6">
      
      {/* Premium Welcome Header Banner */}
      <div className="bg-gradient-to-r from-saffron/10 via-amber-500/5 to-transparent border border-saffron/20 rounded-3xl py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <h1 className="font-heading text-xl md:text-2xl text-foreground">Welcome, {userName} 🙏</h1>
          <p className="text-xs text-muted-foreground">Your devotional dashboard — track bookings and divine connections.</p>
        </div>
        <div className="shrink-0 ml-2">
          <Image 
            src="/temple_3d_icon.png" 
            width={96} 
            height={96} 
            alt="Devotional Temple 3D Icon"
            className="object-contain filter drop-shadow-sm select-none w-16 h-16 sm:w-24 sm:h-24"
          />
        </div>
      </div>

      {/* Sub-Tabs Switcher and Sync Indicator Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deep-gold/15 pb-4">
        <div className="flex bg-muted/60 p-1 rounded-full w-fit border border-border">
          <button
            onClick={() => handleTabChange("overview")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-saffron text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard size={14} />
            Overview
          </button>
          <button
            onClick={() => handleTabChange("bookings")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "bookings"
                ? "bg-saffron text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar size={14} />
            My Bookings
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 transition-colors ${
              activeTab === "bookings"
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            }`}>
              {bookings.length}
            </span>
          </button>
        </div>

        {/* Live sync indicator */}
        <div className="flex items-center gap-2 text-[10px] font-bold bg-amber-50 border border-amber-100/60 text-saffron px-3 py-1.5 rounded-full shadow-sm w-fit self-end sm:self-auto">
          <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-500 animate-spin" : "bg-green-500 animate-pulse"}`} />
          <span>{isSyncing ? "SYNCING..." : "LIVE CONNECTION ACTIVE"}</span>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-card hover:bg-saffron/[0.01] border-l-4 border-l-saffron border-y border-r border-deep-gold/15 rounded-2xl p-5 shadow-sm transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron shrink-0">
                <BookmarkCheck size={18} />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">Total Bookings</span>
                <span className="text-xl md:text-2xl font-heading font-bold text-foreground mt-0.5 block">{bookings.length}</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-card hover:bg-saffron/[0.01] border-l-4 border-l-green-500 border-y border-r border-deep-gold/15 rounded-2xl p-5 shadow-sm transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">Completed</span>
                <span className="text-xl md:text-2xl font-heading font-bold text-foreground mt-0.5 block">{completed}</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-card hover:bg-saffron/[0.01] border-l-4 border-l-amber-500 border-y border-r border-deep-gold/15 rounded-2xl p-5 shadow-sm transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">Pending</span>
                <span className="text-xl md:text-2xl font-heading font-bold text-foreground mt-0.5 block">{pending}</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-card hover:bg-saffron/[0.01] border-l-4 border-l-blue-500 border-y border-r border-deep-gold/15 rounded-2xl p-5 shadow-sm transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                <Coins size={18} />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">Paid Bookings</span>
                <span className="text-xl md:text-2xl font-heading font-bold text-foreground mt-0.5 block">{paid}</span>
              </div>
            </div>
          </div>

          {/* Recent Bookings Card */}
          <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg md:text-xl text-foreground flex items-center gap-2">
                <Sparkles size={18} className="text-saffron" />
                Recent Bookings
              </h2>
              <button 
                onClick={() => handleTabChange("bookings")} 
                className="text-saffron text-xs font-semibold hover:underline bg-saffron/5 px-3 py-1 rounded-full border border-saffron/10 transition"
              >
                View all →
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/10 rounded-2xl border border-dashed border-border/80">
                <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No bookings found yet.</p>
                <Link href="/puja" className="btn-saffron mt-4 inline-block text-xs py-2 px-5 shadow-sm">Book a Puja</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((b) => {
                  const { day, month, year } = getCalendarDate(b.date);
                  const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };
                  
                  return (
                    <div key={b._id.toString()} 
                      className="p-4 bg-muted/20 border border-border/50 hover:border-saffron/30 rounded-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-card">
                      
                      <div className="flex items-start gap-4">
                        {/* Calendar Badge */}
                        <div className="flex flex-col items-center justify-center bg-saffron/10 border border-saffron/20 rounded-xl px-3 py-2 min-w-[60px] text-center shadow-sm">
                          <span className="text-lg font-bold text-saffron leading-none">{day}</span>
                          <span className="text-[9px] font-bold text-saffron/80 uppercase tracking-wider mt-1">{month}</span>
                          <span className="text-[8px] text-muted-foreground mt-0.5">{year}</span>
                        </div>

                        {/* Booking Details Info */}
                        <div className="space-y-1">
                          <h3 className="font-heading text-sm md:text-base text-foreground font-semibold group-hover:text-saffron transition-colors leading-snug">
                            {b.serviceName}
                          </h3>
                          <p className="text-xs text-saffron font-medium flex items-center gap-1">
                            <span>🛕</span>
                            <span>{typeof b.temple === "object" ? b.temple.name : "Temple"}</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {b.selectedPackage && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-background border border-border text-muted-foreground px-2 py-0.5 rounded-md">
                                📦 {b.selectedPackage}
                              </span>
                            )}
                            {((b.selectedChadawa && b.selectedChadawa.length > 0) || (b.selectedItems && b.selectedItems.length > 0)) && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-saffron/5 border border-saffron/10 text-saffron px-2 py-0.5 rounded-md font-medium">
                                🌸 Offerings Included
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Amount & Badges */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border/40">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-muted-foreground block">Amount Paid</span>
                          <span className="text-base font-heading font-bold text-saffron">{formatCurrency(b.amount)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
                          <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge>
                          <Link href={`/user/bookings/${b._id}`} 
                            className="flex items-center justify-center p-2 rounded-xl bg-saffron/5 text-saffron hover:bg-saffron hover:text-white border border-saffron/10 hover:border-saffron transition-all ml-1"
                            title="View details"
                          >
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Bookings Tab View */
        <div className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="font-heading text-lg md:text-xl text-foreground flex items-center gap-2">
              <Gift size={18} className="text-saffron" />
              All Bookings
            </h2>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-deep-gold/20 rounded-full px-4 py-2 pl-9 text-xs text-foreground focus:outline-none focus:border-saffron transition-all shadow-sm"
                />
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={12} />
              </div>

              {/* Status Selector */}
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold capitalize transition-all border ${
                      filterStatus === status
                        ? "bg-saffron text-white border-saffron shadow-sm"
                        : "bg-background text-muted-foreground border-deep-gold/15 hover:border-saffron/30 hover:text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-deep-gold/20 rounded-2xl bg-saffron/[0.01]">
              <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No bookings matched your filters.</p>
              {(searchQuery || filterStatus !== "all") && (
                <button 
                  onClick={() => { setFilterStatus("all"); setSearchQuery(""); }} 
                  className="text-saffron text-xs font-semibold hover:underline mt-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const { day, month, year } = getCalendarDate(b.date);
                const statusMap: Record<string, any> = { pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" };

                return (
                  <div key={b._id.toString()} 
                    className="p-4 bg-muted/20 border border-border/50 hover:border-saffron/30 rounded-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-card">
                    
                    <div className="flex items-start gap-4">
                      {/* Calendar Badge */}
                      <div className="flex flex-col items-center justify-center bg-saffron/10 border border-saffron/20 rounded-xl px-3 py-2 min-w-[60px] text-center shadow-sm">
                        <span className="text-lg font-bold text-saffron leading-none">{day}</span>
                        <span className="text-[9px] font-bold text-saffron/80 uppercase tracking-wider mt-1">{month}</span>
                        <span className="text-[8px] text-muted-foreground mt-0.5">{year}</span>
                      </div>

                      {/* Info columns */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="font-heading text-sm md:text-base text-foreground font-semibold group-hover:text-saffron transition-colors leading-snug break-words w-full">
                          {b.serviceName}
                        </h3>
                        <p className="text-xs text-saffron font-semibold flex items-center gap-1">
                          <span>🛕</span>
                          <span>{typeof b.temple === "object" ? b.temple.name : "Temple"}</span>
                        </p>
                        
                        {/* Package and Chadawa details */}
                        <div className="flex flex-wrap gap-1.5 pt-1 w-full">
                          {b.selectedPackage && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-background border border-border text-muted-foreground px-2 py-0.5 rounded-md">
                              📦 {b.selectedPackage}
                            </span>
                          )}
                          {b.selectedChadawa && b.selectedChadawa.length > 0 && (
                            <span className="inline-flex items-start gap-1 text-[10px] bg-saffron/5 border border-saffron/10 text-saffron px-2 py-0.5 rounded-md font-medium whitespace-normal break-words text-left" title={b.selectedChadawa.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}>
                              <span className="shrink-0">🌸 Offerings:</span>
                              <span>{b.selectedChadawa.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}</span>
                            </span>
                          )}
                          {b.selectedItems && b.selectedItems.length > 0 && (
                            <span className="inline-flex items-start gap-1 text-[10px] bg-saffron/5 border border-saffron/10 text-saffron px-2 py-0.5 rounded-md font-medium whitespace-normal break-words text-left" title={b.selectedItems.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}>
                              <span className="shrink-0">🌸 Offerings:</span>
                              <span>{b.selectedItems.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border/40">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-muted-foreground block">Amount Paid</span>
                        <span className="text-base font-heading font-bold text-saffron">{formatCurrency(b.amount)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={statusMap[b.status] || "pending"}>{b.status}</Badge>
                        <Badge variant={b.paymentStatus as any}>{b.paymentStatus}</Badge>
                        <Link href={`/user/bookings/${b._id}`} 
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-saffron text-white hover:bg-saffron-dark text-xs font-semibold transition-all ml-1 shadow-sm shadow-saffron/10 hover:shadow-md"
                        >
                          Details <ArrowRight size={12} className="ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
