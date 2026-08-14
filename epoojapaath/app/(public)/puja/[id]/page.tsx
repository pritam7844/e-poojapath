export const revalidate = 300;

import Image from "next/image";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock } from "lucide-react";
import { PublicPage } from "@/components/shared/PublicPage";
import { PujaDetailClient } from "@/components/puja/PujaDetailClient";
import { PujaCountdownTimer } from "@/components/puja/PujaCountdownTimer";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import Booking from "@/models/Booking";
import { auth } from "@/lib/auth";
import type { IPuja, ITemple, IChadawa } from "@/types";
import { serialize } from "@/lib/utils";
import Link from "next/link";

type PujaWithTemple = IPuja & { _id: string; temple: ITemple & { _id: string } };
type ChadawaItem = IChadawa & { _id: string };

const getPujaDetail = cache(async (id: string): Promise<PujaWithTemple | null> => {
  await connectDB();
  const puja = await Puja.findById(id)
    .populate("temple", "name slug coverImage description location rating reviewCount timings images")
    .lean();
  return puja as unknown as PujaWithTemple | null;
});

export async function generateStaticParams() {
  await connectDB();
  const pujas = await Puja.find({ isActive: true }).select("_id").lean();
  return pujas.map((p) => ({ id: (p._id as { toString(): string }).toString() }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const puja = await getPujaDetail(params.id).catch(() => null);
  if (!puja) return { title: "Puja Not Found" };
  const templeName = typeof puja.temple === "object" ? puja.temple.name : "";
  const title = templeName ? `${puja.name} at ${templeName}` : puja.name;
  const description =
    puja.description?.slice(0, 160) ||
    `Book ${puja.name} online with ePoojapaath — authentic Vedic rituals performed by verified temple priests.`;
  return {
    title,
    description,
    openGraph: { title, description, images: puja.image ? [{ url: puja.image }] : undefined },
  };
}

async function getTempleChadawa(templeId: string, allowedChadawaIds?: string[]): Promise<ChadawaItem[]> {
  await connectDB();
  const query: any = { temple: templeId, isActive: true, isSpecial: false };
  if (allowedChadawaIds && allowedChadawaIds.length > 0) {
    query._id = { $in: allowedChadawaIds };
  }
  const items = await Chadawa.find(query).limit(12).lean();
  return items as unknown as ChadawaItem[];
}

const DEFAULT_FAQS = [
  {
    question: "Why choose us for online Puja booking?",
    answer: "We are a trusted platform enabling devotees to book pujas at ancient temples across India. Our experienced pandits perform every puja in Shubh Muhurat with full Vedic rituals.",
  },
  {
    question: "Will I receive a recording of the Puja?",
    answer: "Yes! After the puja, a recorded video is provided. Post-puja, bhakti box and aarti-prasad are delivered to the devotee's doorstep.",
  },
  {
    question: "What should I do if I don't know my Gotra?",
    answer: "If you know your Gotra, please provide it during booking. If you don't know your Gotra, you can leave the field blank. Our priest will guide you according to the customary Sankalp practice.",
  },
  {
    question: "What should I do on the day of the Puja?",
    answer: "Observe a simple fast, think of your deity, and watch the puja live if possible. Your presence in intention is what matters.",
  },
  {
    question: "Can I book the puja if I cannot personally visit the temple?",
    answer: "Yes. ePoojapaath enables devotees to submit their Sankalp remotely while the puja is performed at the temple by the participating priest.",
  },
];

export default async function PujaDetailPage({ params }: { params: { id: string } }) {
  const pujaRaw = await getPujaDetail(params.id).catch(() => null);
  if (!pujaRaw) notFound();
  const puja = serialize(pujaRaw);

  const temple = puja.temple;
  const chadawaItems = serialize(await getTempleChadawa(temple._id, puja.chadawas).catch(() => []));
  const faqs = puja.faqs && puja.faqs.length > 0 ? puja.faqs : DEFAULT_FAQS;

  const displayRating = puja.rating > 0 ? puja.rating : temple.rating > 0 ? temple.rating : 4.5;
  const displayReviews = puja.reviewCount > 0 ? puja.reviewCount : temple.reviewCount > 0 ? temple.reviewCount : 120;

  // Active booking check
  const session = await auth();
  let hasActiveBooking = false;
  let activeBookingId = "";

  if (session?.user) {
    await connectDB();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const activeBooking = await Booking.findOne({
      user: session.user.id,
      service: params.id,
      paymentStatus: "paid",
      date: { $gte: today }
    })
      .select("_id")
      .lean();

    if (activeBooking) {
      hasActiveBooking = true;
      activeBookingId = (activeBooking as any)._id.toString();
    }
  }

  return (
    <PublicPage>
      <PujaDetailClient
        puja={puja as unknown as IPuja & { _id: string }}
        temple={temple as unknown as ITemple & { _id: string }}
        chadawaItems={chadawaItems as unknown as ChadawaItem[]}
        faqs={faqs}
        displayRating={displayRating}
        displayReviews={displayReviews}
        hasActiveBooking={hasActiveBooking}
        activeBookingId={activeBookingId}
      />
    </PublicPage>
  );
}
