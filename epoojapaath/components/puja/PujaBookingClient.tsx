"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PujaPackageModal } from "./PujaPackageModal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import type { IPuja, IPujaPackage, IChadawa } from "@/types";
import { CheckCircle2, ShoppingBag, Users, Gift, ChevronRight, Minus, Plus } from "lucide-react";
import * as fpixel from "@/lib/fpixel";
import { getAttributionData } from "@/lib/attribution";

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
  chadawaItems?: (IChadawa & { _id: string })[];
}

// Step flow: "package" → "chadawa" → "details" → done
type Step = "package" | "chadawa" | "details";

export function PujaBookingClient({ puja, chadawaItems = [] }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPackages, setShowPackages] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<IPujaPackage | null>(
    puja.packages?.[0] ?? null
  );
  const [step, setStep] = useState<Step>("package");
  const [selectedChadawa, setSelectedChadawa] = useState<SelectedChadawa[]>([]);
  const [form, setForm] = useState({
    devoteeName: "",
    whatsappPhone: "",
    gotra: "",
    sankalp: "",
    date: "",
    prasadDelivery: false,
    prasadAddress: "",
    dakshina: 0,
  });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const [duration, setDuration] = useState<number>(1);

  const basePrice = selectedPkg ? selectedPkg.price : puja.price;
  const discountPercent = duration === 3 ? (puja.discount3Months || 0) : duration === 6 ? (puja.discount6Months || 0) : 0;
  const pujaPrice = basePrice * duration * (1 - discountPercent / 100);
  const chadawaTotal = selectedChadawa.reduce((sum, sc) => sum + sc.item.price * sc.qty, 0);
  const prasadPrice = form.prasadDelivery ? 151 : 0;
  const grandTotal = pujaPrice + chadawaTotal + prasadPrice + Number(form.dakshina || 0);

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
        sc.item._id === id
          ? { ...sc, qty: Math.max(1, sc.qty + delta) }
          : sc
      )
    );
  }

  function isSelected(id: string) {
    return selectedChadawa.some((sc) => sc.item._id === id);
  }

  function handleParticipate() {
    if (puja.packages && puja.packages.length > 0) {
      setShowPackages(true);
    } else {
      if (chadawaItems.length > 0) setStep("chadawa");
      else setStep("details");
    }
  }

  function handlePackageSelect(pkg: IPujaPackage) {
    setSelectedPkg(pkg);
    setShowPackages(false);
    if (chadawaItems.length > 0) setStep("chadawa");
    else setStep("details");
  }

  async function handleBook(e: React.FormEvent) {
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
          temple: typeof puja.temple === "object" ? (puja.temple as { _id: string })._id : puja.temple,
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

  // ── Step indicator ────────────────────────────────────────────────────────
  const steps = [
    { key: "package", label: "Package", icon: "📿" },
    ...(chadawaItems.length > 0 ? [{ key: "chadawa", label: "Chadawa", icon: "🌸" }] : []),
    { key: "details", label: "Details", icon: "📋" },
  ];

  return (
    <>
      {booked && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={400}
          colors={["#D4820A", "#B8860B", "#8B6DB5", "#C2567A"]}
        />
      )}

      {showPackages && puja.packages && (
        <PujaPackageModal
          packages={puja.packages}
          pujaName={puja.name}
          onSelect={handlePackageSelect}
          onClose={() => setShowPackages(false)}
        />
      )}

      {/* CTA sticky section (mobile) */}
      <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur border-t border-border px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {selectedPkg ? selectedPkg.persons : "Starting from"}
            </p>
            <p className="font-heading text-xl text-saffron">
              {formatCurrency(grandTotal)}
            </p>
          </div>
          <button
            onClick={handleParticipate}
            className="btn-saffron flex-1 py-3 text-sm font-semibold"
          >
            Participate Now 🪔
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block sticky top-24">

        {/* ── Step Progress Bar ── */}
        {step !== "package" && (
          <div className="flex items-center justify-center gap-1 mb-4">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1">
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${step === s.key
                      ? "bg-saffron text-white"
                      : steps.findIndex((x) => x.key === step) > i
                        ? "bg-green-500/20 text-green-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight size={12} className="text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Package Selection ── */}
        {step === "package" && (
          <div className="card-devotional">
            <div className="text-center mb-4">
              <h3 className="font-heading text-lg text-foreground mb-1">Book This Puja</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedPkg ? selectedPkg.persons : "Select package"}
              </p>
              <p className="font-heading text-3xl text-saffron">
                {formatCurrency(pujaPrice)}
              </p>
            </div>

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
                    <span className="font-medium flex items-center gap-2">
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
              <div className="mb-5 bg-card-bg/50 border border-border/60 rounded-xl p-3.5">
                <p className="text-xs text-muted-foreground mb-2.5 font-medium flex items-center gap-1">
                  📅 Subscription Duration (Upfront Purchase)
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
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
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

            <button
              onClick={() => {
                if (chadawaItems.length > 0) setStep("chadawa");
                else setStep("details");
              }}
              className="btn-saffron w-full py-3 text-base font-semibold flex items-center justify-center gap-2"
            >
              {chadawaItems.length > 0 ? "Next: Add Chadawa 🌸" : "Proceed to Book 🪔"}
            </button>
          </div>
        )}

        {/* ── STEP 2: Chadawa Selection ── */}
        {step === "chadawa" && (
          <div className="card-devotional">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-heading text-lg text-foreground">Add Chadawa</h3>
                <p className="text-xs text-muted-foreground">Optional sacred offerings to the deity</p>
              </div>
              <div className="text-right">
                <p className="font-sanskrit text-saffron text-xs">चढ़ावा</p>
                {selectedChadawa.length > 0 && (
                  <p className="text-xs font-semibold text-saffron">
                    {selectedChadawa.length} selected
                  </p>
                )}
              </div>
            </div>

            {/* Package reminder */}
            {selectedPkg && (
              <div className="bg-saffron/5 border border-saffron/20 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
                <Users size={14} className="text-saffron shrink-0" />
                <span className="text-xs text-foreground font-medium">
                  {selectedPkg.label} — {selectedPkg.persons}
                </span>
                <span className="ml-auto font-heading text-saffron text-sm">{formatCurrency(pujaPrice)}</span>
              </div>
            )}

            {/* Chadawa Items */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin mb-3">
              {chadawaItems.map((item) => {
                const selected = isSelected(item._id);
                const sc = selectedChadawa.find((s) => s.item._id === item._id);
                return (
                  <div
                    key={item._id}
                    className={`rounded-xl border transition-all overflow-hidden ${selected
                        ? "border-saffron bg-saffron/5"
                        : "border-border bg-background hover:border-saffron/40"
                      }`}
                  >
                    <div
                      className="flex items-center gap-3 p-2.5 cursor-pointer"
                      onClick={() => toggleChadawa(item)}
                    >
                      {/* Item Image */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/kasbeswari.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs font-sanskrit text-saffron/70 line-clamp-1">
                          {item.nameHi}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      {/* Price + Checkbox */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <p className="font-heading text-sm text-saffron">₹{item.price}</p>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected
                              ? "bg-saffron border-saffron"
                              : "border-border"
                            }`}
                        >
                          {selected && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </div>
                    </div>

                    {/* Qty controls (when selected) */}
                    {selected && sc && (
                      <div className="flex items-center justify-between px-3 py-2 border-t border-saffron/20 bg-saffron/5">
                        <span className="text-xs text-muted-foreground">Quantity</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQty(item._id, -1); }}
                            className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:border-saffron transition"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="font-heading text-sm text-foreground w-4 text-center">{sc.qty}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQty(item._id, 1); }}
                            className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:border-saffron transition"
                          >
                            <Plus size={10} />
                          </button>
                          <span className="text-xs font-semibold text-saffron ml-1">
                            = ₹{item.price * sc.qty}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Running total */}
            {selectedChadawa.length > 0 && (
              <div className="bg-saffron/5 border border-saffron/20 rounded-lg px-3 py-2 mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Puja ({selectedPkg?.label ?? "Base"})</span>
                  <span>{formatCurrency(pujaPrice)}</span>
                </div>
                {selectedChadawa.map((sc) => (
                  <div key={sc.item._id} className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span className="line-clamp-1 max-w-[60%]">
                      {sc.item.name} × {sc.qty}
                    </span>
                    <span>₹{sc.item.price * sc.qty}</span>
                  </div>
                ))}
                <div className="border-t border-saffron/20 pt-1 mt-1 flex justify-between font-heading text-sm">
                  <span className="text-foreground">Total</span>
                  <span className="text-saffron">{formatCurrency(pujaPrice + chadawaTotal)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setStep("package")}
                className="flex-1 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg py-2.5 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("details")}
                className="flex-[2] btn-saffron py-2.5 text-sm font-semibold"
              >
                {selectedChadawa.length > 0
                  ? `Next: Fill Details →`
                  : "Skip & Fill Details →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Booking Details ── */}
        {step === "details" && (
          <form onSubmit={handleBook} className="card-devotional space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-heading text-lg text-foreground">Book This Puja</h3>
              {selectedPkg && (
                <span className="text-xs bg-saffron/10 text-saffron px-2 py-1 rounded-full">
                  {selectedPkg.label} — {formatCurrency(selectedPkg.price)}
                </span>
              )}
            </div>

            {/* Booking Summary box */}
            <div className="bg-gradient-to-br from-saffron/5 to-purple-500/5 border border-saffron/20 rounded-xl p-3 space-y-2">
              {/* Puja row */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-saffron/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">📿</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground line-clamp-1">{puja.name}</p>
                  {selectedPkg && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users size={10} className="shrink-0" />
                      {selectedPkg.persons} · {selectedPkg.label}
                    </p>
                  )}
                </div>
                <p className="text-xs font-heading text-saffron flex-shrink-0">{formatCurrency(pujaPrice)}</p>
              </div>

              {/* Chadawa rows */}
              {selectedChadawa.length > 0 && (
                <>
                  <div className="border-t border-saffron/10 pt-2">
                    <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Gift size={10} className="text-saffron" />
                      Chadawa Add-ons
                    </p>
                    {selectedChadawa.map((sc) => (
                      <div key={sc.item._id} className="flex items-center gap-2 mb-1">
                        <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={sc.item.image || "/kasbeswari.jpg"}
                            alt={sc.item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs text-foreground flex-1 line-clamp-1">{sc.item.name}</p>
                        <p className="text-xs text-muted-foreground flex-shrink-0">×{sc.qty}</p>
                        <p className="text-xs font-medium text-saffron flex-shrink-0">₹{sc.item.price * sc.qty}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Prasad */}
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

            <Input
              label="Devotee Name"
              required
              placeholder="Name for Sankalp"
              value={form.devoteeName}
              onChange={(e) => setForm({ ...form, devoteeName: e.target.value })}
            />
            {!session && (
              <Input
                label="WhatsApp Mobile Number"
                required
                placeholder="10-digit mobile number"
                type="tel"
                value={form.whatsappPhone}
                onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })}
              />
            )}
            <Input
              label="Gotra (Optional)"
              placeholder="e.g. Kashyap, Bharadwaj"
              value={form.gotra}
              onChange={(e) => setForm({ ...form, gotra: e.target.value })}
            />
            <Textarea
              label="Sankalp / Intention"
              rows={2}
              placeholder="Your wish or prayer..."
              value={form.sankalp}
              onChange={(e) => setForm({ ...form, sankalp: e.target.value })}
            />
            <Input
              label="Puja Date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
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
              <input
                type="checkbox"
                id="prasad-d"
                className="w-4 h-4 accent-saffron"
                checked={form.prasadDelivery}
                onChange={(e) => setForm({ ...form, prasadDelivery: e.target.checked })}
              />
              <label htmlFor="prasad-d" className="text-sm text-foreground cursor-pointer">
                Prasad Delivery (+₹151)
              </label>
            </div>
            {form.prasadDelivery && (
              <Textarea
                rows={2}
                placeholder="Delivery address..."
                value={form.prasadAddress}
                onChange={(e) => setForm({ ...form, prasadAddress: e.target.value })}
              />
            )}

            {/* Grand Total */}
            <div className="border-t border-deep-gold/20 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Puja ({selectedPkg?.label ?? "Base"})</span>
                <span>{formatCurrency(pujaPrice)}</span>
              </div>
              {chadawaTotal > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShoppingBag size={12} />
                    Chadawa ({selectedChadawa.length} items)
                  </span>
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

            <button
              type="button"
              onClick={() => setStep(chadawaItems.length > 0 ? "chadawa" : "package")}
              className="w-full text-xs text-muted-foreground hover:text-foreground text-center mt-1"
            >
              {chadawaItems.length > 0 ? "← Change Chadawa" : "← Change package"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
