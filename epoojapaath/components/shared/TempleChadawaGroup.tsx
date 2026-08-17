"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SpecialChadawaItem {
  _id: string;
  name: string;
  nameHi?: string;
  description: string;
  image?: string;
  price: number;
  items?: string[];
  temple: string | { _id: string; name: string; slug: string };
}

interface TempleChadawaGroupProps {
  templeName: string;
  templeSlug: string;
  items: SpecialChadawaItem[];
}

export function TempleChadawaGroup({ templeName, templeSlug, items }: TempleChadawaGroupProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <div className="mb-10">
      {/* Group Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-saffron to-deep-gold flex items-center justify-center text-white text-base md:text-lg flex-shrink-0">
          🛕
        </div>
        <div>
          <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">{templeName}</h3>
          <p className="text-[11px] md:text-xs text-muted-foreground">Special Chadawa</p>
        </div>
        {templeSlug && (
          <Link
            href={`/temples/${templeSlug}`}
            className="ml-auto text-xs text-saffron hover:underline font-medium"
          >
            View Temple →
          </Link>
        )}
      </div>

      {/* Grid of Cards: 3 on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
        {visibleItems.map((item) => (
          <SpecialChadawaCard key={item._id} item={item} />
        ))}
      </div>

      {/* See More / Show Less Toggle Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="group btn-outline-gold px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-all shadow-sm duration-300"
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                <span>See More ({items.length - 3} More)</span>
                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Special Chadawa Card ──────────────────────────────────────────────────────
function SpecialChadawaCard({ item }: { item: SpecialChadawaItem }) {
  return (
    <div className="card-devotional group overflow-hidden p-0 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border border-border/60">
      {/* Image */}
      <div className="relative h-20 md:h-44 overflow-hidden">
        <Image
          src={item.image || "/placeholder-puja.jpg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Special badge */}
        <div className="absolute top-2 left-2 hidden md:block">
          <span className="bg-gradient-to-r from-saffron to-deep-gold text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            ✨ Special
          </span>
        </div>
        <div className="absolute bottom-1.5 md:bottom-3 left-1.5 md:left-3 right-1.5 md:right-3">
          <p className="text-white font-heading text-[11px] md:text-base leading-tight line-clamp-1 md:line-clamp-2">{item.name}</p>
          {item.nameHi && <p className="text-white/70 font-sanskrit text-[9px] md:text-xs mt-0.5 hidden md:block">{item.nameHi}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="p-2 md:p-4 flex flex-col flex-1">
        <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed line-clamp-1 md:line-clamp-3 mb-2 md:mb-3 flex-1">
          {item.description}
        </p>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mt-auto pt-2 md:pt-3 border-t border-border gap-1">
          <div>
            <p className="font-heading text-xs md:text-xl font-bold text-saffron">₹{item.price}</p>
          </div>
          <Link
            href={`/chadawa/${item._id}`}
            className="bg-gradient-to-r from-saffron to-deep-gold text-white text-[10px] md:text-xs font-bold px-2.5 md:px-4 py-1 md:py-2 rounded-md md:rounded-full hover:opacity-90 transition shadow text-center"
          >
            Book Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
