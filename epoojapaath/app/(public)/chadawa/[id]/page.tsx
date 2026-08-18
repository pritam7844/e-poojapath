"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Star, MapPin, CheckCircle2, ChevronDown, Flower2,
  BookOpen, Sparkles, Plus, Minus, ShoppingBasket, Check,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { PublicPage } from "@/components/shared/PublicPage";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import * as fpixel from "@/lib/fpixel";
import { getAttributionData } from "@/lib/attribution";
import { devToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";

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

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

type OfferingItem = {
  name: string;
  nameHi: string;
  price: number;
  image: string;
  description?: string;
};

type Temple = {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  description: string;
  location?: { city: string; state: string };
  rating: number;
  reviewCount: number;
  availableChadawaDates?: string[];
};

type ChadawaData = {
  _id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  image: string;
  items: string[];
  offeringItems: OfferingItem[];
  deity: string;
  temple: Temple | string;
  availableDates?: string[];
};

const HOW_IT_WORKS = [
  { icon: "🌸", title: "Select Your Items", description: "Pick individual offerings or choose the full chadawa package for your deity." },
  { icon: "🙏", title: "Enter Sankalp Details", description: "Provide your name and gotra — the offering is dedicated in your name." },
  { icon: "📺", title: "Receive Blessed Prasad", description: "Watch your offering video and receive sacred prasad at your doorstep." },
];

const DEFAULT_FAQS = [
  { question: "What is Chadawa?", answer: "Chadawa (चढ़ावा) refers to sacred offerings made to deities at temples — flowers, fruits, bilva patra and other items that please the deity." },
  { question: "Can I select individual items?", answer: "Yes! You can add individual items à la carte using the quantity buttons, or select the full package offering." },
  { question: "Will I receive a video of the offering?", answer: "Yes, after the chadawa is performed, a recorded video is provided with devotional intent." },
  { question: "Can I dedicate chadawa for someone else?", answer: "Absolutely! Mention the person's name in the Sankalp field and the pandit will dedicate it to them." },
];

export default function ChadawaDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [chadawa, setChadawa] = useState<ChadawaData | null>(null);
  const [qty, setQty] = useState<Record<number, number>>({});
  const [form, setForm] = useState({ devoteeName: "", whatsappPhone: "", gotra: "", sankalp: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [offered, setOffered] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // States to hold other special offerings from the same temple
  const [templeSpecialChadawas, setTempleSpecialChadawas] = useState<ChadawaData[]>([]);
  const [selectedOthers, setSelectedOthers] = useState<Record<string, boolean>>({});
  const [showAllSpecialChadawas, setShowAllSpecialChadawas] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviewsList = [
    { name: "Kavita R.", comment: "Offering the chadawa at this temple felt truly divine. The prasad delivery was prompt and beautifully packed.", stars: 5 },
    { name: "Mohan D.", comment: "The pandit chanted with full devotion. Received a detailed video of the entire offering. Very satisfied!", stars: 5 },
    { name: "Sunita P.", comment: "I could select individual items — loved the flexibility! My mother was moved watching the ritual video.", stars: 4 },
    { name: "Arjun K.", comment: "Simple to book, authentic ritual. The deity felt genuinely pleased with the offering.", stars: 5 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviewsList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviewsList.length]);

  useEffect(() => {
    fetch(`/api/chadawa/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setChadawa(d.data);
          fpixel.viewContent({
            content_name: d.data.name,
            content_category: "Chadawa Offering",
            value: d.data.price || 0,
            currency: "INR",
          });
        }
      });
  }, [params.id]);

  const templeObj = typeof chadawa?.temple === "object" ? chadawa.temple : null;
  const resolvedAvailableDates = (chadawa?.availableDates && chadawa.availableDates.length > 0)
    ? chadawa.availableDates
    : (templeObj && templeObj.availableChadawaDates && templeObj.availableChadawaDates.length > 0)
      ? templeObj.availableChadawaDates
      : null;

  useEffect(() => {
    if (resolvedAvailableDates && resolvedAvailableDates.length > 0) {
      const firstDate = resolvedAvailableDates[0];
      setForm(f => ({ ...f, date: firstDate }));
    }
  }, [resolvedAvailableDates]);

  // Fetch other special offerings when the main chadawa is loaded
  useEffect(() => {
    if (chadawa) {
      const templeId = typeof chadawa.temple === "object" ? chadawa.temple._id : chadawa.temple;
      fetch(`/api/temples/${templeId}/chadawa`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            // Filter: only keep other active special chadawas
            const others = d.data.filter(
              (item: any) => item.isSpecial && item.isActive && item._id !== chadawa._id
            );
            setTempleSpecialChadawas(others);
          }
        });
    }
  }, [chadawa]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setForm((f) => ({
              ...f,
              devoteeName: f.devoteeName || data.data.name || "",
              whatsappPhone: f.whatsappPhone || data.data.phone || "",
              gotra: f.gotra || data.data.gotra || "",
            }));
          }
        })
        .catch((err) => console.error("Error prefilling form:", err));
    }
  }, [session]);

  const changeQty = useCallback((idx: number, delta: number) => {
    setQty((prev) => {
      const next = Math.max(0, (prev[idx] ?? 0) + delta);
      return { ...prev, [idx]: next };
    });
  }, []);

  const selectedItems = (chadawa?.offeringItems ?? [])
    .map((item, idx) => ({ ...item, qty: qty[idx] ?? 0, idx }))
    .filter((i) => i.qty > 0);

  const itemsTotal = selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const basePrice  = chadawa?.price ?? 0;

  // Calculate selected other offerings
  const selectedOthersList = templeSpecialChadawas.filter((c) => selectedOthers[c._id]);
  const othersTotal = selectedOthersList.reduce((sum, c) => sum + c.price, 0);

  const grandTotal = (selectedItems.length > 0 ? itemsTotal : basePrice) + othersTotal;

  async function handleOffer(e: React.FormEvent) {
    e.preventDefault();
    let currentSession = session;
    setLoading(true);
    try {
      if (!currentSession) {
        if (!form.devoteeName.trim()) {
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
            name: form.devoteeName,
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
            name: form.devoteeName,
            email: guestData.email,
          }
        } as any;
      }
      // Combine offering names
      const combinedNames = [chadawa?.name, ...selectedOthersList.map((c) => c.name)].join(" + ");
      const combinedNamesHi = [chadawa?.nameHi || chadawa?.name, ...selectedOthersList.map((c) => c.nameHi || c.name)].join(" + ");

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, notes: { chadawaName: combinedNames.length > 250 ? combinedNames.substring(0, 247) + "..." : combinedNames } }),
      });
      const orderData = await orderRes.json();

      const templeId = typeof chadawa?.temple === "object" ? chadawa.temple._id : chadawa?.temple;
      const attribution = getAttributionData();
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...attribution,
          temple: templeId,
          service: params.id,
          serviceType: "chadawa",
          serviceName: combinedNames,
          serviceNameHi: combinedNamesHi,
          amount: grandTotal,
          selectedChadawa: [
            { name: chadawa?.name, price: selectedItems.length > 0 ? itemsTotal : basePrice, qty: 1, total: selectedItems.length > 0 ? itemsTotal : basePrice },
            ...selectedOthersList.map((c) => ({ name: c.name, price: c.price, qty: 1, total: c.price }))
          ],
          selectedItems: [
            ...selectedItems.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
            ...selectedOthersList.map((c) => ({ name: c.name, qty: 1, price: c.price }))
          ],
          orderId: orderData.data.id,
          paymentStatus: "pending",
          status: "pending",
        }),
      });
      const bookingJson = await bookingRes.json();
      const bookingId = bookingJson.data._id;

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: "INR",
        name: "ePoojapaath",
        description: combinedNames.length > 255 ? combinedNames.substring(0, 252) + "..." : combinedNames,
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
            fpixel.event("Purchase", { content_name: combinedNames, value: grandTotal, currency: "INR" });
            fpixel.event("Lead", { content_name: combinedNames, value: grandTotal, currency: "INR" });
            await fetch(`/api/bookings/${bookingId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                paymentStatus: "paid",
                status: "confirmed",
              }),
            });
            setOffered(true);
            devToast.blessing("🌸 Chadawa Offered! May the divine bless you...");
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

      fpixel.event("InitiateCheckout", { content_name: combinedNames, value: grandTotal, currency: "INR" });
      rzp.open();

    } catch {
      devToast.error("Offering failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!chadawa) {
    return (
      <PublicPage>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-4xl animate-bounce">🌸</div>
        </div>
      </PublicPage>
    );
  }

  const temple = typeof chadawa.temple === "object" ? chadawa.temple : null;
  const displayRating  = temple?.rating ?? 4.5;
  const displayReviews = temple?.reviewCount ?? 80;
  const hasOfferingItems = chadawa.offeringItems && chadawa.offeringItems.length > 0;

  return (
    <PublicPage>
      {offered && (
        <ReactConfetti recycle={false} numberOfPieces={400} colors={["#D4820A", "#B8860B", "#8B6DB5", "#C2567A"]} />
      )}

      {/* ── Hero ── */}
      <div className="relative h-64 md:h-80 w-full">
        <Image src={chadawa.image || "/placeholder-chadawa.jpg"} alt={chadawa.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto">
          <p className="text-white/80 text-sm font-medium mb-1 flex items-center gap-1.5">
            <Flower2 size={14} /> Chadawa Offering at <span className="text-saffron font-semibold">{temple ? temple.name : "Temple"}</span>
          </p>
          <h1 className="text-white font-heading text-2xl md:text-3xl leading-tight max-w-3xl">{chadawa.name}</h1>
          <p className="text-white/70 font-sanskrit text-base mt-1">{chadawa.nameHi}</p>
        </div>
      </div>

      {/* ── Meta Bar ── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center gap-4">
          {temple && (
            <Link href={`/temples/${temple.slug}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-saffron transition-colors">
              <MapPin size={14} />
              <span>{temple.name}{temple.location ? `, ${temple.location.city}` : ""}</span>
            </Link>
          )}
          <span className="text-border">|</span>
          <div className="flex items-center gap-1 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} className={i < Math.round(displayRating) ? "fill-saffron text-saffron" : "text-muted"} />
            ))}
            <span className="text-saffron font-semibold ml-1">{displayRating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">• {displayReviews}+ Reviews</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Flower2 size={14} className="text-lotus-pink" />
            <span>Deity: <span className="font-medium text-foreground">{chadawa.deity}</span></span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-32 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── Offer One-Time Chadawa ── */}
            {hasOfferingItems && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-heading text-xl text-foreground">Offer One-Time Chadawa</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Add individual items — total updates live</p>
                  </div>
                  {selectedItems.length > 0 && (
                    <span className="text-xs bg-saffron/10 text-saffron font-semibold px-3 py-1 rounded-full border border-saffron/20">
                      {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} added
                    </span>
                  )}
                </div>

                {/* Clean horizontal item list */}
                <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
                  {chadawa.offeringItems.map((item, idx) => {
                    const count = qty[idx] ?? 0;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 px-4 py-3.5 transition-colors ${
                          count > 0 ? "bg-saffron/5" : "bg-card hover:bg-muted/30"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>

                        {/* Name + desc */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm leading-snug">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-sanskrit">{item.nameHi}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{item.description}</p>
                          )}
                          <p className="text-saffron font-bold text-sm mt-1">{formatCurrency(item.price)}</p>
                        </div>

                        {/* Qty controls */}
                        <div className="shrink-0">
                          {count === 0 ? (
                            <button
                              onClick={() => changeQty(idx, 1)}
                              className="flex items-center gap-1 border-2 border-saffron text-saffron text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-saffron hover:text-white active:scale-95 transition-all"
                            >
                              <Plus size={12} /> Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => changeQty(idx, -1)}
                                className="w-7 h-7 rounded-lg border-2 border-saffron/40 flex items-center justify-center text-saffron hover:bg-saffron/10 active:scale-95 transition"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="font-bold text-foreground text-sm w-5 text-center tabular-nums">{count}</span>
                              <button
                                onClick={() => changeQty(idx, 1)}
                                className="w-7 h-7 rounded-lg bg-saffron flex items-center justify-center text-white hover:bg-deep-gold active:scale-95 transition"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected items summary */}
                {selectedItems.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-saffron/25 bg-gradient-to-br from-saffron/5 to-transparent p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ShoppingBasket size={15} className="text-saffron" /> Your Cart
                    </h3>
                    <div className="space-y-2 mb-3">
                      {selectedItems.map((item) => (
                        <div key={item.idx} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {item.name}
                            <span className="ml-1.5 bg-saffron/10 text-saffron text-xs font-bold px-1.5 py-0.5 rounded">×{item.qty}</span>
                          </span>
                          <span className="text-sm font-semibold text-foreground">{formatCurrency(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-saffron/20 pt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span className="font-heading text-lg text-saffron">{formatCurrency(itemsTotal)}</span>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ── Add More Special Offerings ── */}
            {templeSpecialChadawas.length > 0 && (() => {
              const displayedSpecialChadawas = showAllSpecialChadawas ? templeSpecialChadawas : templeSpecialChadawas.slice(0, 3);
              const hasMoreSpecialChadawas = templeSpecialChadawas.length > 3;

              return (
                <section className="mt-8 border-t border-border/80 pt-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-heading text-base sm:text-xl text-foreground flex items-center gap-2 font-bold">
                        <Sparkles size={18} className="text-saffron animate-pulse" /> Add More Special Offerings
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Select other special offerings to combine with this booking</p>
                    </div>
                    {selectedOthersList.length > 0 && (
                      <span className="text-xs bg-saffron/10 text-saffron font-semibold px-2.5 py-1 rounded-full border border-saffron/20">
                        {selectedOthersList.length} selected
                      </span>
                    )}
                  </div>

                  {/* 3-Column Compact Grid for Special Offerings */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {displayedSpecialChadawas.map((item) => {
                      const isChecked = !!selectedOthers[item._id];
                      return (
                        <div
                          key={item._id}
                          onClick={() => setSelectedOthers((prev) => ({ ...prev, [item._id]: !isChecked }))}
                          className={`card-devotional cursor-pointer overflow-hidden p-1.5 sm:p-2.5 group transition-all duration-200 w-full flex flex-col justify-between rounded-xl border-2 select-none ${
                            isChecked
                              ? "border-saffron bg-saffron/10 shadow-md shadow-saffron/10"
                              : "border-border bg-card hover:border-saffron/40"
                          }`}
                        >
                          <div>
                            <div className="relative h-12 sm:h-16 w-full rounded-lg overflow-hidden mb-1">
                              <Image
                                src={item.image || "/kasbeswari.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-1 right-1">
                                <div
                                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center border transition-all ${
                                    isChecked
                                      ? "bg-saffron border-saffron text-white shadow"
                                      : "border-white/80 bg-black/30 backdrop-blur-xs"
                                  }`}
                                >
                                  {isChecked && <Check size={11} className="stroke-[3]" />}
                                </div>
                              </div>
                            </div>
                            <p className="font-heading text-[9.5px] sm:text-xs font-bold text-foreground line-clamp-1 leading-tight">{item.name}</p>
                            {item.nameHi && <p className="text-[8.5px] sm:text-[10px] text-saffron font-sanskrit line-clamp-1">{item.nameHi}</p>}
                          </div>

                          <div className="mt-1 flex items-center justify-between pt-1 border-t border-border/40">
                            <p className="font-heading text-xs sm:text-sm font-bold text-saffron">{formatCurrency(item.price)}</p>
                            <div
                              className={`text-[8.5px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                                isChecked ? "bg-saffron text-white" : "bg-saffron/10 text-saffron border border-saffron/20"
                              }`}
                            >
                              {isChecked ? "Added" : "+ Add"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* See More / Show Less Button */}
                  {hasMoreSpecialChadawas && (
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => setShowAllSpecialChadawas(!showAllSpecialChadawas)}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-saffron/30 bg-saffron/5 text-saffron text-xs font-bold hover:bg-saffron/10 active:scale-95 transition-all shadow-sm"
                      >
                        <span>{showAllSpecialChadawas ? "Show Less" : `See More (${templeSpecialChadawas.length - 3} More Offerings)`}</span>
                        {showAllSpecialChadawas ? <ChevronDown size={14} className="rotate-180 transition-transform" /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* ── Included Items ── */}
            {chadawa.items.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-4">This Chadawa Includes</h2>
                <div className="card-devotional grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chadawa.items.map((inc) => (
                    <div key={inc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={15} className="text-lotus-pink shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── How It Works ── */}
            <section>
              <h2 className="font-heading text-lg sm:text-2xl text-foreground mb-3 sm:mb-6">How Chadawa Booking Works?</h2>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={i} className="card-devotional text-center p-2 sm:p-4 flex flex-col items-center justify-start">
                    <div className="text-xl sm:text-3xl mb-1.5">{step.icon}</div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-lotus-pink/20 text-lotus-pink text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <h3 className="font-heading text-[11px] sm:text-base text-foreground leading-tight">{step.title}</h3>
                    </div>
                    <p className="text-[10px] sm:text-sm text-muted-foreground leading-tight sm:leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── About Temple ── */}
            {temple && (
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-4">About {temple.name}</h2>
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
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {temple.description?.startsWith("<") || /<[a-z][\s\S]*>/i.test(temple.description || "")
                        ? temple.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
                        : temple.description}
                    </p>
                    <Link href={`/temples/${temple.slug}`} className="inline-block mt-3 text-sm text-saffron hover:underline font-medium">
                      View Temple →
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* ── About Chadawa ── */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-3">About {chadawa.name}</h2>
              <div className="card-devotional">
                <p className="text-muted-foreground leading-relaxed">{chadawa.description}</p>
                {chadawa.descriptionHi && (
                  <p className="font-sanskrit text-saffron/80 text-sm mt-4 leading-relaxed">{chadawa.descriptionHi}</p>
                )}
              </div>
            </section>

            {/* ── Reviews ── */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={i < Math.round(displayRating) ? "fill-saffron text-saffron" : "fill-muted text-muted"} />
                  ))}
                </div>
                <h2 className="font-heading text-xl sm:text-2xl text-foreground">
                  {displayRating.toFixed(1)} Stories of Blessed Experiences
                </h2>
              </div>

              <div className="relative w-full">
                {/* Left navigation arrow */}
                <button
                  onClick={() => setCurrentReviewIndex((prev) => (prev <= 0 ? reviewsList.length - 1 : prev - 1))}
                  className="absolute -left-2.5 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-border/80 text-foreground shadow-md flex items-center justify-center hover:bg-saffron hover:text-white transition"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Right navigation arrow */}
                <button
                  onClick={() => setCurrentReviewIndex((prev) => (prev >= reviewsList.length - 1 ? 0 : prev + 1))}
                  className="absolute -right-2.5 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-border/80 text-foreground shadow-md flex items-center justify-center hover:bg-saffron hover:text-white transition"
                  aria-label="Next review"
                >
                  <ChevronRight size={16} />
                </button>

                <div className="overflow-hidden w-full rounded-2xl">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                  >
                    {reviewsList.map((review, i) => (
                      <div key={i} className="w-full shrink-0 select-none">
                        <div className="card-devotional w-full min-h-[140px] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star key={j} size={12} className={j < review.stars ? "fill-saffron text-saffron" : "fill-muted text-muted"} />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">&ldquo;{review.comment}&rdquo;</p>
                          </div>
                          <p className="text-xs font-semibold text-foreground">— {review.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
                
              {/* Dots indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {reviewsList.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentReviewIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentReviewIndex ? 'bg-saffron w-6' : 'bg-muted/65 hover:bg-muted'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-6 text-center">Know More About This Chadawa</h2>
              <div className="space-y-3">
                {DEFAULT_FAQS.map((faq, i) => (
                  <details key={i} className="card-devotional cursor-pointer group" open={i === 0}>
                    <summary className="flex items-center justify-between font-medium text-foreground text-sm list-none">
                      <span className="flex items-center gap-2">
                        <BookOpen size={14} className="text-lotus-pink shrink-0" />
                        {faq.question}
                      </span>
                      <ChevronDown size={16} className="text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-5">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* ── Trust ── */}
            <section className="text-center py-8 border-t border-border">
              <div className="inline-flex items-center gap-2 bg-lotus-pink/10 border border-lotus-pink/30 rounded-full px-6 py-3 mb-4">
                <Sparkles size={16} className="text-lotus-pink" />
                <span className="text-sm font-medium text-foreground">Authenticity You Can Trust</span>
                <Sparkles size={16} className="text-lotus-pink" />
              </div>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Every chadawa is offered by official temple Pandits following sacred Vedic traditions.
              </p>
            </section>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="lg:col-span-1 hidden lg:block">
            {!showForm ? (
              <div className="card-devotional sticky top-24">
                <div className="relative h-44 -mx-6 -mt-6 mb-5 rounded-t-2xl overflow-hidden">
                  <Image src={chadawa.image} alt={chadawa.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="text-center mb-4">
                  <p className="font-sanskrit text-saffron mb-1">{chadawa.nameHi}</p>
                  <p className="text-xs text-muted-foreground mb-2">Offering at {temple?.name}</p>
                </div>

                {/* Live total */}
                <div className="bg-muted/40 rounded-xl p-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Selected Offerings</p>
                  <div className="space-y-2 mb-3">
                    {/* Main offering */}
                    {selectedItems.length > 0 ? (
                      selectedItems.map((item) => (
                        <div key={item.idx} className="flex justify-between text-xs">
                          <span className="text-muted-foreground truncate mr-2">{item.name} ×{item.qty}</span>
                          <span className="text-foreground font-medium shrink-0">{formatCurrency(item.price * item.qty)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between text-xs text-foreground">
                        <span className="text-muted-foreground truncate mr-2">{chadawa.name}</span>
                        <span className="font-semibold shrink-0">{formatCurrency(basePrice)}</span>
                      </div>
                    )}
                    
                    {/* Additional special offerings */}
                    {selectedOthersList.map((item) => (
                      <div key={item._id} className="flex justify-between text-xs text-foreground">
                        <span className="text-muted-foreground truncate mr-2">+ {item.name}</span>
                        <span className="text-saffron font-semibold shrink-0">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border pt-2 flex justify-between font-heading text-sm">
                    <span className="text-foreground">Grand Total</span>
                    <span className="text-saffron text-lg font-bold">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-3 rounded-xl font-semibold text-white text-base bg-gradient-to-r from-purple-600 via-saffron to-orange-500 hover:opacity-90 transition shadow-md"
                >
                  Offer Chadawa 🌸
                </button>
              </div>
            ) : (
              <form onSubmit={handleOffer} className="card-devotional sticky top-24 space-y-4">
                <h3 className="font-heading text-xl text-foreground mb-1">Make an Offering</h3>
                <p className="text-xs text-muted-foreground">
                  Total: <span className="text-saffron font-bold text-sm">{formatCurrency(grandTotal)}</span>
                  {(selectedItems.length > 0 || selectedOthersList.length > 0) && (
                    <span className="ml-1">
                      ({selectedItems.length + selectedOthersList.length} items)
                    </span>
                  )}
                </p>
                <Input label="Devotee Name" required placeholder="Name for Sankalp" value={form.devoteeName} onChange={(e) => setForm({ ...form, devoteeName: e.target.value })} />
                <Input label="WhatsApp Mobile Number" required placeholder="10-digit mobile number" type="tel" value={form.whatsappPhone} onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })} />
                <Input label="Gotra (Optional)" placeholder="e.g. Kashyap, Bharadwaj" value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} />
                <Textarea label="Sankalp / Wish" rows={2} placeholder="Your prayer or intention..." value={form.sankalp} onChange={(e) => setForm({ ...form, sankalp: e.target.value })} />
                {resolvedAvailableDates && resolvedAvailableDates.length > 0 ? (
                  <Select
                    label="Offering Date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    options={resolvedAvailableDates.map(d => ({
                      value: d,
                      label: formatDisplayDate(d)
                    }))}
                  />
                ) : (
                  <Input label="Offering Date" type="date" required min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                )}
                <div className="border-t border-deep-gold/20 pt-3">
                  <div className="flex justify-between font-heading text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-saffron">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
                <Button type="submit" loading={loading} fullWidth size="lg">
                  {loading ? "Processing... 🌸" : `Pay ${formatCurrency(grandTotal)}`}
                </Button>
                <button type="button" onClick={() => setShowForm(false)} className="w-full text-xs text-muted-foreground hover:text-foreground text-center">
                  ← Change selection
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/97 backdrop-blur border-t border-border lg:hidden">
        {showForm ? (
          <form onSubmit={handleOffer} className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input label="Your Name" required placeholder="Devotee name" value={form.devoteeName} onChange={(e) => setForm({ ...form, devoteeName: e.target.value })} />
              {resolvedAvailableDates && resolvedAvailableDates.length > 0 ? (
                <Select
                  label="Date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  options={resolvedAvailableDates.map(d => ({
                    value: d,
                    label: formatDisplayDate(d)
                  }))}
                />
              ) : (
                <Input label="Date" type="date" required min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              )}
            </div>
            <Input label="WhatsApp Mobile Number" required placeholder="10-digit number" type="tel" value={form.whatsappPhone} onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })} />
            <Input label="Gotra (Optional)" placeholder="e.g. Kashyap" value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} />
            <Textarea label="Sankalp" rows={1} placeholder="Your prayer..." value={form.sankalp} onChange={(e) => setForm({ ...form, sankalp: e.target.value })} />
            <div className="flex gap-3 items-center">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-heading text-lg text-saffron">{formatCurrency(grandTotal)}</p>
              </div>
              <Button type="submit" loading={loading} fullWidth size="lg">
                {loading ? "Processing..." : `Pay ${formatCurrency(grandTotal)}`}
              </Button>
            </div>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-muted-foreground w-full text-center">← Back</button>
          </form>
        ) : (
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                {(selectedItems.length > 0 || selectedOthersList.length > 0)
                  ? `${selectedItems.length + selectedOthersList.length} items selected`
                  : "Total Offering"}
              </p>
              <p className="font-heading text-xl text-saffron">{formatCurrency(grandTotal)}</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-purple-600 via-saffron to-orange-500 hover:opacity-90 transition"
            >
              Offer Chadawa 🌸
            </button>
          </div>
        )}
      </div>
    </PublicPage>
  );
}
