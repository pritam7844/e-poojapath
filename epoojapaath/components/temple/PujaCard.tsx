"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Bookmark } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import type { IPuja, ITemple } from "@/types";

type PujaWithTemple = Omit<IPuja, "temple"> & { _id: string; temple: Partial<ITemple> & { _id: string } };

export function PujaCard({ puja }: { puja: PujaWithTemple }) {
  const { lang, t } = useLang();
  const name = lang === "hi" && puja.nameHi ? puja.nameHi : puja.name;
  const desc = lang === "hi" && puja.descriptionHi ? puja.descriptionHi : puja.description;
  const truncatedDesc = desc && desc.length > 80 ? desc.substring(0, 80) + "..." : desc;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-devotional overflow-hidden group p-2 min-[360px]:p-2.5 md:p-4 flex flex-col justify-between h-full w-full"
    >
      <div className="flex flex-col flex-1">
        <div className="relative h-20 min-[360px]:h-24 md:h-32 -mx-2 -mt-2 min-[360px]:-mx-2.5 min-[360px]:-mt-2.5 md:-mx-4 md:-mt-4 mb-2 md:mb-3 overflow-hidden">
          <Image
            src={puja.image || "/placeholder-puja.jpg"}
            alt={puja.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
          <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-deep-gold/90 text-white text-[7px] min-[360px]:text-[8px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full font-medium">
            🛕 {typeof puja.temple === "object" ? puja.temple.name : "Temple"}
          </div>
          {puja.isSubscription && (
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-red-700 border border-yellow-500 text-white text-[6px] min-[360px]:text-[8px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse shadow-md">
              Subscription
            </div>
          )}
        </div>
 
        <h3 className="font-heading text-foreground text-[10px] min-[360px]:text-xs md:text-base mb-0.5 line-clamp-1 md:line-clamp-2 leading-tight">{name}</h3>
        <p className="font-sanskrit text-saffron text-[8px] min-[360px]:text-[9px] md:text-xs mb-1 md:mb-2 line-clamp-1 md:line-clamp-none">{puja.nameHi}</p>
        <p className="hidden text-muted-foreground text-xs md:text-sm mb-3">{truncatedDesc}</p>
 
        <div className="hidden items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock size={12} /> {puja.duration}</span>
          <span className="flex items-center gap-1"><Bookmark size={12} /> {puja.totalBooked}+ booked</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 md:mt-0 pt-1 md:pt-0">
        <span className="font-heading text-[10px] min-[360px]:text-xs md:text-2xl text-saffron">{formatCurrency(puja.price)}</span>
        <Link
          href={`/puja/${puja._id}`}
          className="btn-saffron text-[7.5px] min-[360px]:text-[9px] md:text-sm py-1 px-1.5 md:py-2 md:px-5 whitespace-nowrap flex items-center justify-center"
        >
          <span>{t ? t("Book Now", "बुक करें") : "Book Now"}</span>
          <span className="hidden md:inline ml-1">🪔</span>
        </Link>
      </div>
    </motion.div>
  );
}
