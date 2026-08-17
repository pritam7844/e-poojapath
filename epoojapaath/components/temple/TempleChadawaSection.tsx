"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ChadawaItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface TempleChadawaSectionProps {
  chadawaItems: ChadawaItem[];
  templeName: string;
}

export function TempleChadawaSection({ chadawaItems, templeName }: TempleChadawaSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (!chadawaItems || chadawaItems.length === 0) return null;

  const displayedItems = showAll ? chadawaItems : chadawaItems.slice(0, 3);
  const hasMore = chadawaItems.length > 3;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg sm:text-2xl text-foreground font-bold">
          Chadawa Offerings ({chadawaItems.length})
        </h2>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs sm:text-sm font-semibold text-saffron hover:underline flex items-center gap-1 transition-all"
          >
            {showAll ? "Show Less" : `See More (${chadawaItems.length - 3} More)`}
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* 3 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {displayedItems.map((item) => (
          <div
            key={item._id}
            className="card-devotional flex flex-col justify-between p-1.5 sm:p-4 hover:shadow-md transition-all duration-200 border border-border/60"
          >
            <div>
              {item.image && (
                <div className="relative w-full aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-muted mb-1 sm:mb-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 33vw, 25vw"
                  />
                </div>
              )}
              <div className="text-[9px] sm:text-xs text-saffron font-semibold mb-0.5 truncate flex items-center gap-0.5">
                🛕 {templeName}
              </div>
              <h3 className="font-heading text-[10px] sm:text-sm md:text-base text-foreground font-bold line-clamp-1 mb-0.5">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-[9px] sm:text-xs mb-2 line-clamp-1 sm:line-clamp-2 leading-tight hidden sm:block">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1 sm:gap-2 pt-1 sm:pt-2 border-t border-border/40">
              <span className="font-heading text-xs sm:text-lg text-saffron font-bold">
                {formatCurrency(item.price)}
              </span>
              <Link
                href={`/chadawa/${item._id}`}
                className="btn-outline-gold text-[10px] sm:text-xs py-0.5 sm:py-1.5 px-1.5 sm:px-3 text-center rounded-md sm:rounded-lg font-medium"
              >
                Offer 🌸
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom See More / Show Less Button */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-saffron/30 bg-saffron/5 text-saffron font-bold text-xs sm:text-sm hover:bg-saffron/10 transition-all shadow-sm"
          >
            <span>{showAll ? "Show Less Offerings" : `See More (${chadawaItems.length - 3} Offerings)`}</span>
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </section>
  );
}
