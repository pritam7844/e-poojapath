import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Fixed brand colors (absolute — never flip with theme)
        saffron: "#D4820A",
        "deep-gold": "#B8860B",
        // Logo-accurate lotus palette — pink → lavender → periwinkle blue
        "lotus-pink": "#EC9DD4",     // outer/lower petals
        "lotus-purple": "#C4AAEE",   // mid-petal lavender bridge
        "lotus-blue": "#94AAEE",     // inner/top periwinkle petals
        "lotus-red": "#E05580",      // deep rose accent
        cream: "#FDF8F0",
        dark: "#0F0A05",

        // CSS-variable tokens — auto-flip in dark mode
        "card-bg": "var(--card-bg)",
        "surface": "var(--surface)",
        "muted-text": "var(--muted-color)",

        // Shadcn/radix tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        sanskrit: ["var(--font-sanskrit)", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px #D4820A40" },
          "50%": { boxShadow: "0 0 25px #D4820A80" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 1.5s infinite",
        "spin-slow": "spin 120s linear infinite",
      },
      backgroundImage: {
        // Gold gradient from logo Om + swirl decoration
        "gold-gradient": "linear-gradient(135deg, #D4820A, #B8860B)",
        // Lotus petal gradient — pink → lavender → periwinkle (matches logo exactly)
        "lotus-gradient": "linear-gradient(135deg, #EC9DD4, #C4AAEE, #94AAEE)",
        // Top-to-bottom petal flow (blue at top, pink at base — as in the logo)
        "logo-gradient": "linear-gradient(160deg, #94AAEE 0%, #C4AAEE 50%, #EC9DD4 100%)",
        // Pink → gold blend for devotional warm highlights
        "divine-gradient": "linear-gradient(135deg, #EC9DD4, #D4820A)",
        "cream-gradient": "linear-gradient(135deg, #FDF8F0, #FFF5E1)",
        "dark-mandala": "radial-gradient(ellipse at center, #1A0E02 0%, #0F0A05 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
