import { SessionProvider } from "next-auth/react";
import { AIChat } from "@/components/ai-chat/AIChat";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";
import { MobileBookNow } from "@/components/shared/MobileBookNow";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <MobileBookNow />
      <AIChat />
      <WhatsAppWidget />
    </SessionProvider>
  );
}
