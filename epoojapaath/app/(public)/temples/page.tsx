export const dynamic = "force-dynamic";

import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { TempleCard } from "@/components/temple/TempleCard";
import { TempleFilters } from "@/components/temple/TempleFilters";
import { getApprovedTemples } from "@/services/temple.service";
import { serialize } from "@/lib/utils";
import type { ITemple } from "@/types";

interface PageProps {
  searchParams: { city?: string; deity?: string };
}

export default async function TemplesPage({ searchParams }: PageProps) {
  let temples: (ITemple & { _id: string })[] = [];
  let dbError: string | null = null;

  try {
    temples = serialize(
      await getApprovedTemples({
        city:  searchParams?.city  || undefined,
        deity: searchParams?.deity || undefined,
      })
    ) as any as (ITemple & { _id: string })[];
  } catch (err: any) {
    dbError = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  }

  return (
    <PublicPage>
      <PageHero
        sanskrit="तीर्थस्थल खोजें"
        title="Explore Temples"
        subtitle="Discover 500+ verified temples across India. Book pujas, offer chadawa, seek divine blessings."
      />
      <TempleFilters city={searchParams?.city} deity={searchParams?.deity} />
      <MandalaDivider />
      <section className="pt-2 pb-6 md:pb-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {dbError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 font-mono text-sm whitespace-pre-wrap">
            <strong>Database Error:</strong> {dbError}
          </div>
        )}
        {temples.length === 0 ? (
          <EmptyState icon="🛕" title="No temples found" description="Try a different city or deity." />
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">{temples.length} temple{temples.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {temples.map((t) => <TempleCard key={t._id.toString()} temple={t} />)}
            </div>
          </>
        )}
      </section>
    </PublicPage>
  );
}
