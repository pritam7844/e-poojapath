interface PageHeroProps {
  sanskrit: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ sanskrit, title, subtitle, className = "py-20" }: PageHeroProps) {
  return (
    <section
      className={`${className} text-center relative overflow-hidden`}
      style={{
        background: "linear-gradient(135deg, #F5F0FF 0%, #FFF0F8 50%, #EEF2FF 100%)",
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
      {/* Subtle lotus radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #C4AAEE, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <p
          className="font-sanskrit text-sm font-medium mb-3 tracking-widest uppercase"
          style={{ background: "linear-gradient(135deg, #EC9DD4, #C4AAEE, #94AAEE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {sanskrit}
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">{title}</h1>
        <div className="h-0.5 w-16 rounded-full mx-auto mb-4"
          style={{ background: "linear-gradient(90deg, #EC9DD4, #C4AAEE, #94AAEE)" }} />
        {subtitle && (
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
