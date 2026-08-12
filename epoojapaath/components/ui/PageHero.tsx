interface PageHeroProps {
  sanskrit: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ sanskrit, title, subtitle, className = "py-8 md:py-12" }: PageHeroProps) {
  return (
    <section
      className={`${className} text-center relative overflow-hidden`}
      style={{
        background: "linear-gradient(135deg, #FFFDFB 0%, #FFF2E8 50%, #FFFDFB 100%)",
      }}
    >
      {/* Pure CSS for Rotating Watermark */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-very-slow {
          animation: spin-slow 80s linear infinite;
        }
      `}</style>

      {/* Decorative Traditional Border Accents */}
      <div className="absolute top-2 left-2 right-2 bottom-2 border border-saffron/10 rounded-xl pointer-events-none" />
      <div className="absolute top-3 left-3 right-3 bottom-3 border border-saffron/5 rounded-lg pointer-events-none" />

      {/* Slow Rotating Background Mandala Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] md:opacity-[0.07] z-0 overflow-hidden">
        <svg className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] text-saffron animate-spin-very-slow" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" />
          {Array.from({ length: 36 }).map((_, i) => (
            <path
              key={i}
              d="M100 100 L100 15 Q103 30 100 50 Q97 30 100 15"
              transform={`rotate(${i * 10} 100 100)`}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.3"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        {/* Sanskrit tag */}
        <p
          className="font-sanskrit text-xs md:text-sm font-semibold mb-2.5 tracking-widest uppercase"
          style={{ background: "linear-gradient(135deg, #D45B0A, #E65100)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          ✨ {sanskrit} ✨
        </p>

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-5xl text-[#4A1A0C] font-extrabold mb-3">
          {title}
        </h1>

        {/* Lotus/Mandala line divider */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-saffron" />
          <span className="text-saffron text-xs">◆</span>
          <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-saffron" />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-700 text-xs md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
