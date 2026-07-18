"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { devToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Clock, CheckCircle2, Sparkles } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import type { IPuja } from "@/types";
import { PublicPage } from "@/components/shared/PublicPage";
import * as fpixel from "@/lib/fpixel";
import { getAttributionData } from "@/lib/attribution";

function formatDisplayDate(dateStr: string): string {
  try {
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

export default function BookPujaPage({ params }: { params: { slug: string; id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [puja, setPuja] = useState<IPuja | null>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [form, setForm] = useState({ devoteeName: "", whatsappPhone: "", gotra: "", sankalp: "", date: "", prasadDelivery: false, prasadAddress: "", dakshina: 0 });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    fetch(`/api/pujas/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPuja(d.data);
          setAds(d.ads || []);
          if (d.data.availableDates && d.data.availableDates.length > 0) {
            const firstDate = d.data.availableDates[0];
            setForm(f => ({ ...f, date: firstDate }));
          }
        }
      });
  }, [params.id]);

  const pujaPrice = puja?.price ? Number(puja.price) : 0;
  const prasadPrice = form.prasadDelivery ? 151 : 0;
  const grandTotal = pujaPrice + prasadPrice + Number(form.dakshina || 0);

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
        body: JSON.stringify({ amount: grandTotal, notes: { pujaName: puja?.name as string, templeSlug: params.slug } }),
      });
      const orderData = await orderRes.json();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: "INR",
        name: "ePoojapaath",
        description: puja?.name as string,
        order_id: orderData.data.id,
        theme: { color: "#D4820A" },
        prefill: { name: currentSession?.user?.name, email: currentSession?.user?.email },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            fpixel.event("Purchase", { content_name: puja?.name, value: grandTotal, currency: "INR" });
            fpixel.event("Lead", { content_name: puja?.name, value: grandTotal, currency: "INR" });
            const attribution = getAttributionData();
            await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...form, ...attribution, temple: puja?.temple, service: params.id, serviceType: "puja", serviceName: puja?.name, serviceNameHi: puja?.nameHi, amount: grandTotal, orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, paymentStatus: "paid" }),
            });
            setBooked(true);
            devToast.blessing("🙏 Puja Booked! Divine blessings incoming...");
            setTimeout(() => router.push("/user/bookings"), 3000);
          }
        },
      });

      fpixel.event("InitiateCheckout", { content_name: puja?.name, value: grandTotal, currency: "INR" });
      rzp.open();
    } catch { devToast.error("Booking failed. Please try again."); }
    finally { setLoading(false); }
  }

  if (!puja) {
    return (
      <PublicPage>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-4xl animate-float">🛕</div>
        </div>
      </PublicPage>
    );
  }

  return (
    <PublicPage>
      {booked && <ReactConfetti recycle={false} numberOfPieces={400} colors={["#D4820A","#B8860B","#8B6DB5","#C2567A"]} />}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Puja Details */}
          <div>
            <div className="relative h-56 rounded-2xl overflow-hidden mb-6 ring-2 ring-deep-gold/30">
              <Image src={puja.image as string || "/placeholder-puja.jpg"} alt={puja.name as string} fill className="object-cover" />
            </div>
            <h1 className="font-heading text-3xl text-foreground mb-1">{puja.name as string}</h1>
            <p className="font-sanskrit text-saffron mb-4">{puja.nameHi as string}</p>
            <p className="text-muted-foreground mb-4">{puja.description as string}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Clock size={14} /> {puja.duration as string}</span>
            </div>
            {Array.isArray(puja.benefits) && puja.benefits.length > 0 && (
              <div className="card-devotional mb-4">
                <h3 className="font-heading text-lg text-foreground mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {(puja.benefits as string[]).map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-saffron shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(puja.includes) && puja.includes.length > 0 && (
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-3">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {(puja.includes as string[]).map((inc) => (
                    <li key={inc} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles size={14} className="text-saffron shrink-0" />{inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBook} className="card-devotional h-fit space-y-4">
            <h2 className="font-heading text-2xl text-foreground">Book This Puja</h2>
            <Input
              label="Devotee Name"
              required
              placeholder="Name for Sankalp"
              value={form.devoteeName}
              onChange={(e) => setForm({ ...form, devoteeName: e.target.value })}
            />
            <Input
              label="WhatsApp Mobile Number"
              required
              placeholder="10-digit mobile number"
              type="tel"
              value={form.whatsappPhone}
              onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })}
            />
            <Input
              label="Gotra (Optional)"
              placeholder="e.g. Kashyap, Bharadwaj"
              value={form.gotra}
              onChange={(e) => setForm({ ...form, gotra: e.target.value })}
            />
            <Textarea
              label="Sankalp / Intention"
              rows={3}
              placeholder="Your wish or prayer intention..."
              value={form.sankalp}
              onChange={(e) => setForm({ ...form, sankalp: e.target.value })}
            />
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
              <Input
                label="Puja Date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
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
            <div className="flex items-center gap-3">
              <input type="checkbox" id="prasad" className="w-4 h-4 accent-saffron" checked={form.prasadDelivery} onChange={(e) => setForm({ ...form, prasadDelivery: e.target.checked })} />
              <label htmlFor="prasad" className="text-sm text-foreground cursor-pointer">Request Prasad Delivery (+₹151)</label>
            </div>
            {form.prasadDelivery && (
              <Textarea
                rows={2}
                placeholder="Delivery address..."
                value={form.prasadAddress}
                onChange={(e) => setForm({ ...form, prasadAddress: e.target.value })}
              />
            )}
            <div className="border-t border-deep-gold/20 pt-4">
               <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Puja Fee</span><span className="text-foreground font-medium">{formatCurrency(pujaPrice)}</span></div>
               {form.prasadDelivery && <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Prasad Delivery</span><span className="text-foreground">₹151</span></div>}
               {form.dakshina > 0 && <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Pandit Ji Dakshina</span><span className="text-foreground">+{formatCurrency(form.dakshina)}</span></div>}
               <div className="flex justify-between font-heading text-xl mt-2"><span className="text-foreground">Total</span><span className="text-saffron">{formatCurrency(grandTotal)}</span></div>
             </div>
             <Button type="submit" loading={loading} fullWidth size="lg">
                {loading ? "Processing... 🪔" : `Proceed to Pay ${formatCurrency(grandTotal)}`}
             </Button>
          </form>
        </div>

        {/* Dynamic Target Ad Banner */}
        {ads.length > 0 && (
          <div className="mt-12 border-t border-deep-gold/15 pt-8">
            <AdBanner ads={ads} />
          </div>
        )}
      </div>
    </PublicPage>
  );
}
