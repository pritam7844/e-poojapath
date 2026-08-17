import { SessionProvider } from "next-auth/react";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </SessionProvider>
  );
}
