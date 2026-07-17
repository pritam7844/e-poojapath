"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { Home } from "lucide-react";
import * as fpixel from "@/lib/fpixel";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "whatsapp">("email");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [otpSent,  setOtpSent]  = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error === "BLOCKED") {
        devToast.error("Your account has been blocked. Contact support@epoojapaath.com");
      } else if (result?.error) {
        devToast.error("Invalid email or password");
      } else {
        fpixel.event("Lead", { content_name: "Email Login", email: email });
        devToast.blessing("Welcome back! Jai Shri Ram 🙏");
        router.push("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      devToast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpLoading(true);
    setSimulatedOtp(null);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        if (data.simulated) {
          setSimulatedOtp(data.otp);
          devToast.blessing(`Verification code sent! Use OTP ${data.otp} (Simulated for testing)`);
        } else {
          devToast.blessing("Verification code sent via WhatsApp! 🌸");
        }
      } else {
        devToast.error(data.error || "Failed to send verification code");
      }
    } catch {
      devToast.error("Failed to send verification code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      devToast.error("Please enter a valid 6-digit verification code");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          otp: otp,
        }),
      });
      const guestData = await res.json();
      if (!guestData.success) {
        devToast.error(guestData.error || "Login failed");
        return;
      }

      const result = await signIn("credentials", {
        email: guestData.email,
        password: guestData.password,
        redirect: false,
      });

      if (result?.error === "BLOCKED") {
        devToast.error("Your account has been blocked. Contact support@epoojapaath.com");
      } else if (result?.error) {
        devToast.error("Authentication failed");
      } else {
        fpixel.event("Lead", { content_name: "WhatsApp OTP Login", phone: phone });
        devToast.blessing("Welcome back! Jai Shri Ram 🙏");
        router.push("/");
        router.refresh();
      }
    } catch {
      devToast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #FFF0F8 50%, #EEF2FF 100%)" }}
    >
      {/* Lotus glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #EC9DD4, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #94AAEE, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-start mb-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-saffron transition-colors">
            <Home size={15} />
            Back to Home
          </Link>
        </div>
        <div className="card-devotional shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-block bg-white rounded-2xl px-3 py-2 shadow-sm mb-4">
              <Image src="/epoojalogo.png" alt="ePoojapaath" width={80} height={80} className="object-contain h-16 w-auto" />
            </div>
            <h1 className="font-heading text-3xl text-foreground">Welcome Back</h1>
            <p className="font-sanskrit text-saffron text-sm mt-1">ॐ नमः शिवाय</p>
          </div>

          {/* Method Toggle */}
          <div className="flex rounded-xl bg-muted p-1 mb-6 border border-border">
            <button
              onClick={() => { setLoginMethod("email"); setOtpSent(false); }}
              className={`flex-1 text-xs font-semibold py-2.5 rounded-lg transition-all ${
                loginMethod === "email"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setLoginMethod("whatsapp")}
              className={`flex-1 text-xs font-semibold py-2.5 rounded-lg transition-all ${
                loginMethod === "whatsapp"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              WhatsApp Login
            </button>
          </div>

          {loginMethod === "email" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input label="Email Address" type="email" required placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Password" type="password" required placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" loading={loading} fullWidth size="lg">
                {loading ? "Signing in... 🪔" : "Sign In 🛕"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
               {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <Input
                    label="WhatsApp Mobile Number"
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Button type="submit" loading={otpLoading} fullWidth size="lg">
                    {otpLoading ? "Sending Code... ✉️" : "Send Verification Code 🌸"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {simulatedOtp && (
                    <div className="bg-saffron/10 border border-saffron/30 rounded-xl p-3 text-center mb-2">
                      <p className="text-xs text-saffron font-medium">
                        Simulated code: <span className="font-bold underline text-sm">{simulatedOtp}</span>
                      </p>
                    </div>
                  )}
                  <Input
                    label="Verification Code (OTP)"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button type="submit" loading={loading} fullWidth size="lg">
                    {loading ? "Verifying... 🪔" : "Verify & Sign In 🛕"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground text-center mt-2"
                  >
                    ← Change mobile number
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-muted-foreground text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-saffron font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
