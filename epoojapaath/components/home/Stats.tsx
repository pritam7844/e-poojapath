"use client";

import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Users, Landmark, Flame, ShieldCheck } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{count.toLocaleString("en-IN")}{suffix}</span>;
}

export function Stats() {
  const { t } = useLang();
  const [data, setData] = useState<Record<string, number>>({
    temples: 0,
    bookings: 0,
    cities: 0,
    devotees: 0,
  });

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  const stats = [
    { emoji: "🙏", value: <CountUp end={data.devotees || 0} suffix="+" />, label: t("Happy Devotees", "प्रसन्न श्रद्धालु") },
    { emoji: "🛕", value: <CountUp end={data.temples || 0} suffix="+" />, label: t("Sacred Temples", "पवित्र मंदिर") },
    { emoji: "🪔", value: <CountUp end={data.bookings || 0} suffix="+" />, label: t("Pujas Performed", "पूजाएँ संपन्न") },
    { emoji: "🛡️", value: "100%", label: t("Secure & Trusted", "सुरक्षित एवं विश्वसनीय") },
  ];
 
  return (
    <section className="py-6 bg-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
        {stats.map((stat, idx) => {
          return (
            <div key={idx} className="flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-3xl shadow-inner select-none mb-1">
                {stat.emoji}
              </div>
              <div className="font-heading text-xl md:text-2xl font-bold text-[#4A1A0C]">
                {stat.value}
              </div>
              <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
