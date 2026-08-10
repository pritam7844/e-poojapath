import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.122 2.14c1.872.506 9.378.506 9.378.506s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer className="bg-[#1E1035] dark:bg-[#0A0603] text-white/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center transition-transform hover:scale-105 duration-300">
                <Image
                  src="/epoojalogo.png"
                  alt="ePoojapaath"
                  width={200}
                  height={66}
                  className="object-contain h-16 w-auto"
                />
              </div>
            </div>
            <p className="font-sanskrit text-sm text-white/55 mb-4">ॐ सर्वे भवन्तु सुखिनः</p>
            <p className="text-sm leading-relaxed text-white/55">
              India&apos;s trusted platform for online Puja booking, Chadawa offerings,
              and temple discovery. Connecting devotees with divine grace.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: SocialIcons.Instagram, href: "https://www.instagram.com/epoojapaath", label: "Instagram" },
                { Icon: SocialIcons.Facebook,  href: "https://www.facebook.com/epoojapaath", label: "Facebook" },
                { Icon: SocialIcons.YouTube,   href: "https://www.youtube.com/@epoojapaath", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-saffron/25 flex items-center justify-center hover:bg-saffron hover:border-saffron transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-saffron text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Temples", href: "/temples" },
                { label: "Book Puja", href: "/puja" },
                { label: "Chadawa", href: "/chadawa" },
                { label: "Blog", href: "/blog" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Astrology", href: "/astro" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-saffron transition-colors duration-200">
                    🪷 {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-saffron text-lg mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-saffron cursor-pointer transition-colors">🛕 Online Puja Booking</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">🌸 Chadawa Offerings</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">🗺️ Temple Discovery</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">🔮 Vedic Astrology Tools</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">📿 Rashifal & Panchang</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">📦 Prasad Delivery</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">📹 Live Puja Streaming</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-saffron text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={20} className="text-saffron mt-0.5 shrink-0" />
                <span>Dhaleswar, Agartala, West Tripura, Pin – 799007</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={20} className="text-saffron shrink-0" />
                <a href="https://wa.me/919165057755" target="_blank" rel="noopener noreferrer" className="hover:text-saffron transition-colors">
                  +91 91650 57755 (Call / WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={20} className="text-saffron shrink-0" />
                <a href="mailto:support@epoojapaath.com" className="hover:text-saffron transition-colors">
                  support@epoojapaath.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock size={20} className="text-saffron shrink-0" />
                <span>Mon – Sat, 10 AM – 6 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/35">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p>© 2025 ePoojapaath. Made with 🙏 in India.</p>
            <div className="flex items-center gap-2">
              {/* Green Trust Shield */}
              <svg viewBox="0 0 24 24" width="25" height="25" xmlns="http://www.w3.org/2000/svg" className="shrink-0 select-none">
                <path d="M12 2L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-3z" fill="#10B981" />
                <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902Z" fill="#FFFFFF" transform="translate(6, 5.5) scale(0.5)" />
              </svg>
              {/* Razorpay Logo for Light Footers */}
              <img src="https://badges.razorpay.com/badge-light.png" alt="Razorpay Protected" className="h-8 w-auto" />
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-saffron transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-saffron transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
