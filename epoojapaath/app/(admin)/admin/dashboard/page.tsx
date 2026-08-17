import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Blog from "@/models/Blog";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Landmark, Users, BookOpen, IndianRupee, Megaphone, FileText, HandCoins, TrendingUp, Percent, Eye, Sparkles, AlertCircle } from "lucide-react";
import { MetaPixelActivity } from "@/components/admin/MetaPixelActivity";

async function getStats() {
  await connectDB();
  const [temples, users, bookings, blogs] = await Promise.all([
    Temple.countDocuments(),
    User.countDocuments(),
    Booking.countDocuments(),
    Blog.countDocuments({ status: "published" }),
  ]);
  const revenue = await Booking.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return {
    temples,
    users,
    bookings,
    blogs,
    revenue: revenue[0]?.total || 0,
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const stats = await getStats();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="font-heading text-3xl text-foreground mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session.user.name} 🙏</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Temples",  value: stats.temples,                icon: <Landmark     size={22} />, color: "border-l-saffron"       },
          { label: "Total Users",    value: stats.users,                  icon: <Users        size={22} />, color: "border-l-lotus-blue"    },
          { label: "Total Bookings", value: stats.bookings,               icon: <BookOpen     size={22} />, color: "border-l-lotus-purple"  },
          { label: "Total Revenue",  value: formatCurrency(stats.revenue),icon: <IndianRupee  size={22} />, color: "border-l-green-500"     },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`card-devotional border-l-4 ${color}`}>
            <div className="mb-3 text-saffron">{icon}</div>
            <div className="font-heading text-2xl text-foreground">{value}</div>
            <div className="text-muted-foreground text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Meta Pixel & Ads Activity Breakdown */}
      <MetaPixelActivity />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-devotional">
          <h2 className="font-heading text-xl text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Manage Temples", href: "/admin/temples",  icon: <Landmark  size={18} /> },
              { label: "Manage Users",   href: "/admin/users",    icon: <Users     size={18} /> },
              { label: "View Bookings",  href: "/admin/bookings", icon: <BookOpen  size={18} /> },
              { label: "Manage Ads",     href: "/admin/ads",      icon: <Megaphone size={18} /> },
              { label: "Blog Manager",   href: "/admin/blog",     icon: <FileText  size={18} /> },
              { label: "Revenue",        href: "/admin/bookings", icon: <HandCoins size={18} /> },
            ].map(({ label, href, icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 p-3 bg-background hover:bg-saffron/5 rounded-xl border border-deep-gold/20 hover:border-saffron/30 transition-all">
                <span className="text-saffron">{icon}</span>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card-devotional">
          <h2 className="font-heading text-xl text-foreground mb-4">Platform Status</h2>
          <div className="space-y-3">
            {[
              { label: "Published Blogs",   value: stats.blogs,    status: "active" },
              { label: "Pending Temples",   value: "—",            status: "pending" },
              { label: "Active Campaigns",  value: "—",            status: "active" },
            ].map(({ label, value, status }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-deep-gold/10">
                <span className="text-sm text-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
