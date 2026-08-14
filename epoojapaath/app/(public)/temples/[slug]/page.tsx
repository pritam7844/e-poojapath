export const revalidate = 300;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublicPage } from "@/components/shared/PublicPage";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { getTempleBySlug, getApprovedTemples } from "@/services/temple.service";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import Review from "@/models/Review";
import { formatCurrency, serialize } from "@/lib/utils";
import { MapPin, Phone, Mail, Globe, Clock, Star, Instagram } from "lucide-react";
import { TempleImageSlider } from "@/components/temple/TempleImageSlider";
import { TempleReviewsSlider } from "@/components/temple/TempleReviewsSlider";
import { TempleChadawaSection } from "@/components/temple/TempleChadawaSection";

export async function generateStaticParams() {
  const temples = await getApprovedTemples().catch(() => []);
  return (temples as { slug: string }[]).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const temple = serialize(await getTempleBySlug(params.slug).catch(() => null)) as any;
  if (!temple) return { title: "Temple Not Found" };
  return { title: `${temple.name} | ePoojapaath`, description: temple.shortDescription };
}

export default async function TempleDetailPage({ params }: { params: { slug: string } }) {
  const templeRaw = await getTempleBySlug(params.slug).catch(() => null);
  if (!templeRaw) notFound();
  const temple = serialize(templeRaw) as any;

  await connectDB();
  const [pujasRaw, chadawaItemsRaw, reviewsRaw] = await Promise.all([
    Puja.find({ temple: temple._id, isActive: true }).lean(),
    Chadawa.find({ temple: temple._id, isActive: true, isSpecial: true }).lean(),
    Review.find({ temple: temple._id }).populate("user", "name").populate("booking", "devoteeName").sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  const pujas = serialize(pujasRaw);
  const chadawaItems = serialize(chadawaItemsRaw);
  const reviews = serialize(reviewsRaw);

  const sliderImages = [temple.coverImage, ...(temple.images || [])].filter(Boolean);

  return (
    <PublicPage showAIChat>
      {/* Hero Slider */}
      <TempleImageSlider images={sliderImages}>
        <div className="w-full pb-6 pt-24 px-6 md:px-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col md:flex-row md:items-end md:justify-between gap-4 z-10">
          <div>
            <p className="font-sanskrit text-amber-300 font-bold tracking-wider text-xs md:text-sm drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.7)]">{temple.deity}</p>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{temple.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/90 font-medium text-xs md:text-sm mt-2.5 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.7)]">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-amber-400" />
                <span>{temple.location.city}, {temple.location.state}</span>
              </span>
              {temple.rating > 0 && (
                <span className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-0.5 text-[11px] md:text-xs">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-amber-300">{temple.rating.toFixed(1)}</span>
                  <span className="text-white/70">({temple.reviewCount} reviews)</span>
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <Link
              href={pujas.length > 0 ? "#pujas-section" : `/puja?temple=${temple.slug}`}
              className="btn-saffron text-sm md:text-base py-2.5 px-6 shadow-lg inline-flex items-center gap-2 font-semibold hover:scale-105 transition-all"
            >
              <span>Book a Puja 🪔</span>
            </Link>
          </div>
        </div>
      </TempleImageSlider>

        <MandalaDivider />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <section className="card-devotional">
                <h2 className="font-heading text-2xl text-foreground mb-4">About This Temple</h2>
                <div className="mb-6">
                  {temple.description && (
                    temple.description.startsWith("<") || /<[a-z][\s\S]*>/i.test(temple.description) ? (
                      <div 
                        className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-body prose-headings:font-semibold prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5" 
                        dangerouslySetInnerHTML={{ __html: temple.description }} 
                      />
                    ) : (
                      renderDescription(temple.description)
                    )
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-foreground">Deity:</span> <span className="text-muted-foreground">{temple.deity}</span></div>
                  <div><span className="font-medium text-foreground">Established:</span> <span className="text-muted-foreground">{temple.established || "Ancient"}</span></div>
                  <div className="col-span-2"><span className="font-medium text-foreground">Timings:</span> <span className="text-muted-foreground">{temple.timings}</span></div>
                  <div className="col-span-2"><span className="font-medium text-foreground">Address:</span> <span className="text-muted-foreground">{temple.location.address}, {temple.location.city}, {temple.location.state} – {temple.location.pincode}</span></div>
                </div>
                {temple.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {temple.tags.map((tag: string) => (
                      <span key={tag} className="bg-saffron/10 text-saffron text-xs px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </section>

              {/* Pujas */}
              {pujas.length > 0 && (
                <section id="pujas-section">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Available Pujas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {pujas.map((puja: any) => (
                      <div key={puja._id.toString()} className="card-devotional flex gap-4 items-start">
                        {puja.image && (
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                            <Image src={puja.image} alt={puja.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                          <div>
                            <div className="text-xs text-saffron font-semibold mb-1 flex items-center gap-1">
                              🛕 {temple.name}
                            </div>
                            <h3 className="font-heading text-base sm:text-lg text-foreground line-clamp-1">{puja.name}</h3>
                            {puja.nameHi && <p className="font-sanskrit text-saffron text-xs mb-1.5">{puja.nameHi}</p>}
                            <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{puja.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-1">
                            <span className="font-heading text-lg sm:text-xl text-saffron">{formatCurrency(puja.price)}</span>
                            <Link href={`/temples/${temple.slug}/puja/${puja._id}`} className="btn-saffron text-xs sm:text-sm py-1.5 px-4">Book 🪔</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Chadawa */}
              <TempleChadawaSection chadawaItems={chadawaItems as any[]} templeName={temple.name} />

              {/* Reviews */}
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-6">Devotee Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review! 🙏</p>
                ) : (
                  <TempleReviewsSlider reviews={reviews as any[]} />
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card-devotional bg-gradient-to-br from-saffron/10 to-amber-500/10 border border-saffron/30 shadow-md">
                <h3 className="font-heading text-lg text-foreground mb-2 flex items-center gap-2">
                  🪔 Online Puja Booking
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Book sacred Vedic rituals and pujas performed by experienced pandits in your name at verified temples.
                </p>
                <Link
                  href={pujas.length > 0 ? "#pujas-section" : `/puja?temple=${temple.slug}`}
                  className="btn-saffron w-full text-center block text-sm font-semibold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Book a Puja Now 🎴
                </Link>
              </div>

              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-4">Contact Temple</h3>
                <ul className="space-y-3">
                  {temple.instagramUrl && (
                    <li className="flex items-center gap-3 text-sm">
                      <Instagram size={15} className="text-saffron shrink-0" />
                      <a href={temple.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-saffron hover:underline">Instagram</a>
                    </li>
                  )}
                  {temple.website && (
                    <li className="flex items-center gap-3 text-sm">
                      <Globe size={15} className="text-saffron shrink-0" />
                      <a href={temple.website} target="_blank" rel="noopener noreferrer" className="text-saffron hover:underline">Website</a>
                    </li>
                  )}
                  <li className="flex items-start gap-3 text-sm">
                    <Clock size={15} className="text-saffron shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{temple.timings}</span>
                  </li>
                </ul>
              </div>

              {/* Live Interactive Map */}
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-3">Location</h3>
                <div className="h-44 w-full rounded-xl overflow-hidden border border-deep-gold/20 mb-3 relative bg-muted/20">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${temple.name}, ${temple.location.address}, ${temple.location.city}, ${temple.location.state}`
                    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                {temple.googleMapsUrl && (
                  <a href={temple.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                    className="text-saffron text-sm hover:underline block text-center">
                    View on Google Maps →
                  </a>
                )}
              </div>

              {/* Share */}
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-3">Share Temple</h3>
                <div className="flex gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${temple.name} on ePoojapaath: ` + (process.env.NEXT_PUBLIC_APP_URL ?? "https://e-poojapath.vercel.app") + "/temples/" + temple.slug)}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.58 1.978 14.108.954 11.998.954 6.56.954 2.136 5.325 2.132 10.756c-.001 1.637.45 3.238 1.309 4.63l-.995 3.635 3.731-.977zm11.368-6.19c-.3-.149-1.772-.874-2.046-.974-.275-.1-.475-.149-.675.15-.2.299-.775.974-.95 1.173-.175.2-.35.225-.65.075-.3-.15-1.265-.466-2.41-1.488-.89-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.462.13-.611.135-.133.3-.349.45-.524.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.625-.925-2.225-.244-.589-.492-.51-.675-.518-.174-.007-.374-.009-.574-.009-.2 0-.525.075-.8.375-.276.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.116 4.52.716.31 1.274.495 1.71.634.72.228 1.375.196 1.893.118.577-.087 1.772-.724 2.022-1.424.25-.7.25-1.299.175-1.424-.075-.125-.275-.199-.575-.349z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL ?? "https://e-poojapath.vercel.app") + "/temples/" + temple.slug)}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </PublicPage>
  );
}

function renderDescription(description: string) {
  if (!description) return null;

  const lines = description.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const renderInlineText = (text: string) => {
    // Matches **bold text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 space-y-1 mb-4 text-muted-foreground text-sm">
          {...currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Check if it's a bullet point (starts with •, *, ⦁, or -)
    if (/^[•*⦁-]\s*/.test(trimmed)) {
      const cleanLine = trimmed.replace(/^[•*⦁-]\s*/, '');
      currentList.push(<li key={`li-${index}`}>{renderInlineText(cleanLine)}</li>);
      return;
    }

    // Since this line is not a bullet, flush any existing list items
    flushList(index);

    // Check if it's a markdown heading
    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h4 key={`h4-${index}`} className="font-body text-sm text-foreground font-semibold mt-4 mb-1">
          {renderInlineText(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h3 key={`h3-${index}`} className="font-body text-base text-foreground font-semibold mt-5 mb-2">
          {renderInlineText(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Auto-detect headings: if it's short, doesn't end with sentence ending punctuation,
    // and matches common heading words.
    const isHeading = 
      trimmed.length < 65 && 
      !/[.,;.?!]/.test(trimmed.slice(-1)) &&
      (trimmed.includes("History") || 
       trimmed.includes("Significance") || 
       trimmed.includes("Why") || 
       trimmed.includes("Timings") || 
       trimmed.includes("Ritual") || 
       trimmed.includes("Offerings") ||
       trimmed.includes("Schedule") ||
       trimmed.startsWith("Experience"));

    if (isHeading) {
      renderedElements.push(
        <h3 key={`h3-auto-${index}`} className="font-body text-base text-foreground font-semibold mt-4 mb-1.5">
          {renderInlineText(trimmed)}
        </h3>
      );
      return;
    }

    // Default paragraph
    renderedElements.push(
      <p key={`p-${index}`} className="text-muted-foreground text-sm leading-relaxed mb-3">
        {renderInlineText(trimmed)}
      </p>
    );
  });

  // Flush any final list
  flushList(lines.length);

  return renderedElements;
}

