import type { MetadataRoute } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.epoojapaath.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/user", "/temple", "/api", "/login", "/register"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
