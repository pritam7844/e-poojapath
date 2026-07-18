"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as fbq from "@/lib/fpixel";
import { saveAttributionFromUrl } from "@/lib/attribution";

function FacebookPixelInstance() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fbq.pageview();
    if (searchParams) {
      saveAttributionFromUrl(searchParams);
    }
  }, [pathname, searchParams]);

  return null;
}

export function FacebookPixel() {
  // Wrap in Suspense to prevent Next.js build de-optimization due to useSearchParams
  return (
    <Suspense fallback={null}>
      <FacebookPixelInstance />
    </Suspense>
  );
}
