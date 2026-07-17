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
import { getAdAccountInsights } from "@/services/meta.service";

async function getStats() {
  await connectDB();
  const [temples, users, bookings, blogs, metaResult] = await Promise.all([
    Temple.countDocuments(),
    User.countDocuments(),
    Booking.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    getAdAccountInsights("this_month"),
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
    meta: metaResult.success && metaResult.data ? { simulated: metaResult.simulated, data: metaResult.data } : null,
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  const stats = await getStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="font-heading text-3xl text-foreground mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {session.user.name} 🙏</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
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

      {/* Meta Ads Campaign Insights */}
      {stats.meta && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl text-foreground flex items-center gap-2">
              <Megaphone className="text-saffron" size={20} />
              Meta Ads Performance (This Month)
              {stats.meta.simulated && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-md border border-yellow-500/20">
                  Simulated
                </span>
              )}
            </h2>
            {stats.meta.simulated && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle size={14} className="text-yellow-600 dark:text-yellow-400" />
                Configure META_ACCESS_TOKEN in env for live stats.
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: "Ad Spend",
                value: formatCurrency(stats.meta.data.spend),
                icon: <IndianRupee size={20} />,
                color: "border-l-saffron",
              },
              {
                label: "Leads Generated",
                value: stats.meta.data.leads,
                icon: <Sparkles size={20} />,
                color: "border-l-[#EC9DD4]",
              },
              {
                label: "Cost Per Lead (CPL)",
                value: formatCurrency(stats.meta.data.cpl),
                icon: <TrendingUp size={20} />,
                color: "border-l-green-500",
              },
              {
                label: "Click-Through Rate (CTR)",
                value: `${stats.meta.data.ctr}%`,
                icon: <Percent size={20} />,
                color: "border-l-[#94AAEE]",
              },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className={`card-devotional border-l-4 ${color}`}>
                <div className="mb-2 text-saffron">{icon}</div>
                <div className="font-heading text-xl text-foreground">{value}</div>
                <div className="text-muted-foreground text-xs">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-muted/35 p-3 rounded-2xl border border-border/50">
            <div className="text-center p-2">
              <div className="text-xs text-muted-foreground">Impressions</div>
              <div className="font-heading text-sm text-foreground">{stats.meta.data.impressions.toLocaleString()}</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xs text-muted-foreground">Link Clicks</div>
              <div className="font-heading text-sm text-foreground">{stats.meta.data.clicks.toLocaleString()}</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xs text-muted-foreground">Reach</div>
              <div className="font-heading text-sm text-foreground">{stats.meta.data.reach.toLocaleString()}</div>
            </div>
            <div className="text-center p-2 flex flex-col justify-center items-center">
              <div className="text-xs text-muted-foreground">Ad Account Status</div>
              <div className="text-xs font-semibold text-green-600 flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
              </div>
            </div>
          </div>
        </div>
      )}

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
