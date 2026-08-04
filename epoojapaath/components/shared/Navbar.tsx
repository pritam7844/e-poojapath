"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { useLang } from "@/contexts/LanguageContext";

const NAV_LINKS = [
  { en: "Home",    hi: "होम",      href: "/" },
  { en: "Temples", hi: "मंदिर",    href: "/temples" },
  { en: "Puja",    hi: "पूजा",     href: "/puja" },
  { en: "Chadawa", hi: "चढ़ावा",   href: "/chadawa" },
  { en: "Blog",    hi: "ब्लॉग",    href: "/blog" },
  { en: "Astro",   hi: "ज्योतिष", href: "/astro" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const { lang, toggle, t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardHref =
    session?.user?.role === "admin" ? "/admin/dashboard" :
      "/user/dashboard";

  const navLinks = session
    ? [
        { en: "Home", hi: "होम", href: "/" },
        { en: "Temples", hi: "मंदिर", href: "/temples" },
        { en: "Puja", hi: "पूजा", href: "/puja" },
        { en: "Chadawa", hi: "चढ़ावा", href: "/chadawa" },
        { en: "Blog", hi: "ब्लॉग", href: "/blog" },
        { en: "Astro", hi: "ज्योतिष", href: "/astro" },
        { 
          en: session?.user?.role === "admin" ? "Dashboard" : "My Booking", 
          hi: session?.user?.role === "admin" ? "डैशबोर्ड" : "मेरी बुकिंग", 
          href: dashboardHref 
        },
      ]
    : [
        { en: "Home", hi: "होम", href: "/" },
        { en: "Temples", hi: "मंदिर", href: "/temples" },
        { en: "Puja", hi: "पूजा", href: "/puja" },
        { en: "Chadawa", hi: "चढ़ावा", href: "/chadawa" },
        { en: "Blog", hi: "ब्लॉग", href: "/blog" },
        { en: "Astro", hi: "ज्योतिष", href: "/astro" },
      ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      (scrolled || mobileOpen) ? "backdrop-blur-md bg-background/95 shadow-sm border-b border-border" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
          <Image
            src="/epoojalogo.png"
            alt="ePoojapaath"
            width={56}
            height={56}
            className="object-contain h-14 md:h-16 w-auto"
            priority
          />
          <span className="font-heading text-xl md:text-2xl text-saffron leading-none">ePoojapaath</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-3.5 lg:gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-saffron font-medium transition-colors duration-200 relative group text-xs lg:text-sm"
            >
              {t(link.en, link.hi)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggle}
            title={lang === "en" ? "Switch to Hindi" : "Switch to English"}
            className="flex items-center gap-1 border border-border rounded-full px-3 py-1.5 text-xs font-semibold hover:border-saffron hover:text-saffron transition-all duration-200"
          >
            <span className={lang === "en" ? "text-saffron" : "text-muted-foreground"}>EN</span>
            <span className="text-muted-foreground/40">|</span>
            <span className={lang === "hi" ? "text-saffron font-sanskrit" : "text-muted-foreground font-sanskrit"}>हि</span>
          </button>
          <ThemeToggle />

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-foreground hover:text-saffron transition-colors"
              >
                <div className="w-9 h-9 flex items-center justify-center text-saffron font-bold text-xl">
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
                <ChevronDown size={20} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-12 w-48 card-devotional rounded-xl shadow-xl py-2"
                  >
                    <Link href={dashboardHref} className="flex items-center gap-2 px-4 py-2 hover:bg-saffron/10 text-foreground transition-colors text-sm">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link href="/user/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-saffron/10 text-foreground transition-colors text-sm">
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-lotus-red transition-colors text-sm"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-outline-gold py-2 px-4 text-sm">Login</Link>
              <Link href="/register" className="btn-saffron py-2 px-4 text-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile — lang toggle + theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex items-center gap-1 border border-border rounded-full px-2.5 py-1 text-xs font-semibold hover:border-saffron transition-all"
          >
            <span className={lang === "en" ? "text-saffron" : "text-muted-foreground"}>EN</span>
            <span className="text-muted-foreground/40">|</span>
            <span className={lang === "hi" ? "text-saffron font-sanskrit" : "text-muted-foreground font-sanskrit"}>हि</span>
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground p-1"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/96 backdrop-blur-md border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {session && (
                <div className="mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3 px-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-saffron/15 flex items-center justify-center text-saffron font-bold border border-saffron/30">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground font-semibold truncate">{session.user?.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-foreground hover:text-saffron py-2 px-3 rounded-lg hover:bg-saffron/8 transition-colors text-sm"
                    >
                      <LayoutDashboard size={22} className="text-saffron" /> Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-foreground hover:text-saffron py-2 px-3 rounded-lg hover:bg-saffron/8 transition-colors text-sm"
                    >
                      <User size={22} className="text-saffron" /> Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 text-lotus-red py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-left"
                    >
                      <LogOut size={22} /> Sign Out
                    </button>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground hover:text-saffron font-medium py-2.5 px-3 rounded-lg hover:bg-saffron/8 border-b border-border/50 last:border-0 transition-colors"
                >
                  {t(link.en, link.hi)}
                </Link>
              ))}
              {!session && (
                <div className="flex gap-3 pt-3">
                  <Link href="/login" className="btn-outline-gold text-sm flex-1 text-center">Login</Link>
                  <Link href="/register" className="btn-saffron text-sm flex-1 text-center">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
