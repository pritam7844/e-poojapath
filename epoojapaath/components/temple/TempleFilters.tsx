const DEITIES = ["Lord Shiva","Lord Vishnu","Lord Krishna","Lord Rama","Goddess Durga","Goddess Lakshmi","Goddess Saraswati","Lord Ganesha","Lord Hanuman"];

interface TempleFiltersProps {
  city?: string;
  deity?: string;
}

export function TempleFilters({ city, deity }: TempleFiltersProps) {
  return (
    <section className="py-2 md:py-2.5 bg-card-bg border-b border-deep-gold/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <form method="GET" className="flex flex-wrap gap-3">
          <input
            name="city"
            defaultValue={city}
            placeholder="Search by city..."
            className="input-devotional flex-1 min-w-[160px] py-2 text-sm"
          />
          <select name="deity" defaultValue={deity} className="input-devotional py-2 text-sm">
            <option value="">All Deities</option>
            {DEITIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="submit" className="btn-saffron py-2 px-5 text-sm">Search 🔍</button>
          {(city || deity) && (
            <a href="/temples" className="btn-outline-gold py-2 px-4 text-sm">Clear</a>
          )}
        </form>
      </div>
    </section>
  );
}
