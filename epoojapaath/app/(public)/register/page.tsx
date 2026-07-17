"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import * as fpixel from "@/lib/fpixel";

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fpixel.event("CompleteRegistration", { name: form.name, email: form.email });
        fpixel.event("Lead", { content_name: "User Signup Registration", email: form.email, name: form.name });
        devToast.blessing("Account created! 🙏 Jai Shri Ram");
        router.push("/login");
      } else devToast.error(data.error);
    } catch {
      devToast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #FFF0F8 50%, #F5F0FF 100%)" }}
    >
      {/* Lotus glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #EC9DD4, transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #94AAEE, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="card-devotional shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-2xl px-3 py-2 shadow-sm mb-4">
              <Image src="/epoojalogo.png" alt="ePoojapaath" width={80} height={80} className="object-contain h-16 w-auto" />
            </div>
            <h1 className="font-heading text-3xl text-foreground">Create Account</h1>
            <p className="font-sanskrit text-saffron text-sm mt-1">🌸 Begin your devotional journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" required placeholder="Ramesh Kumar"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email Address" type="email" required placeholder="your@email.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="WhatsApp Mobile Number" type="tel" required placeholder="10-digit mobile number"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Password" type="password" required placeholder="Min 8 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? "Creating Account... 🪔" : "Create Account 🛕"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-saffron font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
