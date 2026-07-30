export function MandalaDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <svg width="420" height="40" viewBox="0 0 420 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lotusLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC9DD4" stopOpacity="0" />
            <stop offset="40%" stopColor="#EC9DD4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C4AAEE" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="lotusLineR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C4AAEE" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#94AAEE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#94AAEE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC9DD4" />
            <stop offset="50%" stopColor="#C4AAEE" />
            <stop offset="100%" stopColor="#94AAEE" />
          </linearGradient>
        </defs>

        {/* Left line */}
        <line x1="0" y1="20" x2="165" y2="20" stroke="url(#lotusLine)" strokeWidth="1.5" />

        {/* Center mandala */}
        <g transform="translate(210, 20)">
          <circle cx="0" cy="0" r="15" stroke="url(#centerGrad)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <circle cx="0" cy="0" r="9"  stroke="#C4AAEE" strokeOpacity="0.55" strokeWidth="1" fill="none" />
          <circle cx="0" cy="0" r="3.5" fill="url(#centerGrad)" fillOpacity="0.7" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="0" y1="-9"
              x2="0" y2="-15"
              stroke="#C4AAEE"
              strokeOpacity="0.55"
              strokeWidth="1"
              transform={`rotate(${angle})`}
            />
          ))}
          {[-28, -22, 22, 28].map((x) => (
            <circle key={x} cx={x} cy="0" r="2" fill={x < 0 ? "#EC9DD4" : "#94AAEE"} fillOpacity="0.5" />
          ))}
        </g>

        {/* Right line */}
        <line x1="255" y1="20" x2="420" y2="20" stroke="url(#lotusLineR)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
