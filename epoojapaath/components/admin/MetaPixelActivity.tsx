"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import {
  Activity,
  Megaphone,
  IndianRupee,
  Sparkles,
  TrendingUp,
  Percent,
  Eye,
  MousePointer,
  Users,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ShoppingBag,
  Layers,
} from "lucide-react";

export function MetaPixelActivity() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/meta-insights")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setData(d.data);
        }
      })
      .catch((err) => console.error("Error loading Meta insights:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card-devotional p-6 text-center animate-pulse space-y-4">
        <div className="h-6 bg-muted/40 rounded w-1/3 mx-auto" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-muted/30 rounded-xl" />
          <div className="h-24 bg-muted/30 rounded-xl" />
          <div className="h-24 bg-muted/30 rounded-xl" />
          <div className="h-24 bg-muted/30 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { pixelId, pixelActive, metaApi, conversions, pixelEvents, recentActivity } = data;

  return (
    <div className="space-y-6">
      {/* ── Meta Pixel & Campaign Status Banner ── */}
      <div className="bg-gradient-to-r from-[#1877F2]/10 via-purple-500/10 to-saffron/10 border border-[#1877F2]/30 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center">
              <Activity size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-foreground">Meta Pixel Activity & Tracking</h3>
                {pixelActive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Live Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <AlertCircle size={10} /> Simulation Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pixel ID: <span className="font-mono font-semibold text-foreground">{pixelId}</span> · Tracking active bookings, drop-offs & retargeting conversions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-background/80 px-4 py-2 rounded-xl border border-border">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Meta Ads Revenue</p>
              <p className="font-heading text-lg text-saffron font-bold">{formatCurrency(conversions.metaRevenue)}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Conversion Rate</p>
              <p className="font-heading text-lg text-green-600 dark:text-green-400 font-bold">{conversions.conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Meta Ads Spend & Lead Insights Cards ── */}
      {metaApi && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <Megaphone size={18} className="text-[#1877F2]" /> Meta Campaign Insights
              {metaApi.simulated && (
                <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded border border-amber-500/20">
                  Simulated Demo Data
                </span>
              )}
            </h4>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-devotional border-l-4 border-l-[#1877F2] p-4">
              <div className="flex items-center justify-between text-[#1877F2] mb-1">
                <span className="text-xs font-semibold text-muted-foreground">Total Ad Spend</span>
                <IndianRupee size={18} />
              </div>
              <p className="font-heading text-2xl text-foreground font-bold">{formatCurrency(metaApi.spend)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">This month campaign budget</p>
            </div>

            <div className="card-devotional border-l-4 border-l-purple-500 p-4">
              <div className="flex items-center justify-between text-purple-500 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">Leads Generated</span>
                <Sparkles size={18} />
              </div>
              <p className="font-heading text-2xl text-foreground font-bold">{metaApi.leads}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Devotees who booked or enquired</p>
            </div>

            <div className="card-devotional border-l-4 border-l-green-500 p-4">
              <div className="flex items-center justify-between text-green-500 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">Cost Per Lead (CPL)</span>
                <TrendingUp size={18} />
              </div>
              <p className="font-heading text-2xl text-foreground font-bold">{formatCurrency(metaApi.cpl)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Avg cost per confirmed devotee</p>
            </div>

            <div className="card-devotional border-l-4 border-l-amber-500 p-4">
              <div className="flex items-center justify-between text-amber-500 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">Click Rate (CTR)</span>
                <Percent size={18} />
              </div>
              <p className="font-heading text-2xl text-foreground font-bold">{metaApi.ctr}%</p>
              <p className="text-[10px] text-muted-foreground mt-1">{metaApi.clicks.toLocaleString()} total ad clicks</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Meta Pixel Funnel Events Breakdown ── */}
      <div className="card-devotional p-5">
        <h4 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-saffron" />
          Meta Pixel Event Funnel Breakdown
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <div className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1 mb-1">
              <Eye size={12} className="text-[#1877F2]" /> PageView
            </div>
            <p className="font-heading text-xl font-bold text-foreground">{pixelEvents.pageView.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Total visits</p>
          </div>

          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <div className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1 mb-1">
              <Layers size={12} className="text-purple-500" /> ViewContent
            </div>
            <p className="font-heading text-xl font-bold text-foreground">{pixelEvents.viewContent.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Viewed Puja/Chadawa</p>
          </div>

          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <div className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1 mb-1">
              <MousePointer size={12} className="text-amber-500" /> InitiateCheckout
            </div>
            <p className="font-heading text-xl font-bold text-foreground">{pixelEvents.initiateCheckout.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Opened booking form</p>
          </div>

          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <div className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1 mb-1">
              <Sparkles size={12} className="text-green-500" /> Lead
            </div>
            <p className="font-heading text-xl font-bold text-foreground">{pixelEvents.lead}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Submitted Sankalp</p>
          </div>

          <div className="bg-muted/30 p-3 rounded-xl border border-border/50 col-span-2 md:col-span-1">
            <div className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1 mb-1">
              <ShoppingBag size={12} className="text-saffron" /> Purchase
            </div>
            <p className="font-heading text-xl font-bold text-saffron">{pixelEvents.purchase}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Successful Payments</p>
          </div>
        </div>
      </div>

      {/* ── Recent Meta Ads Conversions Activity Table ── */}
      <div className="card-devotional p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <Users size={18} className="text-[#1877F2]" />
              Recent Meta Ads Devotee Bookings
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bookings originating from Facebook / Instagram Ads campaigns
            </p>
          </div>
          <span className="text-xs bg-[#1877F2]/10 text-[#1877F2] font-semibold px-3 py-1 rounded-full border border-[#1877F2]/20">
            {recentActivity.length} Conversions Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          {recentActivity.length === 0 ? (
            <div className="py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/80">
              <Activity className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2 animate-pulse" />
              <p className="font-heading text-sm text-foreground">No Meta Ads Conversions Logged Yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                When devotees click your Meta Ads / Retargeting campaigns and complete a booking, their real conversion activity, campaign name, and payment details will automatically appear here live.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground uppercase font-semibold text-[10px]">
                  <th className="p-2.5">Devotee Name</th>
                  <th className="p-2.5">Service Offered</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Source / Campaign</th>
                  <th className="p-2.5">Payment Status</th>
                  <th className="p-2.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentActivity.map((item: any, idx: number) => (
                  <tr key={item._id || idx} className="hover:bg-muted/30 transition">
                    <td className="p-2.5 font-bold text-foreground">{item.devoteeName}</td>
                    <td className="p-2.5 text-muted-foreground">
                      <span className="text-foreground font-medium">{item.serviceName}</span>
                      <span className="text-[10px] text-saffron uppercase font-bold ml-1.5">({item.serviceType})</span>
                    </td>
                    <td className="p-2.5 font-heading font-bold text-saffron">{formatCurrency(item.amount)}</td>
                    <td className="p-2.5">
                      <span className="inline-flex items-center gap-1 bg-[#1877F2]/10 text-[#1877F2] font-semibold px-2 py-0.5 rounded text-[10px]">
                        {item.utmSource || "Meta Ads"}
                      </span>
                      {item.utmCampaign && (
                        <span className="text-[10px] text-muted-foreground block mt-0.5 truncate max-w-[150px]">
                          {item.utmCampaign}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.paymentStatus === "paid"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                      }`}>
                        {item.paymentStatus === "paid" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                        {item.paymentStatus === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-muted-foreground">{formatDateShort(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
