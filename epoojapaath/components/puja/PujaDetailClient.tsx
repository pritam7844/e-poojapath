"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  Sparkles,
  MapPin,
  Star,
  Users,
  Gift,
  ShoppingBag,
  Plus,
  Minus,
  BookOpen,
  ChevronDown,
  Check,
  X,
  Clock,
} from "lucide-react";
import { PujaCountdownTimer } from "./PujaCountdownTimer";
import * as fpixel from "@/lib/fpixel";
import { getAttributionData } from "@/lib/attribution";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import type { IPuja, IPujaPackage, ITemple, IChadawa } from "@/types";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

interface SelectedChadawa {
  item: IChadawa & { _id: string };
  qty: number;
}

interface Props {
  puja: IPuja & { _id: string };
  temple: ITemple & { _id: string };
  chadawaItems: (IChadawa & { _id: string })[];
  faqs: { question: string; answer: string }[];
  displayRating: number;
  displayReviews: number;
  hasActiveBooking?: boolean;
  activeBookingId?: string;
}

type BookingStep = "package" | "details";

const HOW_IT_WORKS = [
  { icon: "📿", title: "Choose Your Puja", description: "Select the package that suits your family size and devotion." },
  { icon: "📅", title: "Select Date & Sankalp", description: "Enter your name, gotra and prayer intention for the ritual." },
  { icon: "🛕", title: "Priest Performs at Temple", description: "Experienced pandits perform the ritual with full Vedic traditions." },
  { icon: "📺", title: "Receive Photos & Videos + Prasad", description: "Watch the recording and receive prasad at your doorstep." },
];

