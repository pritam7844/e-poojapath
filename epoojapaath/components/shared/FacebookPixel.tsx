"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as fbq from "@/lib/fpixel";

function FacebookPixelInstance() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fbq.pageview();
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
