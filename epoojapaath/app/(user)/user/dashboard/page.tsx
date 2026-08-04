import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { getUserBookings } from "@/services/booking.service";
import { UserDashboardClient } from "@/components/user/UserDashboardClient";
import type { IBooking } from "@/types";

export default async function UserDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await getUserBookings(session.user.id!).catch(() => []) as (IBooking & { _id: string })[];

  return (
    <DashboardShell title="">
      <UserDashboardClient 
        userName={session.user.name || "Devotee"} 
        initialBookings={JSON.parse(JSON.stringify(bookings))} 
      />
    </DashboardShell>
  );
}
