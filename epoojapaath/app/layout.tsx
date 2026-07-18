import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";
import type { Viewport } from "next";
import Script from "next/script";
import { FacebookPixel } from "@/components/shared/FacebookPixel";

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "ePoojapaath — India's Devotional Platform",
    template: "%s | ePoojapaath",
  },
  description: "Book online pujas, Chadawa offerings, and discover temples across India. Connect with the divine from wherever you are.",
  keywords: ["puja booking", "online puja", "temple", "chadawa", "Hindu", "epoojapaath"],
  authors: [{ name: "ePoojapaath Team" }],
  creator: "ePoojapaath",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "ePoojapaath",
    title: "ePoojapaath — India's Devotional Platform",
    description: "Book online pujas, Chadawa offerings, and discover temples across India.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ePoojapaath — India's Devotional Platform",
    description: "Book online pujas, Chadawa offerings, and discover temples across India.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            ${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ? `fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');` : ""}
            fbq('init', '1077299721847659');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1077299721847659&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <FacebookPixel />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontFamily: "Hind, sans-serif" },
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
