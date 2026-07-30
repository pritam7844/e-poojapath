export const revalidate = 300;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Chadawa from "@/models/Chadawa";
import { serialize } from "@/lib/utils";

interface SpecialChadawaItem {
  _id: string;
  name: string;
  nameHi?: string;
  description: string;
  image?: string;
  price: number;
  items?: string[];
}

export async function generateStaticParams() {
  await connectDB();
  const temples = await Temple.find({ status: "approved" }).select("slug").lean();
  return temples.map((t) => ({ slug: t.slug as string }));
}

export default async function TempleSpecialChadawaPage({ params }: { params: { slug: string } }) {
  await connectDB();

  // Find the temple by slug
  const templeRaw = await Temple.findOne({ slug: params.slug }).lean();
  if (!templeRaw || Array.isArray(templeRaw)) notFound();
  
  // Find all active special offerings for this temple
  const itemsRaw = await Chadawa.find({
    temple: templeRaw._id,
    isActive: true,
    isSpecial: true,
  }).lean();

  const temple = serialize(templeRaw);
  const items = serialize(itemsRaw) as unknown as SpecialChadawaItem[];

  return (
    <PublicPage>
      <PageHero
        sanskrit="विशेष समर्पणम्"
        title={`${temple.name} — Special Offerings`}
        subtitle={`Select from the special sacred offerings performed at ${temple.name}, ${temple.location?.city || ""}.`}
        className="pt-16 pb-10"
      />
      <MandalaDivider className="!py-1" />

      {items.length > 0 ? (
        <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="card-devotional group overflow-hidden p-0 flex flex-col h-full hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-deep-gold/15"
              >
                {/* Offering Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder-puja.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Special badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-saffron to-deep-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      ✨ Special Offering
                    </span>
                  </div>
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-heading text-lg leading-tight line-clamp-2 drop-shadow-md">
                      {item.name}
                    </h3>
                    {item.nameHi && (
                      <p className="text-white/80 font-sanskrit text-sm mt-0.5 drop-shadow-sm">
                        {item.nameHi}
                      </p>
                    )}
                  </div>
                </div>

                {/* Offering Content */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {item.description}
                  </p>
                  
                  {item.items && item.items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.items.slice(0, 4).map((incl) => (
                        <span
                          key={incl}
                          className="bg-saffron/10 text-saffron text-xs px-2.5 py-1 rounded-full border border-saffron/15"
                        >
                          {incl}
                        </span>
                      ))}
                      {item.items.length > 4 && (
                        <span className="text-xs text-muted-foreground self-center">
                          +{item.items.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                    <div>
                      <p className="font-heading text-2xl text-saffron font-bold">₹{item.price}</p>
                      <p className="text-xs text-muted-foreground">Sacred Offering</p>
                    </div>
                    <Link
                      href={`/chadawa/${item._id}`}
                      className="bg-gradient-to-r from-saffron to-deep-gold text-white text-sm font-semibold py-2.5 px-6 rounded-full hover:opacity-95 active:scale-95 transition shadow-md"
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto py-20 px-4">
          <EmptyState
            icon="🌸"
            title="No special offerings"
            description="There are currently no special offerings listed for this temple. Check back later."
          />
        </section>
      )}
    </PublicPage>
  );
}
