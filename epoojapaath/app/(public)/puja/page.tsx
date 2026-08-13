export const dynamic = "force-dynamic";

import Link from "next/link";
import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { PujaCard } from "@/components/temple/PujaCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Temple from "@/models/Temple";
import { serialize } from "@/lib/utils";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";

async function getPujas(search?: string, templeSlug?: string, ids?: string) {
  await connectDB();
  const query: Record<string, any> = { isActive: true };
  if (ids) {
    const idsArray = ids.split(",").map(id => id.trim()).filter(Boolean);
    if (idsArray.length > 0) {
      query._id = { $in: idsArray };
    }
  }
  if (templeSlug) {
    const templeObj = await Temple.findOne({ slug: templeSlug }).select("_id").lean() as { _id: any } | null;
    if (templeObj) {
      query.temple = templeObj._id;
    }
  }
  if (search) {
    query.name = new RegExp(search, "i");
  }
  return Puja.find(query).populate("temple", "name slug coverImage").sort({ totalBooked: -1 }).lean();
}

interface PageProps {
  searchParams: { q?: string; temple?: string; ids?: string };
}

export default async function PujaPage({ searchParams }: PageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pujas = serialize(await getPujas(searchParams.q, searchParams.temple, searchParams.ids).catch(() => [])) as any[];

  let filteredTempleName = "";
  if (searchParams.temple) {
    const templeObj = await Temple.findOne({ slug: searchParams.temple }).select("name").lean() as { name: string } | null;
    if (templeObj) {
      filteredTempleName = templeObj.name;
    }
  }

  return (
    <PublicPage>
      <WhatsAppWidget />
      <PageHero
        sanskrit="पूजा सेवाएँ"
        title="Book a Puja"
        subtitle="Sacred rituals performed by learned pandits at verified temples across India."
        className="pt-16 pb-10"
      />
      <section className="py-5 bg-card-bg border-b border-deep-gold/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <form method="GET" className="flex gap-3 max-w-lg">
            <Input name="q" defaultValue={searchParams.q} placeholder="Search pujas (e.g. Rudrabhishek)..." className="py-2 text-sm" />
            {searchParams.temple && <input type="hidden" name="temple" value={searchParams.temple} />}
            <Button type="submit" size="sm">Search</Button>
          </form>
        </div>
      </section>

      {filteredTempleName && (
        <div className="bg-saffron/10 border-b border-saffron/20 py-3">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
            <p className="text-saffron text-sm font-medium">
              Showing pujas for <span className="font-semibold">{filteredTempleName}</span>
            </p>
            <Link href="/puja" className="text-xs text-muted-foreground hover:text-foreground underline">
              Show all pujas
            </Link>
          </div>
        </div>
      )}

      <MandalaDivider className="!py-1" />
      <section className="pt-4 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {pujas.length === 0 ? (
          <EmptyState icon="📿" title="No pujas found" description="Try a different search term." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pujas.map((p) => <PujaCard key={p._id.toString()} puja={p} />)}
          </div>
        )}
      </section>
    </PublicPage>
  );
}

