"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";

export function BlogPreviewClient({ blogs }: { blogs: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      let cardWidth = 320;
      if (firstChild) {
        const isDesktop = window.innerWidth >= 768;
        const gap = isDesktop ? 24 : 16;
        cardWidth = firstChild.getBoundingClientRect().width + gap;
      }

      const scrollTo = direction === "left"
        ? scrollLeft - cardWidth
        : scrollLeft + cardWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/nav mt-6">
      {/* Left Arrow Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-1 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white border border-amber-100 shadow-md rounded-full flex items-center justify-center text-saffron hover:bg-amber-50 active:scale-95 transition-all md:opacity-0 md:group-hover/nav:opacity-100"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
      </button>

      {/* Flex container of Blogs */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-6 pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory"
      >
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="w-[280px] min-[370px]:w-[320px] md:w-[380px] shrink-0 snap-align-start flex"
          >
            <div className="w-full flex flex-col h-full">
              <BlogCard blog={blog} />
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-1 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white border border-amber-100 shadow-md rounded-full flex items-center justify-center text-saffron hover:bg-amber-50 active:scale-95 transition-all md:opacity-0 md:group-hover/nav:opacity-100"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
