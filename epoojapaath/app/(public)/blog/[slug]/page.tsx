export const revalidate = 300;

import { notFound } from "next/navigation";
import Image from "next/image";
import { PublicPage } from "@/components/shared/PublicPage";
import { getBlogBySlug, getPublishedBlogs } from "@/services/blog.service";
import { getActiveAds } from "@/services/ad.service";
import { AdBanner } from "@/components/ads/AdBanner";
import { BlogCard } from "@/components/blog/BlogCard";
import { formatDate, calculateReadTime, serialize } from "@/lib/utils";
import type { IUser } from "@/types";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = serialize(await getBlogBySlug(params.slug).catch(() => null));
  if (!blog) return { title: "Blog Not Found" };
  return { title: `${blog.title} | ePoojapaath`, description: blog.excerpt };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [blogRaw, sidebarAdRaw] = await Promise.all([
    getBlogBySlug(params.slug).catch(() => null),
    getActiveAds("sidebar").catch(() => []),
  ]);
  if (!blogRaw) notFound();

  const blog = serialize(blogRaw);
  const sidebarAds = serialize(sidebarAdRaw) as any[];

  const related = serialize(await getPublishedBlogs({ category: blog.category }).catch(() => []));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedFiltered = (related as any[]).filter((b) => b._id.toString() !== blog._id.toString()).slice(0, 3);

  const authorName = typeof blog.author === "object" ? (blog.author as IUser).name : "ePoojapaath";

  return (
    <PublicPage showAIChat>
      <div className="pt-4">
        <div className="relative h-72 md:h-96 w-full">
          <Image src={blog.coverImage || "/placeholder-blog.jpg"} alt={blog.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 max-w-3xl">
            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium capitalize mb-3 bg-saffron text-white`}>
              {blog.category?.replace("-", " ")}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl text-white mb-3">{blog.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span>By {authorName}</span>
              <span>{blog.publishedAt ? formatDate(blog.publishedAt) : ""}</span>
              <span>{calculateReadTime(blog.content)} min read</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <article className="lg:col-span-3">
              <div className="card-devotional prose prose-stone max-w-none prose-headings:font-heading prose-headings:text-foreground prose-a:text-saffron"
                dangerouslySetInnerHTML={{ __html: blog.content }} />

              {/* Share */}
              <div className="mt-8 card-devotional">
                <p className="font-heading text-lg text-foreground mb-3">Share this article</p>
                <div className="flex gap-3">
                  <a href={`https://wa.me/?text=${encodeURIComponent(blog.title + " " + process.env.NEXT_PUBLIC_APP_URL + "/blog/" + blog.slug)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.58 1.978 14.108.954 11.998.954 6.56.954 2.136 5.325 2.132 10.756c-.001 1.637.45 3.238 1.309 4.63l-.995 3.635 3.731-.977zm11.368-6.19c-.3-.149-1.772-.874-2.046-.974-.275-.1-.475-.149-.675.15-.2.299-.775.974-.95 1.173-.175.2-.35.225-.65.075-.3-.15-1.265-.466-2.41-1.488-.89-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.462.13-.611.135-.133.3-.349.45-.524.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.625-.925-2.225-.244-.589-.492-.51-.675-.518-.174-.007-.374-.009-.574-.009-.2 0-.525.075-.8.375-.276.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.116 4.52.716.31 1.274.495 1.71.634.72.228 1.375.196 1.893.118.577-.087 1.772-.724 2.022-1.424.25-.7.25-1.299.175-1.424-.075-.125-.275-.199-.575-.349z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL ?? "https://e-poojapath.vercel.app") + "/blog/" + blog.slug)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

              <div className="mt-6 p-4 bg-background rounded-xl border border-deep-gold/20 text-center text-sm text-muted-foreground">
                💬 Comments coming soon
              </div>

              {/* Related */}
              {relatedFiltered.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {relatedFiltered.map((b: any) => <BlogCard key={b._id.toString()} blog={b} />)}
                  </div>
                </div>
              )}
            </article>

            <aside>
              {sidebarAds.length > 0 && <AdBanner ads={sidebarAds} />}
              <div className="card-devotional mt-6">
                <p className="font-heading text-lg text-foreground mb-2">About Author</p>
                <p className="text-muted-foreground text-sm">{authorName}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PublicPage>
  );
}
