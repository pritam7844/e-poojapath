"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { devToast } from "@/lib/toast";
import * as fpixel from "@/lib/fpixel";
import { getAttributionData } from "@/lib/attribution";

export function TempleRegisterCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    templeName: "",
    deity: "",
    city: "",
    state: "",
    contactName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.templeName.trim()) return devToast.error("Temple name is required");
    if (!formData.city.trim()) return devToast.error("City is required");
    if (!formData.state.trim()) return devToast.error("State is required");
    if (!formData.contactName.trim()) return devToast.error("Contact name is required");
    if (!formData.phone.trim()) return devToast.error("Phone number is required");

    setSubmitting(true);
    try {
      const attribution = getAttributionData();
      const res = await fetch("/api/temple-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...attribution }),
      });

      const data = await res.json();
      if (data.success) {
        fpixel.event("Lead", { content_name: "Temple Registration Request", templeName: formData.templeName, contactName: formData.contactName });
        devToast.success(data.message || "Submitted successfully! 🙏");
        setIsOpen(false);
        setFormData({
          templeName: "",
          deity: "",
          city: "",
          state: "",
          contactName: "",
          phone: "",
          email: "",
          notes: "",
        });
      } else {
        devToast.error(data.error || "Failed to submit request");
      }
    } catch {
      devToast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="section-padding relative overflow-hidden">
        {/* Lotus gradient background */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #F0ECFF 0%, #FFF0F8 50%, #EEF2FF 100%)" }} />
        <div className="dark:absolute dark:inset-0"
          style={{ background: "linear-gradient(135deg, #150B28 0%, #20101C 50%, #0E1430 100%)" }} />

        {/* Decorative circles */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(196,170,238,0.2)" }} />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(148,170,238,0.12)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #C4AAEE, transparent 60%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-6">🛕</div>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              Register Your Temple
            </h2>
            <div className="h-0.5 w-16 rounded-full mx-auto mb-5"
              style={{ background: "linear-gradient(90deg, #EC9DD4, #C4AAEE, #94AAEE)" }} />
            <p className="font-sanskrit text-muted-foreground text-lg mb-4">
              यदि आपके पास एक पवित्र स्थान है, तो इसे लाखों भक्तों तक पहुँचाएं
            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Join temples on ePoojapaath. Reach thousands of devotees across India, manage puja bookings,
              accept chadawa offerings, and grow your temple&apos;s divine community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsOpen(true)}
                className="btn-saffron text-base px-10 py-4 font-semibold rounded-full hover:scale-[1.02] transition-transform duration-200"
              >
                Register Temple for Free
              </button>
              <Link href="/about" className="btn-outline-lotus text-base px-10 py-4 flex items-center justify-center">
                Learn More
              </Link>
            </div>

            <p className="text-muted-foreground/60 text-sm mt-6 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">📞 +91 91650 57755</span>
              <span>•</span>
              <span className="flex items-center gap-1">📧 support@epoojapaath.com</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-card border border-saffron/20 max-w-lg w-full rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🛕</div>
                <h3 className="font-heading text-2xl text-foreground">Request Temple Listing</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Fill in the details below. Our team will verify and contact you to onboard your temple.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Temple Name"
                  name="templeName"
                  value={formData.templeName}
                  onChange={handleInputChange}
                  placeholder="E.g., Shri Siddhivinayak Temple"
                  required
                />

                <Input
                  label="Presiding Deity (Optional)"
                  name="deity"
                  value={formData.deity}
                  onChange={handleInputChange}
                  placeholder="E.g., Lord Ganesha, Lord Shiva"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="E.g., Mumbai"
                    required
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="E.g., Maharashtra"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Person Name"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="E.g., Ramesh Sharma"
                    required
                  />
                  <Input
                    label="WhatsApp / Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="E.g., 9876543210"
                    required
                  />
                </div>

                <Input
                  label="Email Address (Optional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="E.g., contact@temple.com"
                />

                <Textarea
                  label="Additional Message / Notes (Optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Tell us about special pujas, history, or timing details..."
                  rows={3}
                />

                <div className="pt-2">
                  <Button type="submit" loading={submitting} fullWidth>
                    {submitting ? "Submitting Request..." : "Submit Listing Request 🙏"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
