import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 pt-20 pb-8 flex-grow w-full relative z-10">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
