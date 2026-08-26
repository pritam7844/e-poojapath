"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

// ─── Background SVG Decorations ──────────────────────────────────────────────

function TempleBell({ x, y, size = 80, opacity = 0.7, delay = 0 }: { x: string; y: string; size?: number; opacity?: number; delay?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, opacity }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width={size} height={size * 1.3} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`bell-g-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4820A" />
            <stop offset="100%" stopColor="#EC9DD4" />
          </linearGradient>
        </defs>
        {/* Chain links */}
        {[0, 8, 16].map((cy) => (
          <ellipse key={cy} cx="30" cy={cy + 2} rx="3" ry="4" stroke={`url(#bell-g-${delay})`} strokeWidth="1.5" fill="none" />
        ))}
        {/* Bell body */}
        <path d="M18 28 Q14 40 14 52 Q14 62 30 62 Q46 62 46 52 Q46 40 42 28 Z"
          fill={`url(#bell-g-${delay})`} opacity="0.85" />
        {/* Bell rim */}
        <ellipse cx="30" cy="62" rx="16" ry="4" fill="#B8680A" opacity="0.7" />
        {/* Bell top knob */}
        <ellipse cx="30" cy="26" rx="5" ry="3" fill="#D4820A" />
        {/* Clapper */}
        <line x1="30" y1="50" x2="30" y2="68" stroke="#8B5200" strokeWidth="1.5" />
        <circle cx="30" cy="70" r="3" fill="#8B5200" />
        {/* Shine */}
        <ellipse cx="23" cy="38" rx="3" ry="6" fill="white" opacity="0.2" />
      </svg>
    </motion.div>
  );
}

function FloatingLotus({ x, y, size = 95, opacity = 0.6, delay = 0 }: { x: string; y: string; size?: number; opacity?: number; delay?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, opacity }}
      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`lotus-g-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC9DD4" />
            <stop offset="50%" stopColor="#C4AAEE" />
            <stop offset="100%" stopColor="#94AAEE" />
          </linearGradient>
        </defs>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path
            key={i}
            d="M40 40 Q50 25 40 12 Q30 25 40 40"
            transform={`rotate(${angle} 40 40)`}
            fill={`url(#lotus-g-${delay})`}
            opacity="0.8"
          />
        ))}
        <circle cx="40" cy="40" r="7" fill="#EC9DD4" opacity="0.9" />
        <circle cx="40" cy="40" r="4" fill="#fff" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

