interface PageHeroProps {
  sanskrit: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ sanskrit, title, subtitle, className = "py-10 md:py-14" }: PageHeroProps) {
  return (
    <section
      className={`${className} text-center relative overflow-hidden border-b border-border/30`}
      style={{
        background: "linear-gradient(135deg, #F8F5FF 0%, #FFF5FA 50%, #F3F6FF 100%)",
      }}
    >
      {/* Dark mode override */}
      <style>{`
        @media (prefers-color-scheme: dark) {}
      `}</style>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "var(--page-hero-bg, transparent)",
        }}
      />
      {/* Subtle lotus radial glow & blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, #C4AAEE, transparent 75%)" }} />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-44 h-44 rounded-full bg-saffron/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-44 h-44 rounded-full bg-[#C4AAEE]/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-1.5 bg-saffron/5 border border-saffron/20 rounded-full px-3.5 py-1 mb-3.5 backdrop-blur-sm shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
          <p className="font-sanskrit text-[10px] md:text-xs font-bold tracking-widest uppercase text-saffron leading-none">
            {sanskrit}
          </p>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-3">{title}</h1>
        <div className="h-0.5 w-14 rounded-full mx-auto mb-3.5"
          style={{ background: "linear-gradient(90deg, #EC9DD4, #C4AAEE, #94AAEE)" }} />
        {subtitle && (
          <p className="text-muted-foreground text-xs md:text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
