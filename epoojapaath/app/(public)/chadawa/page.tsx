export const revalidate = 60;

import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { connectDB } from "@/lib/db";
import Chadawa from "@/models/Chadawa";
import { serialize } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { SpecialChadawaList } from "@/components/shared/SpecialChadawaList";

async function getSpecialChadawa() {
  await connectDB();
  return Chadawa.find({ isActive: true, isSpecial: true })
    .populate("temple", "name slug coverImage location shortDescription description")
    .lean();
}

export default async function ChadawaPage() {
  const specialRaw = await getSpecialChadawa().catch(() => []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specialItems = serialize(specialRaw) as any[];

  // Group special chadawa by temple
  const groupsMap = specialItems.reduce((acc: Record<string, any>, item) => {
    const templeObj = typeof item.temple === "object" ? item.temple : null;
    const tId = templeObj ? templeObj._id?.toString() : item.temple;
    const tName = templeObj ? templeObj.name : "Temple";
    const tSlug = templeObj ? templeObj.slug : "";
    const tCover = templeObj?.coverImage || "";
    const tLoc = templeObj?.location || null;
    const tDesc = templeObj?.shortDescription || templeObj?.description || "";
    
    if (!acc[tId]) {
      acc[tId] = { 
        templeId: tId,
        templeName: tName, 
        templeSlug: tSlug, 
        templeCoverImage: tCover,
        templeLocation: tLoc,
        templeDescription: tDesc,
        items: [] 
      };
    }
    acc[tId].items.push(item);
    return acc;
  }, {});

  const groups = Object.values(groupsMap);

  return (
    <PublicPage>
      <PageHero
        sanskrit="देवताओं को अर्पण"
        title="Chadawa Offerings"
        subtitle="Offer sacred items to your chosen deity — presented by temple pandits on your behalf. Book special chadawa independently."
      />
      <MandalaDivider className="!py-1" />

      {/* ── Special Chadawa Section ── */}
      {groups.length > 0 ? (
        <section className="pt-4 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron/10 to-purple-500/10 border border-saffron/30 rounded-full px-5 py-2 mb-4">
              <Sparkles size={16} className="text-saffron" />
              <span className="text-sm font-semibold text-saffron tracking-wide uppercase">Special Chadawa</span>
              <Sparkles size={16} className="text-saffron" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
              Special Chadawa Offerings
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              Book these special sacred offerings independently — no puja booking required. Choose a temple below to view and select offerings.
            </p>
          </div>

          <SpecialChadawaList groups={groups as any} />
        </section>
      ) : (
        <section className="section-padding max-w-7xl mx-auto py-16">
          <EmptyState icon="🌸" title="No offerings available" description="Check back soon for special chadawa offerings." />
        </section>
      )}
    </PublicPage>
  );
}