function FloatingDiya({ x, y, size = 70, opacity = 0.75, delay = 0 }: { x: string; y: string; size?: number; opacity?: number; delay?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, opacity }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width={size} height={size * 1.2} viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`diya-g-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4820A" />
            <stop offset="100%" stopColor="#F5C842" />
          </linearGradient>
          <radialGradient id={`flame-g-${delay}`} cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="50%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#E65100" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Flame */}
        <motion.path
          d="M25 22 Q22 16 25 10 Q28 16 25 22"
          fill={`url(#flame-g-${delay})`}
          animate={{ scaleY: [1, 1.15, 0.9, 1], skewX: [0, 3, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay }}
        />
        <motion.path
          d="M25 24 Q21 18 23 12 Q27 17 25 24"
          fill="#FFCC02"
          opacity="0.6"
          animate={{ scaleY: [1, 1.2, 0.85, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: delay + 0.3 }}
        />
        {/* Wick */}
        <line x1="25" y1="24" x2="25" y2="28" stroke="#333" strokeWidth="1" />
        {/* Diya bowl */}
        <path d="M10 32 Q12 28 25 28 Q38 28 40 32 Q42 38 25 40 Q8 38 10 32Z"
          fill={`url(#diya-g-${delay})`} />
        {/* Diya base */}
        <ellipse cx="25" cy="40" rx="15" ry="4" fill="#B8680A" opacity="0.6" />
        {/* Oil shine */}
        <ellipse cx="20" cy="33" rx="3" ry="2" fill="white" opacity="0.25" />
        {/* Glow halo */}
        <circle cx="25" cy="18" r="10" fill="#FF9800" opacity="0.06" />
      </svg>
    </motion.div>
  );
}

function OmSymbol({ x, y, size = 110, opacity = 0.45, delay = 0 }: { x: string; y: string; size?: number; opacity?: number; delay?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, opacity }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 80, repeat: Infinity, ease: "linear", delay }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`om-g-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC9DD4" />
            <stop offset="100%" stopColor="#94AAEE" />
          </linearGradient>
        </defs>
        <text x="50" y="72" textAnchor="middle" fontSize="68" fontFamily="serif"
          fill={`url(#om-g-${delay})`} opacity="1">ॐ</text>
      </svg>
    </motion.div>
  );
}

function MarigoldGarland({ x, y, opacity = 0.6 }: { x: string; y: string; opacity?: number }) {
  return (
    <div className="absolute pointer-events-none select-none" style={{ left: x, top: y, opacity }}>
      <svg width="220" height="60" viewBox="0 0 220 60" fill="none">
        <defs>
          <linearGradient id="marigold-g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4A628" />
            <stop offset="50%" stopColor="#EC9DD4" />
            <stop offset="100%" stopColor="#F4A628" />
          </linearGradient>
        </defs>
        {/* Garland string */}
        <path d="M10 10 Q55 40 110 10 Q165 40 210 10" stroke="url(#marigold-g)" strokeWidth="1.5" fill="none" opacity="0.5" />
        {/* Flowers along the garland */}
        {[10, 45, 80, 110, 140, 175, 210].map((cx, i) => {
          const cy = i % 2 === 0 ? 10 : 32;
          return (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 5} cy={Math.sin(a * Math.PI / 180) * 5}
                  rx="3" ry="2" fill="#F4A628" opacity="0.8"
                  transform={`rotate(${a})`} />
              ))}
              <circle cx="0" cy="0" r="3" fill="#EC9DD4" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Per-Slide SVG Illustrations ────────────────────────────────────────────

function PujaIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="puja-glow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#FFF5DC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4820A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="puja-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4820A" />
          <stop offset="100%" stopColor="#F5C842" />
        </linearGradient>
        <linearGradient id="puja-g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC9DD4" />
          <stop offset="100%" stopColor="#C4AAEE" />
        </linearGradient>
      </defs>

      {/* Glow background */}
      <circle cx="140" cy="150" r="100" fill="url(#puja-glow)" />

      {/* Temple arch */}
      <path d="M60 220 L60 110 Q60 70 100 55 Q140 40 180 55 Q220 70 220 110 L220 220"
        stroke="url(#puja-g1)" strokeWidth="3" fill="none" />
      <path d="M75 220 L75 115 Q75 82 105 70 Q140 58 175 70 Q205 82 205 115 L205 220"
        fill="rgba(212,130,10,0.05)" stroke="url(#puja-g1)" strokeWidth="1.5" />

      {/* Temple top dome */}
      <path d="M100 55 Q140 20 180 55 Q175 35 140 28 Q105 35 100 55Z"
        fill="url(#puja-g1)" opacity="0.7" />
      <circle cx="140" cy="25" r="6" fill="#D4820A" />
      <line x1="140" y1="19" x2="140" y2="8" stroke="#D4820A" strokeWidth="2" />
      <path d="M133 8 Q140 2 147 8" fill="#D4820A" />

      {/* Large diya */}
      <motion.g animate={{ scaleY: [1, 1.1, 0.95, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <path d="M128 140 Q125 130 128 118 Q135 128 140 118 Q145 128 152 118 Q155 130 152 140"
          fill="url(#puja-g1)" opacity="0.9" />
        <path d="M134 138 Q132 126 135 115 Q140 124 145 115 Q148 126 146 138"
          fill="#FFF176" opacity="0.7" />
      </motion.g>
      <ellipse cx="140" cy="148" rx="18" ry="6" fill="url(#puja-g1)" opacity="0.8" />
      <path d="M122 154 Q126 162 140 164 Q154 162 158 154 Q156 170 140 172 Q124 170 122 154Z"
        fill="url(#puja-g1)" opacity="0.7" />

      {/* Flowers around diya */}
      {[[-35, -20], [35, -20], [-45, 10], [45, 10], [0, -40]].map(([dx, dy], i) => (
        <g key={i} transform={`translate(${140 + dx}, ${155 + dy})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 5} cy={Math.sin(a * Math.PI / 180) * 5}
              rx="4" ry="2.5" fill={i % 2 === 0 ? "#EC9DD4" : "#F4A628"}
              transform={`rotate(${a})`} opacity="0.85" />
          ))}
          <circle cx="0" cy="0" r="3" fill="white" opacity="0.8" />
        </g>
      ))}

      {/* Decorative bells */}
      <g transform="translate(90, 65)" opacity="0.7">
        <path d="M0 0 L0 6 Q-5 8 -5 12 Q-5 18 0 18 Q5 18 5 12 Q5 8 0 6Z" fill="url(#puja-g1)" />
        <circle cx="0" cy="20" r="1.5" fill="#8B5200" />
      </g>
      <g transform="translate(190, 65)" opacity="0.7">
        <path d="M0 0 L0 6 Q-5 8 -5 12 Q-5 18 0 18 Q5 18 5 12 Q5 8 0 6Z" fill="url(#puja-g1)" />
        <circle cx="0" cy="20" r="1.5" fill="#8B5200" />
      </g>

      {/* Puja thali */}
      <ellipse cx="140" cy="198" rx="45" ry="14" fill="rgba(212,130,10,0.12)" stroke="url(#puja-g1)" strokeWidth="1.5" />
      <ellipse cx="140" cy="196" rx="40" ry="10" fill="rgba(212,130,10,0.08)" />

      {/* Lotus petals on thali */}
      {[-28, -14, 0, 14, 28].map((dx, i) => (
        <ellipse key={i} cx={140 + dx} cy="196" rx="5" ry="3"
          fill={i % 2 === 0 ? "#EC9DD4" : "#F4A628"} opacity="0.7" />
      ))}

      {/* Mantra text glow */}
      <text x="140" y="240" textAnchor="middle" fontSize="11"
        fontFamily="serif" fill="url(#puja-g2)" opacity="0.6">ॐ नमः शिवाय</text>
    </svg>
  );
}

function ChadawaIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="chad-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDF0F9" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EC9DD4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chad-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC9DD4" />
          <stop offset="100%" stopColor="#C4AAEE" />
        </linearGradient>
        <linearGradient id="chad-g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4A628" />
          <stop offset="100%" stopColor="#EC9DD4" />
        </linearGradient>
      </defs>

      <circle cx="140" cy="130" r="110" fill="url(#chad-glow)" />

      {/* Large central lotus */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
        <motion.path
          key={i}
          d="M140 130 Q158 105 140 80 Q122 105 140 130"
          transform={`rotate(${a} 140 130)`}
          fill={i % 3 === 0 ? "#EC9DD4" : i % 3 === 1 ? "#C4AAEE" : "#94AAEE"}
          opacity="0.75"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}

      {/* Inner petals */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <path key={i} d="M140 130 Q152 115 140 100 Q128 115 140 130"
          transform={`rotate(${a} 140 130)`}
          fill={i % 2 === 0 ? "#FFB3D9" : "#B8C8F8"} opacity="0.85" />
      ))}

      <circle cx="140" cy="130" r="14" fill="url(#chad-g2)" />
      <circle cx="140" cy="130" r="8" fill="white" opacity="0.6" />

      {/* Falling petals */}
      {[[55, 55, -15], [195, 70, 10], [70, 195, 5], [190, 190, -8], [100, 40, 20], [175, 210, -12]].map(([px, py, rot], i) => (
        <motion.path key={i}
          d={`M${px} ${py} Q${px + 6} ${py - 8} ${px} ${py - 16} Q${px - 6} ${py - 8} ${px} ${py}`}
          fill={i % 2 === 0 ? "#EC9DD4" : "#94AAEE"}
          transform={`rotate(${rot} ${px} ${py})`}
          opacity="0.65"
          animate={{ y: [0, 4, 0], opacity: [0.65, 0.9, 0.65] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Offering basket */}
      <path d="M100 205 Q105 190 140 188 Q175 190 180 205 Q178 220 140 222 Q102 220 100 205Z"
        fill="rgba(196,170,238,0.25)" stroke="url(#chad-g1)" strokeWidth="1.5" />
      {/* Fruits in basket */}
      {[-25, -10, 5, 20].map((dx, i) => (
        <circle key={i} cx={140 + dx} cy="202" r="7"
          fill={["#F4A628", "#EC9DD4", "#94AAEE", "#F4A628"][i]} opacity="0.8" />
      ))}

      <text x="140" y="248" textAnchor="middle" fontSize="11"
        fontFamily="serif" fill="url(#chad-g1)" opacity="0.6">🌸 अर्पण • Offering</text>
    </svg>
  );
}

function TempleIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="tmpl-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#F0ECFF" />
        </linearGradient>
        <linearGradient id="tmpl-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94AAEE" />
          <stop offset="100%" stopColor="#C4AAEE" />
        </linearGradient>
        <linearGradient id="tmpl-g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4820A" />
          <stop offset="100%" stopColor="#F5C842" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="20" y="20" width="240" height="160" rx="16" fill="url(#tmpl-sky)" opacity="0.5" />

      {/* Stars */}
      {[[50, 40], [90, 30], [150, 25], [210, 35], [240, 50], [70, 60], [220, 65]].map(([sx, sy], i) => (
        <motion.circle key={i} cx={sx} cy={sy} r="2" fill="url(#tmpl-g1)" opacity="0.5"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}

      {/* Main temple shikhara (spire) */}
      <path d="M140 30 L125 55 L120 80 L115 105 L108 130 L108 185 L172 185 L172 130 L165 105 L160 80 L155 55 Z"
        fill="url(#tmpl-g1)" opacity="0.15" />
      <path d="M140 32 L128 55 L123 78 L118 100 L113 128 L113 185 L167 185 L167 128 L162 100 L157 78 L152 55 Z"
        stroke="url(#tmpl-g1)" strokeWidth="1.5" fill="none" />

      {/* Shikhara tiers */}
      {[[28, 52], [22, 75], [18, 98], [14, 120]].map(([halfW, y], i) => (
        <rect key={i} x={140 - halfW} y={y} width={halfW * 2} height="8"
          fill="url(#tmpl-g1)" opacity={0.35 - i * 0.05} rx="1" />
      ))}

      {/* Kalash (top) */}
      <ellipse cx="140" cy="50" rx="8" ry="5" fill="url(#tmpl-g2)" opacity="0.8" />
      <rect x="137" y="32" width="6" height="18" fill="url(#tmpl-g2)" opacity="0.7" rx="1" />
      <path d="M134 30 Q140 22 146 30" fill="url(#tmpl-g2)" opacity="0.9" />
      <circle cx="140" cy="22" r="3" fill="#D4820A" />

      {/* Main hall */}
      <rect x="90" y="140" width="100" height="45" fill="url(#tmpl-g1)" opacity="0.12" stroke="url(#tmpl-g1)" strokeWidth="1.5" />

      {/* Columns */}
      {[100, 120, 140, 160].map((cx) => (
        <g key={cx}>
          <rect x={cx - 3} y="135" width="6" height="50" fill="url(#tmpl-g1)" opacity="0.3" rx="1" />
          <ellipse cx={cx} cy="134" rx="5" ry="3" fill="url(#tmpl-g1)" opacity="0.4" />
        </g>
      ))}

      {/* Temple door */}
      <path d="M127 185 L127 158 Q140 148 153 158 L153 185Z"
        fill="url(#tmpl-g2)" opacity="0.35" stroke="url(#tmpl-g2)" strokeWidth="1" />
      <motion.circle cx="140" cy="162" r="4" fill="url(#tmpl-g2)" opacity="0.6"
        animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />

      {/* Ground */}
      <rect x="50" y="185" width="180" height="8" fill="url(#tmpl-g1)" opacity="0.15" rx="2" />

      {/* Side decorative stupas */}
      {[[75, 150], [205, 150]].map(([sx, sy], i) => (
        <g key={i}>
          <path d={`M${sx} ${sy + 10} L${sx - 8} ${sy + 22} L${sx + 8} ${sy + 22}Z`}
            fill="url(#tmpl-g2)" opacity="0.4" />
          <circle cx={sx} cy={sy + 8} r="5" fill="url(#tmpl-g2)" opacity="0.35" />
        </g>
      ))}

      {/* Diya at entrance */}
      <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <path d="M136 200 Q138 196 140 193 Q142 196 144 200" fill="#F5C842" opacity="0.8" />
        <ellipse cx="140" cy="202" rx="6" ry="2.5" fill="url(#tmpl-g2)" opacity="0.7" />
      </motion.g>

      {/* Hanging bells */}
      {[[105, 138], [175, 138]].map(([bx, by], i) => (
        <g key={i} opacity="0.5">
          <line x1={bx} y1={by - 6} x2={bx} y2={by} stroke="#D4820A" strokeWidth="1" />
          <path d={`M${bx - 4} ${by} L${bx - 4} ${by + 8} Q${bx} ${by + 12} ${bx + 4} ${by + 8} L${bx + 4} ${by}Z`}
            fill="url(#tmpl-g2)" />
          <circle cx={bx} cy={by + 14} r="1.5" fill="#8B5200" />
        </g>
      ))}

      <text x="140" y="248" textAnchor="middle" fontSize="11"
        fontFamily="serif" fill="url(#tmpl-g1)" opacity="0.7">🛕 Discover Sacred Temples</text>
    </svg>
  );
}

function AstrologyIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="astro-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5F0FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C4AAEE" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="astro-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4AAEE" />
          <stop offset="100%" stopColor="#94AAEE" />
        </linearGradient>
        <linearGradient id="astro-g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC9DD4" />
          <stop offset="100%" stopColor="#C4AAEE" />
        </linearGradient>
      </defs>

      <circle cx="140" cy="130" r="110" fill="url(#astro-glow)" />

      {/* Outer zodiac ring */}
      <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 130px" }}>
        <circle cx="140" cy="130" r="95" stroke="url(#astro-g1)" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.4" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          return (
            <circle key={i} cx={140 + Math.cos(a) * 95} cy={130 + Math.sin(a) * 95}
              r="5" fill="url(#astro-g1)" opacity="0.6" />
          );
        })}
      </motion.g>

      {/* Middle ring */}
      <motion.g animate={{ rotate: [0, -360] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 130px" }}>
        <circle cx="140" cy="130" r="68" stroke="url(#astro-g2)" strokeWidth="1.5" strokeDasharray="3 5" fill="none" opacity="0.5" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 - 90) * Math.PI / 180;
          return (
            <path key={i}
              d={`M${140 + Math.cos(a) * 62} ${130 + Math.sin(a) * 62} L${140 + Math.cos(a) * 75} ${130 + Math.sin(a) * 75}`}
              stroke="url(#astro-g2)" strokeWidth="2" opacity="0.6" />
          );
        })}
      </motion.g>

      {/* Central sun */}
      <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 130px" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30) * Math.PI / 180;
          return (
            <line key={i} x1={140 + Math.cos(a) * 22} y1={130 + Math.sin(a) * 22}
              x2={140 + Math.cos(a) * 32} y2={130 + Math.sin(a) * 32}
              stroke="url(#astro-g1)" strokeWidth="2" opacity="0.7" />
          );
        })}
      </motion.g>
      <circle cx="140" cy="130" r="22" fill="url(#astro-g1)" opacity="0.25" />
      <circle cx="140" cy="130" r="14" fill="url(#astro-g2)" opacity="0.5" />
      <text x="140" y="136" textAnchor="middle" fontSize="14" fill="white" opacity="0.9">ॐ</text>

      {/* Twinkling stars */}
      {[[60, 50], [220, 40], [45, 180], [235, 175], [80, 220], [200, 215], [150, 45]].map(([sx, sy], i) => (
        <motion.polygon key={i}
          points={`${sx},${sy - 6} ${sx + 2},${sy - 2} ${sx + 6},${sy - 2} ${sx + 3},${sy + 1} ${sx + 4},${sy + 5} ${sx},${sy + 3} ${sx - 4},${sy + 5} ${sx - 3},${sy + 1} ${sx - 6},${sy - 2} ${sx - 2},${sy - 2}`}
          fill="url(#astro-g1)" opacity="0.55"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        />
      ))}

      <text x="140" y="248" textAnchor="middle" fontSize="11"
        fontFamily="serif" fill="url(#astro-g1)" opacity="0.7">🔮 Vedic Astrology • Kundli</text>
    </svg>
  );
}

function LiveStreamIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="live-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4820A" />
          <stop offset="100%" stopColor="#EC9DD4" />
        </linearGradient>
        <radialGradient id="live-screen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF5E8" />
          <stop offset="100%" stopColor="#F0ECFF" />
        </radialGradient>
      </defs>

      {/* Phone frame */}
      <rect x="85" y="30" width="110" height="185" rx="18" fill="white" stroke="url(#live-g1)" strokeWidth="2.5" />
      <rect x="90" y="38" width="100" height="165" rx="12" fill="url(#live-screen)" opacity="0.8" />

      {/* Phone screen – temple inside */}
      <path d="M130 80 L123 100 L120 125 L120 185 L160 185 L160 125 L157 100 L150 80Z"
        fill="url(#live-g1)" opacity="0.12" stroke="url(#live-g1)" strokeWidth="1" />
      {[[28, 80], [22, 98], [16, 116]].map(([w, y], i) => (
        <rect key={i} x={140 - w / 2} y={y} width={w} height="6" fill="url(#live-g1)" opacity="0.3} rx={1}" rx="1" />
      ))}
      <circle cx="140" cy="75" r="5" fill="#D4820A" opacity="0.6" />
      <line x1="140" y1="70" x2="140" y2="62" stroke="#D4820A" strokeWidth="1.5" />

      {/* LIVE badge */}
      <motion.rect x="96" y="46" width="36" height="14" rx="4" fill="#E53935"
        animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <text x="114" y="57" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">● LIVE</text>

      {/* Signal waves */}
      {[1, 2, 3].map((ring) => (
        <motion.circle key={ring} cx="235" cy="80" r={ring * 14}
          stroke="url(#live-g1)" strokeWidth="1.5" fill="none"
          opacity={0.6 / ring}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5 / ring, 0, 0.5 / ring] }}
          transition={{ duration: 2, repeat: Infinity, delay: ring * 0.4 }}
          style={{ transformOrigin: "235px 80px" }} />
      ))}
      <circle cx="235" cy="80" r="8" fill="url(#live-g1)" opacity="0.8" />
      <path d="M232 77 L232 83 L238 80Z" fill="white" />

      {/* Devotee silhouette */}
      <circle cx="55" cy="168" r="14" fill="url(#live-g1)" opacity="0.35" />
      <path d="M42 195 Q55 175 68 195" fill="url(#live-g1)" opacity="0.3" />
      {/* Namaste hands */}
      <path d="M49 183 Q55 178 61 183 Q58 190 55 192 Q52 190 49 183Z" fill="url(#live-g1)" opacity="0.4" />

      {/* Diya flame on screen */}
      <motion.path d="M136 155 Q138 148 140 142 Q142 148 144 155"
        fill="#F5C842" opacity="0.9"
        animate={{ scaleY: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }} />
      <ellipse cx="140" cy="157" rx="7" ry="2.5" fill="#D4820A" opacity="0.7" />

      {/* Floating hearts / blessings */}
      {[[105, 220], [155, 215], [180, 205]].map(([hx, hy], i) => (
        <motion.text key={i} x={hx} y={hy} fontSize="12" opacity="0.6"
          animate={{ y: [hy, hy - 20, hy], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}>🙏</motion.text>
      ))}

      <text x="140" y="248" textAnchor="middle" fontSize="11"
        fontFamily="serif" fill="url(#live-g1)" opacity="0.7">📹 Live Puja Streaming</text>
    </svg>
  );
}

function PrasadIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="prs-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#F5C842" />
        </linearGradient>
        <linearGradient id="prs-g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC9DD4" />
          <stop offset="100%" stopColor="#94AAEE" />
        </linearGradient>
        <radialGradient id="prs-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFAEC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="140" cy="130" r="100" fill="url(#prs-glow)" />

      {/* Gift/prasad box */}
      <rect x="95" y="130" width="90" height="70" rx="8" fill="url(#prs-g2)" opacity="0.25" stroke="url(#prs-g2)" strokeWidth="2" />
      <rect x="95" y="120" width="90" height="18" rx="6" fill="url(#prs-g1)" opacity="0.7" />
      {/* Ribbon vertical */}
      <rect x="134" y="120" width="12" height="80" rx="2" fill="url(#prs-g1)" opacity="0.5" />
      {/* Ribbon horizontal */}
      <rect x="95" y="152" width="90" height="10" rx="2" fill="url(#prs-g1)" opacity="0.4" />
      {/* Bow */}
      <path d="M134 120 Q120 110 118 118 Q122 126 134 120Z" fill="url(#prs-g1)" opacity="0.7" />
      <path d="M146 120 Q160 110 162 118 Q158 126 146 120Z" fill="url(#prs-g1)" opacity="0.7" />
      <circle cx="140" cy="120" r="6" fill="url(#prs-g1)" opacity="0.8" />

      {/* Temple blessing stamp on box */}
      <text x="140" y="168" textAnchor="middle" fontSize="24" opacity="0.5">🛕</text>
      <text x="140" y="188" textAnchor="middle" fontSize="9" fill="url(#prs-g2)" opacity="0.8">Temple Blessed</text>

      {/* Floating marigold flowers */}
      {[[65, 90], [210, 85], [55, 175], [220, 160], [90, 60], [185, 55]].map(([fx, fy], i) => (
        <motion.g key={i} transform={`translate(${fx}, ${fy})`}
          animate={{ y: [0, -6, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          style={{ transformOrigin: "0px 0px" }}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 7} cy={Math.sin(a * Math.PI / 180) * 7}
              rx="5" ry="3" fill={i % 2 === 0 ? "#F4A628" : "#EC9DD4"}
              transform={`rotate(${a})`} opacity="0.8" />
          ))}
          <circle cx="0" cy="0" r="4" fill="white" opacity="0.7" />
        </motion.g>
      ))}

      {/* Delivery truck silhouette */}
      <g transform="translate(45, 210)" opacity="0.35">
        <rect x="0" y="0" width="50" height="22" rx="3" fill="url(#prs-g2)" />
        <rect x="32" y="-10" width="18" height="10" rx="2" fill="url(#prs-g2)" />
        <circle cx="10" cy="22" r="6" fill="url(#prs-g1)" />
        <circle cx="40" cy="22" r="6" fill="url(#prs-g1)" />
      </g>

      <text x="140" y="248" textAnchor="middle" fontSize="11"
        fontFamily="serif" fill="url(#prs-g1)" opacity="0.7">📦 Prasad Delivered to You</text>
    </svg>
  );
}

// ─── Slides config ───────────────────────────────────────────────────────────

const slides = [
  {
    en: { title: "Book Sacred Pujas", description: "Schedule rituals with verified pandits at India's most sacred temples — from home." },
    hi: { title: "पवित्र पूजा बुक करें", description: "घर बैठे भारत के पवित्र मंदिरों में प्रमाणित पंडितों से अनुष्ठान करवाएं।" },
    gradient: "from-[#FFF5E8] to-[#FFF0F8]", darkGradient: "dark:from-[#2A1A08] dark:to-[#2A1220]",
    ring: "#D4820A", glow: "rgba(212,130,10,0.15)", Illustration: PujaIllustration,
  },
  {
    en: { title: "Chadawa Offerings", description: "Send sacred flowers, bilva patra and prasad to any temple across India." },
    hi: { title: "चढ़ावा अर्पण", description: "भारत के किसी भी मंदिर में पवित्र फूल, बेलपत्र और प्रसाद भेजें।" },
    gradient: "from-[#FDF0F9] to-[#F0F0FF]", darkGradient: "dark:from-[#2A0E20] dark:to-[#1A1230]",
    ring: "#EC9DD4", glow: "rgba(236,157,212,0.18)", Illustration: ChadawaIllustration,
  },
  {
    en: { title: "Discover Temples", description: "Explore verified temples with timings, history, pujas and devotee reviews." },
    hi: { title: "मंदिर खोजें", description: "समय, इतिहास, पूजा और भक्त समीक्षाओं के साथ प्रमाणित मंदिर देखें।" },
    gradient: "from-[#EFF2FF] to-[#F5F0FF]", darkGradient: "dark:from-[#0E1430] dark:to-[#1A1230]",
    ring: "#94AAEE", glow: "rgba(148,170,238,0.18)", Illustration: TempleIllustration,
  },
  {
    en: { title: "Vedic Astrology", description: "Get personalised Kundli, daily Rashifal, Panchang and auspicious Muhurat." },
    hi: { title: "वैदिक ज्योतिष", description: "व्यक्तिगत कुंडली, दैनिक राशिफल, पंचांग और शुभ मुहूर्त प्राप्त करें।" },
    gradient: "from-[#F5F0FF] to-[#FDF0F9]", darkGradient: "dark:from-[#1A1230] dark:to-[#2A0E20]",
    ring: "#C4AAEE", glow: "rgba(196,170,238,0.18)", Illustration: AstrologyIllustration,
  },
  {
    en: { title: "Live Puja Streaming", description: "Watch your puja performed live and receive divine blessings in real time." },
    hi: { title: "लाइव पूजा स्ट्रीमिंग", description: "अपनी पूजा को लाइव देखें और वास्तविक समय में दिव्य आशीर्वाद प्राप्त करें।" },
    gradient: "from-[#FFF8EC] to-[#FFF0F8]", darkGradient: "dark:from-[#251808] dark:to-[#2A0E20]",
    ring: "#D4820A", glow: "rgba(212,130,10,0.15)", Illustration: LiveStreamIllustration,
  },
  {
    en: { title: "Prasad Delivery", description: "Receive temple-blessed prasad delivered straight to your doorstep." },
    hi: { title: "प्रसाद डिलीवरी", description: "मंदिर से आशीर्वादित प्रसाद सीधे आपके दरवाजे पर पाएं।" },
    gradient: "from-[#FFFAEC] to-[#FFF5F0]", darkGradient: "dark:from-[#251A04] dark:to-[#2A1208]",
    ring: "#B8860B", glow: "rgba(184,134,11,0.15)", Illustration: PrasadIllustration,
  },
];

// ─── Hero ────────────────────────────────────────────────────────────────────

export function Hero() {
  const [current, setCurrent] = useState(0);
  const { t, lang } = useLang();
  const [statsData, setStatsData] = useState({ temples: 0, bookings: 0, cities: 0 });

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 3400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setStatsData({
            temples: resData.data.temples,
            bookings: resData.data.bookings,
            cities: resData.data.cities,
          });
        }
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  const statsList = [
    { val: `${statsData.temples > 0 ? statsData.temples : 500}+`, en: "Temples", hi: "मंदिर" },
    { val: `${statsData.bookings > 0 ? statsData.bookings + 500 : 500}+`, en: "Bookings", hi: "बुकिंग" },
    { val: `${statsData.cities > 0 ? statsData.cities : 50}+`, en: "Cities", hi: "शहर" },
  ];

  const slide = slides[current];
  const { Illustration } = slide;
  const slideText = lang === "hi" ? slide.hi : slide.en;

  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex items-center">

      {/* ── Background vector decorations ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

        {/* Rotating mandala */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-[650px] h-[650px] opacity-[0.25] dark:opacity-[0.18]"
        >
          <svg viewBox="0 0 200 200" fill="none">
            <defs>
              <linearGradient id="mgr" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC9DD4" />
                <stop offset="50%" stopColor="#C4AAEE" />
                <stop offset="100%" stopColor="#94AAEE" />
              </linearGradient>
            </defs>
            {[85, 65, 45, 28, 14].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} stroke="url(#mgr)" strokeWidth="0.5" fill="none" />
            ))}
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M100 100 Q108 72 100 50 Q92 72 100 100"
                transform={`rotate(${i * 15} 100 100)`}
                stroke="url(#mgr)" strokeWidth="0.4" fill="none" />
            ))}
          </svg>
        </motion.div>

        {/* Om symbols */}
        <OmSymbol x="2%" y="55%" size={120} opacity={0.06} delay={0} />
        <OmSymbol x="82%" y="10%" size={90} opacity={0.05} delay={10} />

        {/* Temple bells */}
        <TempleBell x="3%" y="3%" size={55} opacity={0.2} delay={0} />
        <TempleBell x="88%" y="5%" size={45} opacity={0.18} delay={0.8} />
        <TempleBell x="93%" y="45%" size={40} opacity={0.14} delay={1.5} />
        <TempleBell x="1%" y="70%" size={35} opacity={0.12} delay={2.2} />

        {/* Lotus flowers */}
        <FloatingLotus x="75%" y="72%" size={90} opacity={0.13} delay={0} />
        <FloatingLotus x="8%" y="20%" size={70} opacity={0.11} delay={1.5} />
        <FloatingLotus x="85%" y="28%" size={55} opacity={0.1} delay={3} />

        {/* Diyas */}
        <FloatingDiya x="18%" y="78%" size={50} opacity={0.18} delay={0.5} />
        <FloatingDiya x="72%" y="15%" size={40} opacity={0.15} delay={2} />
        <FloatingDiya x="55%" y="80%" size={38} opacity={0.13} delay={3.5} />

        {/* Marigold garlands */}
        <MarigoldGarland x="0%" y="0%" opacity={0.12} />
        <MarigoldGarland x="35%" y="95%" opacity={0.1} />

        {/* Soft color blobs */}
        <div className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full opacity-[0.25] dark:opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #EC9DD4, transparent 70%)" }} />
        <div className="absolute -bottom-24 -right-16 w-[400px] h-[400px] rounded-full opacity-[0.25] dark:opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #94AAEE, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.15]"
          style={{ background: "radial-gradient(circle, #C4AAEE, transparent 70%)" }} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left: Text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4"
            >
              {t("Where devotion matters more than distance,", "जहाँ श्रद्धा दूरी से अधिक मायने रखती है,")}
              <br />
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #EC9DD4, #C4AAEE, #94AAEE)" }}>
                {t("and every sincere prayer reaches the Divine.", "और हर सच्ची प्रार्थना ईश्वर तक पहुँचती है।")}
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="font-sanskrit text-lg text-saffron mb-6 leading-relaxed">
              सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।
              <br />
              सर्वे भद्राणि पश्यन्तु, मा कश्चिद् दु:खभाग् भवेत् ॥
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl leading-relaxed font-medium">
              {t(
                "Book authentic temple pujas, sacred offerings, and prasadam from trusted temples across India. Experience divine blessings wherever you are with ePoojapaath.",
                "भारत के विश्वसनीय मंदिरों से प्रामाणिक पूजा, पवित्र चढ़ावा और प्रसाद बुक करें। ePoojapaath के साथ आप जहाँ भी हों, दिव्य आशीर्वाद का अनुभव करें।"
              )}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-4 mb-8">
              <Link href="/puja" className="btn-saffron text-base px-8 py-3 font-semibold tracking-wide">{t("BOOK PUJA 🪔", "पूजा बुक करें 🪔")}</Link>
              <Link href="/chadawa" className="btn-outline-lotus text-base px-8 py-3 font-semibold tracking-wide">{t("BOOK CHADAVA 🌸", "चढ़ावा अर्पण करें 🌸")}</Link>
            </motion.div>

            {/* Infinite Horizontal Auto-Scrolling Ticker (Religious chants) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="relative w-full max-w-lg overflow-hidden py-3 px-4 rounded-2xl bg-saffron/5 border border-saffron/10 mb-10 shadow-[0_0_15px_rgba(212,130,10,0.02)]"
            >
              <div className="flex whitespace-nowrap animate-marquee gap-8 text-sm font-semibold text-saffron font-sanskrit tracking-wider">
                <span>ॐ गं गणपतये नमः॥ • वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥ • ॐ ह्रीं श्रीं लक्ष्मीभ्यो नमः॥ • ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये। धनधान्यसमृद्धिं मे देहि दापय स्वाहा॥ • ॐ सर्वकार्यसिद्धिं कुरु कुरु स्वाहा॥ • ॐ नमः शिवाय॥ • ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥ • </span>
                <span>ॐ गं गणपतये नमः॥ • वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥ • ॐ ह्रीं श्रीं लक्ष्मीभ्यो नमः॥ • ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये। धनधान्यसमृद्धिं मे देहि दापय स्वाहा॥ • ॐ सर्वकार्यसिद्धिं कुरु कुरु स्वाहा॥ • ॐ नमः शिवाय॥ • ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥ • </span>
                <span>ॐ गं गणपतये नमः॥ • वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥ • ॐ ह्रीं श्रीं लक्ष्मीभ्यो नमः॥ • ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये। धनधान्यसमृद्धिं मे देहि दापय स्वाहा॥ • ॐ सर्वकार्यसिद्धिं कुरु कुरु स्वाहा॥ • ॐ नमः शिवाय॥ • ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥ • </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-8">
              {statsList.map(({ val, en, hi }) => (
                <div key={en}>
                  <div className="font-heading text-3xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #D4820A, #EC9DD4)" }}>
                    {val}
                  </div>
                  <div className="text-muted-foreground text-sm mt-0.5">{t(en, hi)}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Slide cards with SVG illustrations */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex flex-col items-center">

            <div className="relative w-full max-w-2xl mx-auto" style={{ height: 520 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 60, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className={`absolute inset-0 rounded-3xl overflow-hidden`}
                >
                  {/* SVG Illustration fills top 70% */}
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 px-2 pt-2">
                      <Illustration />
                    </div>

                    {/* Text overlay at bottom */}
                    <div className="px-6 pb-6 pt-2"
                      style={{ background: `linear-gradient(to top, ${slide.glow.replace("0.15", "0.35").replace("0.18", "0.35")}, transparent)` }}>
                      <h3 className="font-heading text-2xl mb-2" style={{ color: slide.ring }}>
                        {slideText.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {slideText.description}
                      </p>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-5">
              {slides.map((s, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? 24 : 8, height: 8,
                    background: i === current
                      ? `linear-gradient(90deg, ${slides[i].ring}, #C4AAEE)`
                      : "rgba(196,170,238,0.25)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <p className="text-muted-foreground text-xs mt-3 tabular-nums">
              {current + 1} / {slides.length}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
