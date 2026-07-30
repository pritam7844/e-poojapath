"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export function TrustedBanner() {
  const { t } = useLang();
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number>(4.8);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          if (resData.data && resData.data.length > 0) {
            setReviews(resData.data);
          }
          if (resData.totalReviews !== undefined) {
            setTotalReviews(resData.totalReviews);
          }
          if (resData.averageRating !== undefined) {
            setAvgRating(resData.averageRating);
          }
        }
      })
      .catch((err) => console.error("Error loading testimonials in TrustedBanner:", err));
  }, []);

  // Auto-rotate the testimonial quote in the banner every 7 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
    }, 7000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80",
  ];

  const currentReview = reviews.length > 0 ? reviews[currentIndex] : null;
  const quoteText = currentReview 
    ? currentReview.comment 
    : t("Truly divine experience.", "वास्तव में दिव्य अनुभव।");
  const quoteAuthor = currentReview
    ? (currentReview.reviewerName || currentReview.booking?.devoteeName || currentReview.user?.name || "Devotee")
    : t("Neha Sharma", "नेहा शर्मा");

  return (
    <section className="py-6 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto bg-[#FFF9F2] border border-[#FBE9E7] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section - Avatars & Rating */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3 overflow-hidden">
            {avatars.map((url, idx) => (
              <div key={idx} className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={url}
                  alt={`Devotee ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-0.5 text-yellow-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(avgRating) ? "currentColor" : "none"}
                  stroke={i < Math.round(avgRating) ? "none" : "currentColor"}
                />
              ))}
            </div>
            <h4 className="text-sm font-bold text-gray-800">
              {t(
                `${500 + totalReviews}+ Devotees Trusted`,
                `${500 + totalReviews}+ श्रद्धालुओं द्वारा विश्वसनीय`
              )}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              {t(
                `${avgRating}/5 Devotee Rating`,
                `${avgRating}/5 श्रद्धालु रेटिंग`
              )}
            </p>
          </div>
        </div>

        {/* Divider (only visible on md screens and up) */}
        <div className="hidden md:block w-px h-12 bg-gray-200" />

        {/* Right Section - Quote */}
        <div className="text-center md:text-right min-w-[200px] max-w-md">
          <p className="text-gray-700 italic text-sm md:text-base font-medium transition-all duration-500">
            &ldquo;{quoteText}&rdquo;
          </p>
          <span className="text-xs text-gray-500 font-semibold block mt-1">
            — {quoteAuthor}
          </span>
        </div>
      </div>
    </section>
  );
}
