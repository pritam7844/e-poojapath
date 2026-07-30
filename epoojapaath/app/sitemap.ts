import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Blog from "@/models/Blog";
import Chadawa from "@/models/Chadawa";

export const revalidate = 3600;

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.epoojapaath.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/puja`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/temples`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/chadawa`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/astro`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const [temples, pujas, blogs, chadawaItems] = await Promise.all([
      Temple.find({ status: "approved" }).select("slug updatedAt").lean(),
      Puja.find({ isActive: true }).select("_id updatedAt").lean(),
      Blog.find({ status: "published" }).select("slug updatedAt").lean(),
      Chadawa.find({ isActive: true }).select("_id updatedAt").lean(),
    ]);

    dynamicRoutes = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...temples.map((t: any) => ({
        url: `${BASE_URL}/temples/${t.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...pujas.map((p: any) => ({
        url: `${BASE_URL}/puja/${p._id}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...blogs.map((b: any) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...chadawaItems.map((c: any) => ({
        url: `${BASE_URL}/chadawa/${c._id}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // DB unreachable — ship static routes only rather than failing the sitemap
  }

  return [...staticRoutes, ...dynamicRoutes];
}
