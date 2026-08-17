"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { devToast } from "@/lib/toast";
import { formatDateShort } from "@/lib/utils";
import type { IAd } from "@/types";
import { MetaPixelActivity } from "@/components/admin/MetaPixelActivity";

type AdRow = IAd & { _id: string };

const PLACEMENTS = [
  { value: "hero",               label: "Hero Banner"         },
  { value: "sidebar",            label: "Sidebar"             },
  { value: "footer",             label: "Footer"              },
  { value: "between-sections",   label: "Between Sections"    },
];

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getEmptyForm = () => ({
  title: "",
  imageUrl: "",
  linkUrl: "",
  placement: "hero",
  startDate: getTodayString(),
  endDate: "",
  targetType: "all" as "all" | "selected_pujas",
  targetPujas: [] as string[],
});

export default function AdminAdsPage() {
  const [ads,     setAds]     = useState<AdRow[]>([]);
  const [pujas,   setPujas]   = useState<any[]>([]);
  const [form,    setForm]    = useState(getEmptyForm);
  const [saving,  setSaving]  = useState(false);
  const [showForm,setShowForm]= useState(false);
  const [imageSourceType, setImageSourceType] = useState<"upload" | "url">("upload");

  useEffect(() => {
    fetch("/api/admin/ads").then((r) => r.json()).then((d) => { if (d.success) setAds(d.data); });
    fetch("/api/admin/pujas").then((r) => r.json()).then((d) => { if (d.success) setPujas(d.data); });
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) {
      devToast.error("Ad image is required");
      return;
    }
    if (form.targetType === "selected_pujas" && form.targetPujas.length === 0) {
      devToast.error("Please select at least one target puja");
      return;
    }
    setSaving(true);
    try {
      let linkUrl = form.linkUrl;
      if (form.targetType === "selected_pujas" && !linkUrl.trim()) {
        linkUrl = `/puja?ids=${form.targetPujas.join(",")}`;
      }
      const payload = { ...form, linkUrl };
      const res  = await fetch("/api/admin/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        devToast.success("Ad created 📢");
        setAds((p) => [...p, data.data]);
        setShowForm(false);
        setForm(getEmptyForm());
      } else devToast.error(data.error);
    } finally { setSaving(false); }
  }

  async function toggleAd(id: string, isActive: boolean) {
    const res  = await fetch(`/api/admin/ads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
    const data = await res.json();
    if (data.success) { devToast.success("Ad updated"); setAds((p) => p.map((a) => a._id.toString() === id ? { ...a, isActive: !isActive } : a)); }
    else devToast.error(data.error);
  }

  async function deleteAd(id: string) {
    if (!confirm("Delete this ad?")) return;
    const res  = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { devToast.success("Ad deleted"); setAds((p) => p.filter((a) => a._id.toString() !== id)); }
    else devToast.error(data.error);
  }

  const columns: any[] = [
    { key: "title",     header: "Title" },
    { key: "placement", header: "Placement", render: (a: AdRow) => <Badge variant="blue">{a.placement}</Badge> },
    { key: "isActive",  header: "Status",    render: (a: AdRow) => <Badge variant={a.isActive ? "approved" : "rejected"}>{a.isActive ? "Active" : "Inactive"}</Badge> },
    { key: "clicks",    header: "Clicks",    render: (a: AdRow) => `${a.clicks || 0}` },
    { key: "impressions",header:"Impressions",render: (a: AdRow) => `${a.impressions || 0}` },
    { key: "endDate",   header: "Expires",   render: (a: AdRow) => formatDateShort(a.endDate) },
    { key: "_id",       header: "Actions",   render: (a: AdRow) => (
      <div className="flex gap-1.5">
        <Button size="sm" variant={a.isActive ? "danger" : "saffron"} onClick={() => toggleAd(a._id.toString(), a.isActive)}>
          {a.isActive ? "Pause" : "Activate"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => deleteAd(a._id.toString())}>Del</Button>
      </div>
    )},
  ];

  return (
    <DashboardShell
      title="Ads & Meta Pixel Manager"
      subtitle="Track live Meta Pixel conversion events, campaign insights, and manage ad banners."
      action={<Button onClick={() => setShowForm(!showForm)} size="sm">{showForm ? "Cancel" : "+ New Ad"}</Button>}
    >
      <div className="space-y-8 mb-8">
        <MetaPixelActivity />
      </div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-heading text-lg text-foreground mb-4">Create Ad</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ad Title"       required value={form.title}    onChange={set("title")}    placeholder="Ad title" />
            <Select label="Placement"     options={PLACEMENTS} value={form.placement} onChange={set("placement") as (e: React.ChangeEvent<HTMLSelectElement>) => void} />
            
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">Ad Image *</label>
              <div className="flex gap-4 border-b border-border/50 pb-2">
                <button
                  type="button"
                  onClick={() => setImageSourceType("upload")}
                  className={`text-xs font-bold pb-1 transition-all ${imageSourceType === "upload" ? "border-b-2 border-saffron text-saffron" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Upload Image File
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceType("url")}
                  className={`text-xs font-bold pb-1 transition-all ${imageSourceType === "url" ? "border-b-2 border-saffron text-saffron" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Paste External URL
                </button>
              </div>
              {imageSourceType === "upload" ? (
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                  folder="ads"
                />
              ) : (
                <Input
                  required
                  value={form.imageUrl}
                  onChange={set("imageUrl")}
                  placeholder="https://... (External Image URL)"
                />
              )}
            </div>

            <Input label="Link URL" value={form.linkUrl}  onChange={set("linkUrl")}  placeholder="https://... (Optional if targeting specific pujas)" className="md:col-span-2" />
            <Input label="Start Date"     required value={form.startDate} onChange={set("startDate")} type="date" />
            <Input label="End Date"       required value={form.endDate}   onChange={set("endDate")}   type="date" />

            {/* Target Placement selection */}
            <div className="md:col-span-2 space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-2">Targeting Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                    <input
                      type="radio"
                      name="targetType"
                      value="all"
                      checked={form.targetType === "all"}
                      onChange={() => setForm(p => ({ ...p, targetType: "all", targetPujas: [] }))}
                      className="w-4 h-4 accent-saffron"
                    />
                    Show Everywhere (All Pages)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                    <input
                      type="radio"
                      name="targetType"
                      value="selected_pujas"
                      checked={form.targetType === "selected_pujas"}
                      onChange={() => setForm(p => ({ ...p, targetType: "selected_pujas" }))}
                      className="w-4 h-4 accent-saffron"
                    />
                    Selected Pujas Only
                  </label>
                </div>
              </div>

              {form.targetType === "selected_pujas" && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase">Select Target Pujas *</label>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-xl p-3 bg-card space-y-2">
                    {pujas.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No pujas found to link.</p>
                    ) : (
                      pujas.map((p) => {
                        const isChecked = form.targetPujas.includes(p._id);
                        return (
                          <label key={p._id} className="flex items-start gap-2.5 text-xs text-foreground cursor-pointer select-none py-1 hover:bg-muted/40 rounded px-1.5 transition">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setForm((prev) => {
                                  const targetPujas = isChecked
                                    ? prev.targetPujas.filter((id) => id !== p._id)
                                    : [...prev.targetPujas, p._id];
                                  return { ...prev, targetPujas };
                                });
                              }}
                              className="w-3.5 h-3.5 accent-saffron mt-0.5"
                            />
                            <div>
                              <span className="font-semibold text-foreground">{p.name}</span>
                              <span className="text-muted-foreground text-[10px] block">🛕 {p.temple?.name}</span>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2"><Button type="submit" loading={saving} fullWidth>Create Ad</Button></div>
          </form>
        </Card>
      )}
      <DataTable columns={columns} data={ads as any} emptyMessage="No ads created yet." />
    </DashboardShell>
  );
}
