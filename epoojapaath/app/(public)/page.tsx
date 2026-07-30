export const dynamic = "force-dynamic";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { NewHero } from "@/components/home/NewHero";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { PopularPujas } from "@/components/home/PopularPujas";
import { WhyChoose } from "@/components/home/WhyChoose";
import { FeaturedTemples } from "@/components/home/FeaturedTemples";
import { TrustedBanner } from "@/components/home/TrustedBanner";
import { ChadawaSection } from "@/components/home/ChadawaSection";
import { MonthlySubscription } from "@/components/home/MonthlySubscription";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { Stats } from "@/components/home/Stats";
import { DPIITRecognition } from "@/components/home/DPIITRecognition";
import { BlogPreview } from "@/components/home/BlogPreview";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustBadges } from "@/components/home/TrustBadges";
import { TempleRegisterCTA } from "@/components/home/TempleRegisterCTA";
import { BottomCTA } from "@/components/home/BottomCTA";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { AdBanner } from "@/components/ads/AdBanner";
import { getActiveAds } from "@/services/ad.service";
import { serialize } from "@/lib/utils";

import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";

async function getSubscriptionPuja() {
  await connectDB();
  return Puja.findOne({ isSubscription: true, isActive: true })
    .populate("temple", "name")
    .sort({ price: 1 })
    .lean();
}

export default async function HomePage() {
  const heroAds = serialize(await getActiveAds("hero").catch(() => [])) as any[];
  const sectionAds = serialize(await getActiveAds("between-sections").catch(() => [])) as any[];
  const subscriptionPuja = serialize(await getSubscriptionPuja().catch(() => null));

  return (
    <>
      <Navbar />
      <main>
        <NewHero />
        {heroAds.length > 0 && <AdBanner ads={heroAds} />}
        <MarqueeStrip />

        <PopularPujas />
        <WhyChoose />
        <FeaturedTemples />
        <TrustedBanner />

        <ChadawaSection />
        {sectionAds.length > 0 && <AdBanner ads={sectionAds} />}
        <MonthlySubscription subscription={subscriptionPuja as any} />
        <HowItWorks />
        <Testimonials />
        <Stats />

        <MandalaDivider />
        <DPIITRecognition />
        <MandalaDivider />
        <BlogPreview />

        <Newsletter />
        <TrustBadges />

        <MandalaDivider />
        <TempleRegisterCTA />

        <BottomCTA />
      </main>
      <Footer />
    </>
  );
}
