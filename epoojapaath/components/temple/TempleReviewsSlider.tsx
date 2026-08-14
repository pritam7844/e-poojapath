"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  _id: string;
  reviewerName?: string;
  booking?: { devoteeName?: string };
  user?: { name?: string };
  city?: string;
  rating: number;
  comment: string;
}

interface TempleReviewsSliderProps {
  reviews: Review[];
}

export function TempleReviewsSlider({ reviews }: TempleReviewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <div className="w-full">
      <div className="relative w-full">
        {reviews.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev <= 0 ? reviews.length - 1 : prev - 1))}
              className="absolute -left-2.5 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-border/80 text-foreground shadow-md flex items-center justify-center hover:bg-saffron hover:text-white transition"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1))}
              className="absolute -right-2.5 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-border/80 text-foreground shadow-md flex items-center justify-center hover:bg-saffron hover:text-white transition"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <div className="overflow-hidden w-full rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((r) => (
              <div key={r._id.toString()} className="w-full shrink-0 select-none">
                <div className="card-devotional w-full min-h-[140px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center text-saffron font-bold text-sm">
                        {(r.reviewerName?.[0] || r.booking?.devoteeName?.[0] || r.user?.name?.[0] || "D").toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm flex items-center gap-1.5">
                          <span>{r.reviewerName || r.booking?.devoteeName || r.user?.name || "Devotee"}</span>
                          {r.city && <span className="text-xs text-muted-foreground font-normal">({r.city})</span>}
                        </p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star 
                              key={j} 
                              size={12} 
                              className={j < r.rating ? "fill-saffron text-saffron" : "fill-muted text-muted"} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">&ldquo;{r.comment}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Dots indicators */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {reviews.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-saffron w-6' : 'bg-muted/65 hover:bg-muted'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
