import { getFeaturedBlogs } from "@/services/blog.service";
import { BlogPreviewClient } from "./BlogPreviewClient";
import Link from "next/link";
import { serialize } from "@/lib/utils";

export async function BlogPreview() {
  const blogs = serialize(await getFeaturedBlogs().catch(() => []));

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-saffron font-medium mb-2 font-sanskrit">ज्ञान और भक्ति</p>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Sacred Wisdom & Temple Stories</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Explore devotional articles, festival guides, temple histories, and Vedic wisdom.
        </p>
      </div>

      <div className="mb-10">
        <BlogPreviewClient blogs={blogs} />
      </div>

      <div className="text-center">
        <Link href="/blog" className="btn-outline-gold">Read All Articles 📖</Link>
      </div>
    </section>
  );
}