function formatDisplayDate(dateStr: string): string {
  try {
    if (dateStr.includes("T")) {
      return new Date(dateStr).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
}

export function PujaDetailClient({
  puja,
  temple,
  chadawaItems,
  faqs,
  displayRating,
  displayReviews,
  hasActiveBooking = false,
  activeBookingId = "",
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  // ── Sticky button state and observer ───────────────────────────────────────
  const buttonRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const currentRef = buttonRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the static button container has scrolled past the top of the viewport
        setShowStickyButton(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(currentRef);
    return () => {
      observer.unobserve(currentRef);
    };
  }, []);

  // ── Shared chadawa state ──────────────────────────────────────────────────
  const [selectedChadawa, setSelectedChadawa] = useState<SelectedChadawa[]>([]);
  const [showAllMobileChadawa, setShowAllMobileChadawa] = useState(false);
  const chadawaSliderRef = useRef<HTMLDivElement>(null);

  const scrollChadawa = (direction: "left" | "right") => {
    if (chadawaSliderRef.current) {
      const container = chadawaSliderRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      const scrollTarget = direction === "left" ? -scrollAmount : scrollAmount;
      
      try {
        container.scrollBy({
          left: scrollTarget,
          behavior: "smooth"
        });
      } catch (e) {
        container.scrollLeft += scrollTarget;
      }
    }
  };

  // ── Booking sidebar state ─────────────────────────────────────────────────
  const [showPackages, setShowPackages] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<IPujaPackage | null>(puja.packages?.[0] ?? null);
  const [bookingStep, setBookingStep] = useState<BookingStep>("package");
  const [form, setForm] = useState({
    devoteeNames: [""], whatsappPhone: "", gotra: "", sankalp: "", date: "",
    prasadDelivery: false, prasadAddress: "",
    dakshina: 0,
  });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (puja.availableDates && puja.availableDates.length > 0) {
      const firstDate = puja.availableDates[0];
      setForm(f => ({ ...f, date: firstDate }));
    }
  }, [puja.availableDates]);

  useEffect(() => {
    // Extract max persons from selectedPkg
    let maxPersons = 1;
    if (selectedPkg && selectedPkg.persons) {
      const match = selectedPkg.persons.match(/\d+/);
      if (match) maxPersons = parseInt(match[0], 10);
    }
    setForm((prev) => {
      const newNames = [...prev.devoteeNames];
      while (newNames.length < maxPersons) {
        newNames.push("");
      }
      if (newNames.length > maxPersons) {
        newNames.length = maxPersons;
      }
      return { ...prev, devoteeNames: newNames };
    });
  }, [selectedPkg]);

  const [stats, setStats] = useState({ temples: 0, bookings: 0, devotees: 0 });

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          setStats(d.data);
        }
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  // ── Price calculations ────────────────────────────────────────────────────
  const [duration, setDuration] = useState<number>(1);
  const basePrice = selectedPkg ? selectedPkg.price : puja.price;
  const discountPercent = duration === 3 ? (puja.discount3Months || 0) : duration === 6 ? (puja.discount6Months || 0) : 0;
  const pujaPrice = basePrice * duration * (1 - discountPercent / 100);
  const displayName = selectedPkg ? selectedPkg.label : puja.name;
  const chadawaTotal = selectedChadawa.reduce((s, sc) => s + sc.item.price * sc.qty, 0);
  const prasadPrice = form.prasadDelivery ? 151 : 0;
  const grandTotal = pujaPrice + chadawaTotal + prasadPrice + Number(form.dakshina || 0);

  // ── Chadawa section renderer ────────────────────────────────────────────────
  const renderChadawaSection = (isMobileLayout: boolean = false) => {
    return (
      <section className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-lg md:text-2xl text-foreground">
              Add Sacred Chadawa <span className="text-xs font-semibold text-muted-foreground ml-1">(Optional)</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Select sacred offerings to add to your booking</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAllMobileChadawa(!showAllMobileChadawa)}
              type="button"
              className="text-saffron text-xs font-semibold hover:underline md:hidden bg-saffron/5 border border-saffron/20 rounded-full px-3 py-1"
            >
              {showAllMobileChadawa ? "Show Less" : "View All"}
            </button>
            {selectedChadawa.length > 0 && (
              <div className="bg-saffron/10 border border-saffron/30 rounded-full px-2.5 py-0.5 md:px-3 md:py-1 flex items-center gap-1">
                <span className="text-saffron text-xs font-semibold">{selectedChadawa.length} selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Carousel View / Grid Toggle */}
        <div className="block md:hidden">
          {showAllMobileChadawa ? (
            /* Grid View */
            <div className="grid grid-cols-2 gap-3 px-1">
              {chadawaItems.map((item) => {
                const selected = isSelected(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => toggleChadawa(item)}
                    className={`card-devotional cursor-pointer overflow-hidden p-0 group transition-all duration-200 w-full flex flex-col justify-between ${
                      selected ? "ring-2 ring-saffron shadow-lg shadow-saffron/10 border-saffron bg-saffron/5" : "border-border bg-card"
                    }`}
                  >
                    <div>
                      <div className="relative h-24 w-full overflow-hidden">
                        <Image
                          src={item.image || "/kasbeswari.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="font-heading text-xs text-foreground line-clamp-1 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="p-2 pt-0 flex items-center justify-between">
                      <p className="font-heading text-sm text-foreground">₹{item.price}</p>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          selected ? "bg-saffron border-saffron text-white" : "border-muted-foreground/30 bg-background"
                        }`}
                      >
                        {selected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Sliding Carousel View */
            <div className="relative px-6">
              {/* Left Arrow */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollChadawa("left"); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-background/95 border border-border flex items-center justify-center shadow-md hover:bg-background active:scale-95 transition text-foreground cursor-pointer pointer-events-auto"
                type="button"
                aria-label="Scroll Left"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollChadawa("right"); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-background/95 border border-border flex items-center justify-center shadow-md hover:bg-background active:scale-95 transition text-foreground cursor-pointer pointer-events-auto"
                type="button"
                aria-label="Scroll Right"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div
                ref={isMobileLayout ? chadawaSliderRef : null}
                className="flex overflow-x-auto snap-x snap-mandatory gap-3 scroll-smooth pb-3 px-1 no-scrollbar relative z-10"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {chadawaItems.map((item) => {
                  const selected = isSelected(item._id);
                  return (
                    <div
                      key={item._id}
                      onClick={() => toggleChadawa(item)}
                      className={`card-devotional cursor-pointer overflow-hidden p-0 group transition-all duration-200 w-[calc(50%-6px)] shrink-0 snap-start flex flex-col justify-between ${
                        selected ? "ring-2 ring-saffron shadow-lg shadow-saffron/10 border-saffron bg-saffron/5" : "border-border bg-card"
                      }`}
                    >
                      <div>
                        <div className="relative h-24 w-full overflow-hidden">
                          <Image
                            src={item.image || "/kasbeswari.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="font-heading text-xs text-foreground line-clamp-1 leading-tight">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                        </div>
                      </div>

                      <div className="p-2 pt-0 flex items-center justify-between">
                        <p className="font-heading text-sm text-foreground">₹{item.price}</p>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            selected ? "bg-saffron border-saffron text-white" : "border-muted-foreground/30 bg-background"
                          }`}
                        >
                          {selected && <Check size={10} strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
          {chadawaItems.map((item) => {
            const selected = isSelected(item._id);
            const sc = selectedChadawa.find((s) => s.item._id === item._id);
            return (
              <div
                key={item._id}
                className={`card-devotional overflow-hidden p-0 group transition-all duration-200 ${selected ? "ring-2 ring-saffron shadow-lg shadow-saffron/10" : ""}`}
              >
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={item.image || "/kasbeswari.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-saffron rounded-full flex items-center justify-center shadow">
                      <Check size={13} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white font-heading text-sm leading-tight line-clamp-2">{item.name}</p>
                  </div>
                </div>

                <div className="p-3">
                  <p className="font-sanskrit text-saffron/80 text-xs mb-0.5">{item.nameHi}</p>
                  <p className="text-muted-foreground text-xs line-clamp-1 mb-3">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <p className="font-heading text-foreground text-base">₹{item.price}</p>
                    {selected && sc ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={(e) => { e.stopPropagation(); updateQty(item._id, -1); }} className="w-6 h-6 rounded-full bg-border flex items-center justify-center hover:bg-saffron/20 transition"><Minus size={10} /></button>
                        <span className="font-heading text-sm text-foreground w-5 text-center">{sc.qty}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateQty(item._id, 1); }} className="w-6 h-6 rounded-full bg-border flex items-center justify-center hover:bg-saffron/20 transition"><Plus size={10} /></button>
                        <button onClick={(e) => { e.stopPropagation(); toggleChadawa(item); }} className="ml-1 w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition"><X size={11} /></button>
                      </div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); toggleChadawa(item); }} className="bg-gradient-to-r from-saffron to-deep-gold text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition shadow-sm flex items-center gap-1"><Plus size={11} /> Add</button>
                    )}
                  </div>
                  {selected && sc && sc.qty > 1 && <p className="text-xs text-saffron font-medium mt-2 text-right">Subtotal: ₹{item.price * sc.qty}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {selectedChadawa.length > 0 && (
          <div className="mt-4 bg-gradient-to-r from-saffron/5 to-deep-gold/5 border border-saffron/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-saffron mb-2 flex items-center gap-1.5">
              <Gift size={13} /> Selected Chadawa — {formatCurrency(chadawaTotal)} added to your booking
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedChadawa.map((sc) => (
                <div key={sc.item._id} className="flex items-center gap-1.5 bg-background border border-saffron/30 rounded-full px-2.5 py-1 text-xs">
                  <span className="text-foreground">{sc.item.name}</span>
                  {sc.qty > 1 && <span className="text-muted-foreground">×{sc.qty}</span>}
                  <span className="text-saffron font-medium">₹{sc.item.price * sc.qty}</span>
                  <button onClick={() => toggleChadawa(sc.item)} className="text-muted-foreground hover:text-red-400 transition ml-0.5"><X size={10} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  // ── Chadawa helpers ───────────────────────────────────────────────────────
  function isSelected(id: string) {
    return selectedChadawa.some((sc) => sc.item._id === id);
  }

  function toggleChadawa(item: IChadawa & { _id: string }) {
    setSelectedChadawa((prev) => {
      const exists = prev.find((sc) => sc.item._id === item._id);
      if (exists) return prev.filter((sc) => sc.item._id !== item._id);
      return [...prev, { item, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setSelectedChadawa((prev) =>
      prev.map((sc) =>
        sc.item._id === id ? { ...sc, qty: Math.max(1, sc.qty + delta) } : sc
      )
    );
  }

  // ── Booking ───────────────────────────────────────────────────────────────
  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    let currentSession = session;
    setLoading(true);
    try {
      if (!currentSession) {
        // Validation: At least one name should be provided
        const validNames = form.devoteeNames.filter((n) => n.trim() !== "");
        if (validNames.length === 0) {
          devToast.error("Devotee Name is required");
          setLoading(false);
          return;
        }
        if (!form.whatsappPhone.trim() || form.whatsappPhone.trim().length < 10) {
          devToast.error("Please enter a valid 10-digit WhatsApp number");
          setLoading(false);
          return;
        }

        const guestRes = await fetch("/api/auth/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: validNames[0], // Use first name for account creation
            phone: form.whatsappPhone,
          }),
        });
        const guestData = await guestRes.json();
        if (!guestData.success) {
          devToast.error(guestData.error || "Guest login failed");
          setLoading(false);
          return;
        }

        const signInResult = await signIn("credentials", {
          email: guestData.email,
          password: guestData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          devToast.error("Failed to authenticate guest session");
          setLoading(false);
          return;
        }

        currentSession = {
          user: {
            name: form.devoteeNames.filter((n) => n.trim() !== "")[0],
            email: guestData.email,
          }
        } as any;
      }
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, notes: { pujaName: puja.name } }),
      });
      const orderData = await orderRes.json();

      const attribution = getAttributionData();
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...attribution,
          devoteeName: form.devoteeNames.filter((n) => n.trim() !== "").join(", "),
          temple: temple._id,
          service: puja._id,
          serviceType: "puja",
          serviceName: puja.name,
          serviceNameHi: puja.nameHi,
          amount: grandTotal,
          selectedPackage: selectedPkg?.label,
          selectedPackagePrice: selectedPkg?.price,
          selectedChadawa: selectedChadawa.map((sc) => ({
            name: sc.item.name,
            price: sc.item.price,
            qty: sc.qty,
            total: sc.item.price * sc.qty,
          })),
          orderId: orderData.data.id,
          paymentStatus: "pending",
          status: "pending",
          subscriptionDuration: duration,
        }),
      });
      const bookingJson = await bookingRes.json();
      const bookingId = bookingJson.data._id;

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: "INR",
        name: "ePoojapaath",
        description: puja.name,
        order_id: orderData.data.id,
        theme: { color: "#D4820A" },
        prefill: { name: currentSession?.user?.name, email: currentSession?.user?.email },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            fpixel.event("Purchase", { content_name: puja.name, value: grandTotal, currency: "INR" });
            fpixel.event("Lead", { content_name: puja.name, value: grandTotal, currency: "INR" });
            await fetch(`/api/bookings/${bookingId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                paymentStatus: "paid",
                status: "confirmed",
              }),
            });
            setBooked(true);
            devToast.blessing("🙏 Puja Booked! Divine blessings incoming...");
            setTimeout(() => router.push("/user/bookings"), 3000);
          }
        },
        modal: {
          ondismiss: async () => {
            await fetch(`/api/bookings/${bookingId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentStatus: "failed",
              }),
            });
            setLoading(false);
          }
        }
      });

      fpixel.event("InitiateCheckout", { content_name: puja.name, value: grandTotal, currency: "INR" });
      rzp.open();

    } catch {
      devToast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubscriptionBadgeClick() {
    if (!session) {
      const currentUrl = window.location.pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }
    setBookingStep("package");
    const sidebar = document.querySelector(".lg\\:col-span-1");
    if (sidebar) {
      sidebar.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setShowMobileSidebar(true);
  }

  return (
    <>
      {/* ── Hero Banner ── */}
      <div className="relative h-80 md:h-96 w-full overflow-hidden">
        <Image
          src={puja.image || (temple.images?.[0] ?? temple.coverImage)}
          alt={puja.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20" />
        
        {/* Subscription Badge */}
        {puja.isSubscription && (
          <button
            onClick={handleSubscriptionBadgeClick}
            type="button"
            className="absolute top-4 left-6 z-10 bg-red-700/95 text-white border-2 border-amber-400 hover:border-white rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase shadow-lg transition-all transform hover:scale-105 flex items-center gap-1.5 animate-pulse"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            {puja.subscriptionType === "weekly" ? "Weekly Subscription" : "Monthly Subscription"}
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto drop-shadow-md">
          <p className="text-white/90 text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <span>🛕 Puja Booking at <span className="text-saffron font-semibold">{temple.name}</span></span>
          </p>
          <h1 className="text-white font-heading text-2xl md:text-3xl leading-tight max-w-3xl">
            {puja.name}
          </h1>
          {puja.nameHi && (
            <p className="text-white/80 font-sanskrit text-sm md:text-base mt-1">{puja.nameHi}</p>
          )}

          {/* Hero Badges / Features Row */}
          <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-4 gap-2 text-center max-w-3xl">
            <div className="flex flex-col items-center">
              <div className="text-amber-400 mb-1">
                <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[9px] md:text-xs text-white/90 font-medium leading-tight">Personalized Sankalp</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-amber-400 mb-1">
                <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11m0 0l-3-3m3 3l3-3M5 21h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2zm7-17l7 5H5l7-5z" />
                </svg>
              </div>
              <span className="text-[9px] md:text-xs text-white/90 font-medium leading-tight">Puja by Temple Priests</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-amber-400 mb-1">
                <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-[9px] md:text-xs text-white/90 font-medium leading-tight">WhatsApp Photo/Video</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-amber-400 mb-1">
                <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-[9px] md:text-xs text-white/90 font-medium leading-tight">Prasad Delivery (Available)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Meta Bar ── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center gap-4">
          <Link
            href={`/temples/${temple.slug}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-saffron transition-colors"
          >
            <MapPin size={14} />
            <span>{temple.name}, {temple.location?.city}</span>
          </Link>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.round(displayRating) ? "fill-saffron text-saffron" : "text-muted"}
              />
            ))}
            <span className="text-saffron font-semibold ml-1">{displayRating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">Stars</span>
            <span className="text-muted-foreground ml-1">• {displayReviews}+ Reviews</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>{puja.duration}</span>
          </div>
          <span className="text-border">|</span>
          <PujaCountdownTimer scheduledAt={puja.scheduledAt} availableDates={puja.availableDates} />
        </div>
      </div>

      {booked && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={400}
          colors={["#D4820A", "#B8860B", "#8B6DB5", "#C2567A"]}
        />
      )}

      {/* Mobile Package Selection (Inline Horizontal Row) */}
      {!showMobileSidebar && (
        <>
          <div ref={buttonRef} className="z-30 bg-background px-4 py-4 border-b border-border md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-lg text-foreground">Select Package</h3>
            </div>
            {puja.packages && puja.packages.length > 0 && (
              <div className={`grid gap-2 w-full ${
                puja.packages.length === 1 ? 'grid-cols-1' :
                puja.packages.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
              }`}>
                {puja.packages.map((pkg) => (
                  <button
                    key={pkg.label}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all ${
                      selectedPkg?.label === pkg.label
                        ? "border-saffron bg-saffron/5 ring-1 ring-saffron shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-saffron/40 hover:bg-saffron/5"
                    }`}
                  >
                    <Users size={16} className={`mb-1 ${selectedPkg?.label === pkg.label ? "text-saffron" : "text-muted-foreground"}`} />
                    <span className={`font-semibold text-xs leading-tight ${selectedPkg?.label === pkg.label ? "text-foreground" : ""}`}>
                      {pkg.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{pkg.persons}</span>
                    <span className={`font-heading text-sm mt-1 ${selectedPkg?.label === pkg.label ? "text-saffron" : "text-foreground"}`}>
                      {formatCurrency(pkg.price)}
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            {hasActiveBooking ? (
              <Link
                href={`/user/bookings/${activeBookingId}`}
                className="btn-saffron w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2 shadow-md shadow-saffron/20 mt-3"
              >
                Already Booked 🪔 (Click to View)
              </Link>
            ) : (
              <button
                onClick={() => { setBookingStep("details"); setShowMobileSidebar(true); }}
                className="btn-saffron w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2 shadow-md shadow-saffron/20 mt-3"
              >
                Book Now at {formatCurrency(grandTotal)} 🪔
              </button>
            )}

            {/* Trusted subtext */}
            <p className="text-center text-xs text-muted-foreground mt-2.5 font-medium flex items-center justify-center gap-1">
              <span>Trusted by</span>
              <span className="text-saffron font-semibold">514+ Devotees</span>
              <span>•</span>
              <span className="text-saffron font-semibold">5.0 ★ Rating</span>
            </p>

            {/* Why Devotees Trust ePoojapaath */}
            <div className="mt-5 border border-amber-100 rounded-2xl p-4 bg-amber-50/10">
              <h4 className="text-center font-heading text-sm text-foreground mb-4">
                Why Devotees <span className="text-saffron font-semibold">Trust ePoojapaath</span>
              </h4>
              
              <div className="grid grid-cols-5 gap-1 mb-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-saffron/5 border border-saffron/10 flex items-center justify-center text-saffron mb-1">
                    {/* Official Temple Puja (Temple/Mandir outline) */}
                    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11m0 0l-3-3m3 3l3-3M5 21h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2zm7-17l7 5H5l7-5z" />
                    </svg>
                  </div>
                  <span className="text-[9px] leading-tight text-foreground font-medium">Official Temple Puja</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-saffron/5 border border-saffron/10 flex items-center justify-center text-saffron mb-1">
                    {/* 100% Secure Payment */}
                    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-[9px] leading-tight text-foreground font-medium">100% Secure Payment</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-saffron/5 border border-saffron/10 flex items-center justify-center text-saffron mb-1">
                    {/* Video Proof on WhatsApp */}
                    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-[9px] leading-tight text-foreground font-medium">Video Proof on WhatsApp</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-saffron/5 border border-saffron/10 flex items-center justify-center text-saffron mb-1">
                    {/* Experienced Temple Priests */}
                    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-[9px] leading-tight text-foreground font-medium">Experienced Temple Priests</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-saffron/5 border border-saffron/10 flex items-center justify-center text-saffron mb-1">
                    {/* Prasad Delivery */}
                    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-[9px] leading-tight text-foreground font-medium">Prasad Delivery Across India</span>
                </div>
              </div>

              {/* Bottom statistics strip */}
              <div className="bg-amber-50/40 border border-amber-100/60 rounded-xl p-2.5 flex justify-between items-center text-center">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-saffron stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs font-bold text-foreground">514+</span>
                  </div>
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5">Pujas Completed</span>
                </div>
                
                <div className="h-6 w-px bg-amber-100" />

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-saffron stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-xs font-bold text-foreground">3+</span>
                  </div>
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5">Verified Temples</span>
                </div>

                <div className="h-6 w-px bg-amber-100" />

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-saffron fill-saffron" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-xs font-bold text-foreground">5.0</span>
                  </div>
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5">Devotee Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Render Chadawa directly below Book Now on Mobile */}
          {chadawaItems.length > 0 && (
            <div className="block lg:hidden px-4 pt-6 pb-2">
              {renderChadawaSection(true)}
            </div>
          )}
        </>
      )}

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ────── LEFT COLUMN ────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* How It Works */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-6">How it works?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={i} className="card-devotional flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-saffron/10 flex items-center justify-center text-lg flex-shrink-0">{step.icon}</div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-4 h-4 rounded-full bg-saffron text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                        <h3 className="font-heading text-sm text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* About Temple */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-4">About Temple</h2>
              <div className="card-devotional overflow-hidden p-0">
                {temple.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image src={temple.coverImage} alt={temple.name} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-heading text-xl text-foreground mb-1">{temple.name}</h3>
                  {temple.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin size={13} /> {temple.location.city}, {temple.location.state}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{temple.description}</p>
                  <Link href={`/temples/${temple.slug}`} className="inline-block mt-3 text-sm text-saffron hover:underline font-medium">
                    View Temple →
                  </Link>
                </div>
              </div>
            </section>

            {/* About Puja */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-3">About {puja.name}</h2>
              <div className="card-devotional">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{puja.description}</p>
                {puja.descriptionHi && (
                  <p className="font-sanskrit text-saffron/80 text-sm mt-4 leading-relaxed">{puja.descriptionHi}</p>
                )}
              </div>
            </section>

            {/* Benefits */}
            {puja.benefits && puja.benefits.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-4">Spiritual Benefits</h2>
                <div className="card-devotional grid grid-cols-1 md:grid-cols-2 gap-3">
                  {puja.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={15} className="text-saffron shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What's Included */}
            {puja.includes && puja.includes.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-4">What&apos;s Included</h2>
                <div className="card-devotional grid grid-cols-1 md:grid-cols-2 gap-3">
                  {puja.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Sparkles size={15} className="text-saffron shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── CHADAWA SECTION (Desktop Only) ── */}
            {chadawaItems.length > 0 && (
              <div className="hidden lg:block">
                {renderChadawaSection(false)}
              </div>
            )}

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={i < Math.round(displayRating) ? "fill-saffron text-saffron" : "fill-muted text-muted"} />
                  ))}
                </div>
                <h2 className="font-heading text-2xl text-foreground">
                  {displayRating} Stories of Blessed Experiences
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Priya S.", comment: "An incredibly spiritual experience. The pandit performed every ritual with deep devotion. I could feel the divine presence during the entire puja.", stars: 5 },
                  { name: "Rajesh K.", comment: "Very authentic puja conducted at the actual temple. Received a beautiful video and prasad delivery was prompt. Highly recommend!", stars: 5 },
                  { name: "Anita M.", comment: "Booked for my family of 4. The whole family felt blessed watching the live puja. Will definitely book again for next occasion.", stars: 4 },
                  { name: "Suresh P.", comment: "The sankalp was taken with our full names and gotra. Everything felt genuine and sacred. Thank you for this divine service.", stars: 5 },
                ].map((review, i) => (
                  <div key={i} className="card-devotional">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} className={j < review.stars ? "fill-saffron text-saffron" : "fill-muted text-muted"} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">&ldquo;{review.comment}&rdquo;</p>
                    <p className="text-xs font-semibold text-foreground">— {review.name}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-6 text-center">Know More About Your Puja</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="card-devotional cursor-pointer group" open={i === 0}>
                    <summary className="flex items-center justify-between font-medium text-foreground text-sm list-none">
                      <span className="flex items-center gap-2">
                        <BookOpen size={14} className="text-saffron shrink-0" />
                        {faq.question}
                      </span>
                      <ChevronDown size={16} className="text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-5">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Trust footer */}
            <section className="text-center py-8 border-t border-border">
              <div className="inline-flex items-center gap-2 bg-saffron/5 border border-saffron/20 rounded-full px-6 py-3 mb-4">
                <Sparkles size={16} className="text-saffron" />
                <span className="text-sm font-medium text-foreground">Authenticity You Can Trust</span>
                <Sparkles size={16} className="text-saffron" />
              </div>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                We ensure every ritual is performed by official temple Pandits, following sacred Vedic traditions — so your faith is always in trusted hands.
              </p>
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="text-center">
                  <p className="font-heading text-2xl text-saffron">
                    {stats.devotees > 0 ? `${stats.devotees.toLocaleString("en-IN")}+` : "50 Lakh+"}
                  </p>
                  <p className="text-xs text-muted-foreground">Trusted Bhakts</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-2xl text-saffron">
                    {stats.temples > 0 ? `${stats.temples.toLocaleString("en-IN")}+` : "500+"}
                  </p>
                  <p className="text-xs text-muted-foreground">Verified Temples</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-2xl text-saffron">
                    {displayRating > 0 ? `${displayRating.toFixed(1)}★` : "4.8★"}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </section>
          </div>

          {/* ────── RIGHT: BOOKING SIDEBAR ────── */}
          <div className="lg:col-span-1">
            {/* Mobile close button when sidebar is shown */}
            {showMobileSidebar && (
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="md:hidden fixed top-4 right-4 z-[60] p-2 bg-background rounded-full shadow-md border border-border text-foreground"
              >
                <X size={20} />
              </button>
            )}

            <div className={`
              ${showMobileSidebar ? 'fixed inset-0 z-50 bg-background overflow-y-auto p-4 pt-16 pb-24 block' : 'hidden'}
              md:block md:sticky md:top-24 md:p-0 md:bg-transparent md:z-auto
            `}>

                {hasActiveBooking ? (
                  <div className="card-devotional text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center text-saffron text-3xl mx-auto animate-pulse">
                      🪔
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-foreground font-semibold">Already Booked!</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        You have an active booking for this Puja. Your name and gotra are registered.
                      </p>
                    </div>
                    <Link
                      href={`/user/bookings/${activeBookingId}`}
                      className="btn-saffron w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-saffron/20 mt-2"
                    >
                      View Booking Details
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* ── Package Step ── */}
                    {bookingStep === "package" && (
                      <div className="card-devotional">
                  <div className="text-center mb-4">
                    <h3 className="font-heading text-lg text-foreground mb-1">Book This Puja</h3>
                    <p className="text-xs text-saffron font-semibold mb-1 flex items-center justify-center gap-1">
                      🛕 {temple.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedPkg ? selectedPkg.persons : "Select package"}
                    </p>
                    <p className="font-heading text-3xl text-saffron">{formatCurrency(pujaPrice)}</p>
                    {puja.slotsText && (
                      <div className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] px-3 py-1.5 rounded-md font-semibold shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        {puja.slotsText}
                      </div>
                    )}
                  </div>

                  {/* Package options */}
                  {puja.packages && puja.packages.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {puja.packages.map((pkg) => (
                        <button
                          key={pkg.label}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${selectedPkg?.label === pkg.label
                            ? "border-saffron bg-saffron/5 text-foreground"
                            : "border-border text-muted-foreground hover:border-saffron/40"
                            }`}
                        >
                          <span className="font-medium flex items-center gap-1.5">
                            <Users size={13} className="text-saffron" />
                            {pkg.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{pkg.persons}</span>
                          <span className="font-heading text-saffron">{formatCurrency(pkg.price)}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {puja.isSubscription && (
                    <div className="mb-4 bg-card-bg/50 border border-border/60 rounded-xl p-3.5">
                      <p className="text-xs text-muted-foreground mb-2.5 font-medium flex items-center gap-1">
                        📅 Subscription Duration
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 1, label: "1 Month", desc: "Single" },
                          { value: 3, label: "3 Months", desc: puja.discount3Months ? `${puja.discount3Months}% Off` : "Save 10%" },
                          { value: 6, label: "6 Months", desc: puja.discount6Months ? `${puja.discount6Months}% Off` : "Save 15%" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setDuration(opt.value)}
                            className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all ${
                              duration === opt.value
                                ? "border-saffron bg-saffron/10 text-saffron font-semibold scale-105 shadow-sm shadow-saffron/10"
                                : "border-border text-muted-foreground hover:border-saffron/40 bg-background/50 hover:bg-background"
                            }`}
                          >
                            <span className="text-xs">{opt.label}</span>
                            <span className="text-[10px] opacity-80 mt-0.5">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected chadawa mini summary */}
                  {selectedChadawa.length > 0 && (
                    <div className="bg-saffron/5 border border-saffron/20 rounded-xl p-3 mb-4">
                      <p className="text-xs font-semibold text-saffron mb-2 flex items-center gap-1">
                        <Gift size={12} /> Chadawa Added ({selectedChadawa.length} items)
                      </p>
                      {selectedChadawa.map((sc) => (
                        <div key={sc.item._id} className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span className="line-clamp-1 max-w-[65%]">{sc.item.name} {sc.qty > 1 && `×${sc.qty}`}</span>
                          <span className="text-saffron font-medium">₹{sc.item.price * sc.qty}</span>
                        </div>
                      ))}
                      <div className="border-t border-saffron/20 pt-1.5 mt-1 flex justify-between font-heading text-sm">
                        <span>Total</span>
                        <span className="text-saffron">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setBookingStep("details")}
                    className="btn-saffron w-full py-3 text-base font-semibold"
                  >
                    Proceed to Book 🪔
                  </button>

                  {chadawaItems.length > 0 && (
                    <div className="block lg:hidden mt-8 border-t border-border pt-6">
                      {renderChadawaSection()}
                    </div>
                  )}
                </div>
              )}

              {/* ── Details / Payment Step ── */}
              {bookingStep === "details" && (
                <form onSubmit={handleBook} className="card-devotional space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-heading text-lg text-foreground">Book This Puja</h3>
                      <p className="text-xs text-saffron font-semibold flex items-center gap-1">
                        🛕 {temple.name}
                      </p>
                    </div>
                    {selectedPkg && (
                      <span className="text-xs bg-saffron/10 text-saffron px-2 py-1 rounded-full">
                        {selectedPkg.label} — {formatCurrency(selectedPkg.price)}
                      </span>
                    )}
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-br from-saffron/5 to-purple-500/5 border border-saffron/20 rounded-xl p-3 space-y-2">
                    {/* Puja */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-saffron/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">📿</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{puja.name}</p>
                        <p className="text-[10px] text-saffron font-semibold mb-0.5">🛕 {temple.name}</p>
                        {selectedPkg && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Users size={10} className="shrink-0" />
                            {selectedPkg.persons} · {selectedPkg.label}
                          </p>
                        )}
                      </div>
                      <p className="text-xs font-heading text-saffron flex-shrink-0">{formatCurrency(pujaPrice)}</p>
                    </div>

                    {/* Chadawa rows */}
                    {selectedChadawa.length > 0 && (
                      <div className="border-t border-saffron/10 pt-2">
                        <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                          <Gift size={10} className="text-saffron" /> Chadawa Add-ons
                        </p>
                        {selectedChadawa.map((sc) => (
                          <div key={sc.item._id} className="flex items-center gap-2 mb-1">
                            <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0">
                              <Image src={sc.item.image || "/kasbeswari.jpg"} alt={sc.item.name} fill className="object-cover" />
                            </div>
                            <p className="text-xs text-foreground flex-1 line-clamp-1">{sc.item.name}</p>
                            <p className="text-xs text-muted-foreground flex-shrink-0">×{sc.qty}</p>
                            <p className="text-xs font-medium text-saffron flex-shrink-0">₹{sc.item.price * sc.qty}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {form.prasadDelivery && (
                      <div className="flex items-center gap-2 border-t border-saffron/10 pt-2">
                        <span className="text-xs">📦</span>
                        <p className="text-xs text-foreground flex-1">Prasad Delivery</p>
                        <p className="text-xs font-medium text-saffron">+₹151</p>
                      </div>
                    )}
                    {form.dakshina > 0 && (
                      <div className="flex items-center gap-2 border-t border-saffron/10 pt-2">
                        <span className="text-xs">🙏</span>
                        <p className="text-xs text-foreground flex-1">Pandit Ji Dakshina</p>
                        <p className="text-xs font-medium text-saffron">+{formatCurrency(form.dakshina)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {form.devoteeNames.map((name, idx) => (
                      <Input
                        key={idx}
                        label={`Devotee Name ${form.devoteeNames.length > 1 ? idx + 1 : ""}`.trim()}
                        required={idx === 0} // Only first is strictly required
                        placeholder="Name for Sankalp"
                        value={name}
                        onChange={(e) => {
                          const newNames = [...form.devoteeNames];
                          newNames[idx] = e.target.value;
                          setForm({ ...form, devoteeNames: newNames });
                        }}
                      />
                    ))}
                  </div>
                  {!session && (
                    <Input label="WhatsApp Mobile Number" required placeholder="10-digit mobile number" type="tel"
                      value={form.whatsappPhone} onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })} />
                  )}
                  <Input label="Gotra (Optional)" placeholder="e.g. Kashyap, Bharadwaj"
                    value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} />
                  <Textarea label="Sankalp / Intention" rows={2} placeholder="Your wish or prayer..."
                    value={form.sankalp} onChange={(e) => setForm({ ...form, sankalp: e.target.value })} />
                  {puja.availableDates && puja.availableDates.length > 0 ? (
                    <Select
                      label="Puja Date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      options={puja.availableDates.map(d => ({
                        value: d,
                        label: formatDisplayDate(d)
                      }))}
                    />
                  ) : (
                    <Input label="Puja Date" type="date" required min={new Date().toISOString().split("T")[0]}
                      value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  )}
                  <Select
                    label="Dakshina to Pandit Ji (Optional)"
                    value={form.dakshina.toString()}
                    onChange={(e) => setForm({ ...form, dakshina: Number(e.target.value) })}
                    options={[
                      { value: "0", label: "None" },
                      { value: "51", label: "₹51" },
                      { value: "101", label: "₹101" },
                      { value: "151", label: "₹151" },
                      { value: "201", label: "₹201" },
                      { value: "251", label: "₹251" },
                      { value: "501", label: "₹501" },
                      { value: "551", label: "₹551" },
                      { value: "1001", label: "₹1,001" },
                      { value: "2100", label: "₹2,100" },
                      { value: "5100", label: "₹5,100" },
                      { value: "9999", label: "₹9,999" },
                    ]}
                  />

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="prasad-d" className="w-4 h-4 accent-saffron"
                      checked={form.prasadDelivery} onChange={(e) => setForm({ ...form, prasadDelivery: e.target.checked })} />
                    <label htmlFor="prasad-d" className="text-sm text-foreground cursor-pointer">
                      Prasad Delivery (+₹151)
                    </label>
                  </div>
                  {form.prasadDelivery && (
                    <Textarea rows={2} placeholder="Delivery address..."
                      value={form.prasadAddress} onChange={(e) => setForm({ ...form, prasadAddress: e.target.value })} />
                  )}

                  {/* Grand Total */}
                  <div className="border-t border-deep-gold/20 pt-3 space-y-1.5">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Puja ({selectedPkg?.label ?? "Base"})</span>
                      <span>{formatCurrency(pujaPrice)}</span>
                    </div>
                    {chadawaTotal > 0 && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><ShoppingBag size={12} /> Chadawa ({selectedChadawa.length})</span>
                        <span>{formatCurrency(chadawaTotal)}</span>
                      </div>
                    )}
                    {form.prasadDelivery && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Prasad Delivery</span><span>+₹151</span>
                      </div>
                    )}
                    {form.dakshina > 0 && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Pandit Ji Dakshina</span><span>+{formatCurrency(form.dakshina)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-heading text-lg border-t border-deep-gold/20 pt-2">
                      <span className="text-foreground">Total</span>
                      <span className="text-saffron">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>

                  <Button type="submit" loading={loading} fullWidth size="lg">
                    {loading ? "Processing... 🪔" : "Confirm & Pay"}
                  </Button>
                  <button type="button" onClick={() => setBookingStep("package")}
                    className="w-full text-xs text-muted-foreground hover:text-foreground text-center mt-1">
                    ← Change package / chadawa
                  </button>
                </form>
              )}
            </>
          )}
        </div>
          </div>
        </div>
      </div>

      {/* Sticky Book Now Button on Mobile */}
      {showStickyButton && (
        <>
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 767px) {
              #whatsapp-floating-widget {
                bottom: 16px !important;
                right: 80px !important;
              }
            }
          `}} />
          <div className="md:hidden fixed bottom-4 right-[144px] z-50 animate-in fade-in duration-300">
            {hasActiveBooking ? (
              <Link
                href={`/user/bookings/${activeBookingId}`}
                className="bg-[#E65100] text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20 whitespace-nowrap text-center"
              >
                <span>Already Booked 🪔</span>
              </Link>
            ) : (
              <button
                onClick={() => { setBookingStep("details"); setShowMobileSidebar(true); }}
                className="bg-[#E65100] text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20 whitespace-nowrap"
              >
                <span>Book Now at {formatCurrency(grandTotal)} 🪔</span>
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
