"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  Users,
  BookOpen,
  FileText,
  Megaphone,
  Settings,
  Flower2,
  ScrollText,
  ClipboardList,
  Mail,
  CalendarDays,
  IndianRupee,
  Menu,
  X,
} from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const adminNav = [
  { href: "/admin/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/temples",         label: "Temples",          icon: Landmark        },
  { href: "/admin/temple-requests", label: "Temple Requests",  icon: ClipboardList   },
  { href: "/admin/pujas",           label: "Puja Manager",     icon: ScrollText      },
  { href: "/admin/chadawa",         label: "Chadawa Manager",  icon: Flower2         },
  { href: "/admin/users",           label: "Users",            icon: Users           },
  { href: "/admin/bookings",        label: "Bookings",         icon: BookOpen        },
  { href: "/admin/subscriptions",   label: "Subscriptions",    icon: CalendarDays    },
  { href: "/admin/payments",        label: "Payments",         icon: IndianRupee     },
  { href: "/admin/blog",            label: "Blog Manager",     icon: FileText        },
  { href: "/admin/ads",             label: "Ads Manager",      icon: Megaphone       },
  { href: "/admin/enquiries",       label: "Enquiries",        icon: Mail            },
  { href: "/admin/settings",        label: "Settings",         icon: Settings        },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const activeNav = adminNav.find((item) => item.href === pathname) || adminNav[0];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* ── Mobile & Tablet Sticky Top Header ── */}
      <header className="lg:hidden sticky top-0 z-40 bg-card-bg/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-foreground bg-muted/40 hover:bg-saffron/10 hover:text-saffron transition-all border border-border/60 active:scale-95"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image src="/epoojalogo.png" alt="ePoojapaath" width={30} height={30} className="object-contain h-7 w-auto" />
            <span className="font-heading text-base text-saffron leading-none">ePoojapaath</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 bg-saffron/10 text-saffron rounded-full border border-saffron/20">
            {activeNav.label}
          </span>
        </div>
      </header>

      {/* ── Mobile Overlay Backdrop ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/65 z-50 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* ── Mobile Slide-Over Drawer ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card-bg border-r border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/epoojalogo.png" alt="ePoojapaath" width={32} height={32} className="object-contain h-8 w-auto" />
            <div>
              <span className="font-heading text-base text-saffron block leading-none">ePoojapaath</span>
              <span className="text-[10px] text-muted-foreground font-semibold">Admin Panel</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
            aria-label="Close Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-saffron text-white font-bold"
                    : "text-muted-foreground hover:bg-saffron/10 hover:text-saffron"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3 bg-muted/10">
          <AdminLogoutButton />
          <p className="text-[10px] text-muted-foreground/60 text-center">© 2025 ePoojapaath Admin</p>
        </div>
      </div>

      {/* ── Desktop Static Sidebar (lg screens) ── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 bg-card-bg border-r border-border">
        <div className="px-5 py-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/epoojalogo.png" alt="ePoojapaath" width={36} height={36} className="object-contain h-9 w-auto" />
            <span className="font-heading text-lg text-saffron leading-none">ePoojapaath</span>
          </Link>
          <p className="text-muted-foreground text-xs mt-2 pl-0.5 font-medium">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-saffron text-white font-bold"
                    : "text-muted-foreground hover:bg-saffron/10 hover:text-saffron font-medium"
                }`}
              >
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3 bg-muted/10">
          <AdminLogoutButton />
          <p className="text-xs text-muted-foreground/40 text-center">© 2025 ePoojapaath</p>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 lg:pl-64 w-full bg-background overflow-x-hidden min-w-0">
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
