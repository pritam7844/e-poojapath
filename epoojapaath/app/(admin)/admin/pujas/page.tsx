"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Pencil, Trash2, Plus, X, AlertTriangle, Search,
  BookOpen, IndianRupee, Star, Users, Filter, ExternalLink,
} from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { formatCurrency } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type Temple = { _id: string; name: string; slug: string; coverImage: string; location: { city: string; state: string } };
type PujaPackage = { label: string; persons: string; price: number; maxPersons: number };
type Puja = {
  _id: string; name: string; nameHi: string; description: string; descriptionHi: string;
  price: number; duration: string; image: string; isActive: boolean;
  totalBooked: number; rating: number; temple: Temple;
  benefits: string[]; includes: string[];
  packages?: PujaPackage[];
  availableDates?: string[];
  scheduledAt?: string;
  slotsText?: string;
  isSubscription?: boolean;
  subscriptionType?: "weekly" | "monthly";
  discount3Months?: number;
  discount6Months?: number;
  videoUrl?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const DEFAULT_PACKAGES: PujaPackage[] = [
  { label: "Single", persons: "For 1 person", price: 0, maxPersons: 1 },
  { label: "Two People", persons: "Upto 2 people", price: 0, maxPersons: 2 },
  { label: "Family", persons: "Upto 4 people", price: 0, maxPersons: 4 },
  { label: "Family+", persons: "Upto 6 people", price: 0, maxPersons: 6 },
];

const EMPTY_FORM = {
  name: "", nameHi: "", description: "", descriptionHi: "",
  price: "", duration: "", image: "", videoUrl: "", benefits: "", includes: "", scheduledAt: "", templeId: "",
  availableDates: [] as string[],
  slotsText: "",
  isSubscription: false,
  subscriptionType: "monthly",
  discount3Months: "",
  discount6Months: "",
};

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? "✅" : "❌"} {msg}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-heading text-lg text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ msg, onConfirm, onCancel, loading }: { msg: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4"><AlertTriangle className="text-red-500" size={22} /><h3 className="font-heading text-foreground">Confirm Delete?</h3></div>
        <p className="text-sm text-muted-foreground mb-6">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium disabled:opacity-50 transition">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
const formatDateForInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AdminPujasPage() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTemple, setFilterTemple] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Puja | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Puja | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [packages, setPackages] = useState<PujaPackage[]>(DEFAULT_PACKAGES);
  const [activeTab, setActiveTab] = useState<"basic" | "packages" | "subscription">("basic");
  const [dateMode, setDateMode] = useState<"any" | "specific">("any");
  const [newDateInput, setNewDateInput] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  async function load() {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        fetch("/api/admin/pujas"),
        fetch("/api/admin/temples"),
      ]);
      const pData = await pRes.json();
      const tData = await tRes.json();
      if (pData.success) setPujas(pData.data);
      if (tData.success) setTemples(tData.data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  // Filter
  const filtered = pujas.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.nameHi?.includes(q) || p.temple?.name?.toLowerCase().includes(q);
    const matchT = !filterTemple || p.temple?._id === filterTemple;
    return matchQ && matchT;
  });

  // Open form
  function openAdd() {
    setForm({ ...EMPTY_FORM, availableDates: [] });
    setPackages(DEFAULT_PACKAGES);
    setEditData(null);
    setActiveTab("basic");
    setDateMode("any");
    setNewDateInput("");
    setShowForm(true);
  }

  function openEdit(p: Puja) {
    setForm({
      name: p.name, nameHi: p.nameHi, description: p.description, descriptionHi: p.descriptionHi,
      price: String(p.price), duration: p.duration, image: p.image, videoUrl: p.videoUrl || "",
      benefits: p.benefits?.join(", ") || "",
      includes: p.includes?.join(", ") || "",
      scheduledAt: formatDateForInput(p.scheduledAt), templeId: p.temple?._id || "",
      availableDates: p.availableDates || [],
      slotsText: p.slotsText || "",
      isSubscription: !!p.isSubscription,
      subscriptionType: p.subscriptionType || "monthly",
      discount3Months: p.discount3Months !== undefined ? String(p.discount3Months) : "",
      discount6Months: p.discount6Months !== undefined ? String(p.discount6Months) : "",
    });
    setPackages(p.packages?.length ? p.packages : DEFAULT_PACKAGES);
    setEditData(p);
    setActiveTab("basic");
    setDateMode(p.availableDates && p.availableDates.length > 0 ? "specific" : "any");
    setNewDateInput("");
    setShowForm(true);
  }

  const handleAddDate = () => {
    if (!newDateInput) return;
    if (form.availableDates.includes(newDateInput)) return;
    const updated = [...form.availableDates, newDateInput].sort();
    setForm(f => ({ ...f, availableDates: updated }));
    setNewDateInput("");
  };

  const handleRemoveDate = (d: string) => {
    setForm(f => ({ ...f, availableDates: f.availableDates.filter(date => date !== d) }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        benefits: form.benefits.split(",").map(s => s.trim()).filter(Boolean),
        includes: form.includes.split(",").map(s => s.trim()).filter(Boolean),
        packages: packages.filter(p => p.price > 0),
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        temple: form.templeId || undefined,
        availableDates: dateMode === "specific" ? form.availableDates : [],
        slotsText: form.slotsText || undefined,
        isSubscription: form.isSubscription,
        subscriptionType: form.subscriptionType,
        discount3Months: Number(form.discount3Months || 0),
        discount6Months: Number(form.discount6Months || 0),
      };
      const url = editData ? `/api/admin/pujas/${editData._id}` : `/api/admin/temples/${form.templeId}/pujas`;
      const method = editData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (d.success) { showToast(editData ? "Puja updated! 🪔" : "Puja add ho gayi! 🪔"); setShowForm(false); load(); }
      else showToast(d.error || "Failed", "error");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/pujas/${confirmDelete._id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) { showToast("Puja deleted ✓"); setConfirmDelete(null); load(); }
      else showToast(d.error || "Failed", "error");
    } finally { setDeleting(false); }
  }

  async function toggleActive(p: Puja) {
    const res = await fetch(`/api/admin/pujas/${p._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    const d = await res.json();
    if (d.success) { showToast(`Puja ${!p.isActive ? "activated" : "deactivated"}`); load(); }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmDialog
          msg={`"${confirmDelete.name}" permanently delete karna chahte hain?`}
          onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} loading={deleting}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal title={editData ? `Edit: ${editData.name}` : "Naya Puja Add Karo 🪔"} onClose={() => setShowForm(false)}>
          {/* Tab nav */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 mb-5">
            {(["basic", "packages", "subscription"] as const).map(t => (
              <button key={t} type="button" onClick={() => setActiveTab(t)}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${activeTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t === "basic" ? "Basic Info" : t === "packages" ? "Pricing Packages" : "Subscription Options"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave}>
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Temple select (only for new) */}
                {!editData && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Temple Select Karo <span className="text-red-400">*</span></label>
                    <select value={form.templeId} onChange={e => setForm(f => ({ ...f, templeId: e.target.value }))} required
                      className="w-full border border-border bg-card rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition">
                      <option value="">-- Temple select karo --</option>
                      {temples.map(t => <option key={t._id} value={t._id}>{t.name} ({t.location.city})</option>)}
                    </select>
                  </div>
                )}
                <Input label="Puja Name (English)" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Rudrabhishek Puja" />
                <Input label="Puja Name (Hindi)" required value={form.nameHi} onChange={e => setForm(f => ({ ...f, nameHi: e.target.value }))} placeholder="रुद्राभिषेक पूजा" />
                <Input label="Base Price (₹)" required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="301" />
                <Input label="Duration" required value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="1 to 1.5 hours" />
                <div className="md:col-span-2">
                  <ImageUpload label="Puja Image" required value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} folder="pujas" previewHeight="h-36" />
                </div>
                <Input label="Schedule Date & Time (optional)" type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
                <Input label="Puja Video URL (YouTube / Vimeo Link)" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
                
                {/* Booking Dates Selection */}
                <div className="md:col-span-2 border-t border-border pt-4 mt-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Booking Dates Options</label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="dateMode"
                        value="any"
                        checked={dateMode === "any"}
                        onChange={() => setDateMode("any")}
                        className="text-saffron focus:ring-saffron"
                      />
                      Any Future Date
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="dateMode"
                        value="specific"
                        checked={dateMode === "specific"}
                        onChange={() => setDateMode("specific")}
                        className="text-saffron focus:ring-saffron"
                      />
                      Specific Dates Only
                    </label>
                  </div>

                  {dateMode === "specific" && (
                    <div className="space-y-3 bg-muted/40 p-3.5 rounded-xl border border-border">
                      <div className="flex gap-2">
                        <input
                          type="datetime-local"
                          value={newDateInput}
                          onChange={e => setNewDateInput(e.target.value)}
                          className="flex-1 border border-border bg-card rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddDate}
                        >
                          Add Date & Time
                        </Button>
                      </div>

                      {form.availableDates && form.availableDates.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {form.availableDates.map(d => {
                            const display = d.includes("T") 
                              ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                              : d;
                            return (
                              <span
                                key={d}
                                className="inline-flex items-center gap-1 bg-saffron/10 border border-saffron/20 text-saffron text-xs px-2.5 py-1 rounded-full font-medium"
                              >
                                {display}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewDateInput(d);
                                    handleRemoveDate(d);
                                  }}
                                  className="text-saffron/70 hover:text-saffron transition ml-1"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDate(d)}
                                  className="text-saffron/70 hover:text-saffron transition ml-1"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No dates added yet. Please select and add available dates.</p>
                      )}
                    </div>
                  )}
                </div>

                <Input label="Benefits (comma separated)" value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} placeholder="Health, Prosperity, Peace" />
                <Input label="Includes (comma separated)" value={form.includes} onChange={e => setForm(f => ({ ...f, includes: e.target.value }))} placeholder="Abhishek, Aarti, Prasad" />
                <Input label="Availability / Slots Message (optional)" value={form.slotsText} onChange={e => setForm(f => ({ ...f, slotsText: e.target.value }))} placeholder="e.g. Only 18 slots available" />
                <Textarea label="Description (English)" required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="md:col-span-2" />
                <Textarea label="Description (Hindi)" required rows={2} value={form.descriptionHi} onChange={e => setForm(f => ({ ...f, descriptionHi: e.target.value }))} className="md:col-span-2" />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="button" size="sm" variant="outline" onClick={() => setActiveTab("packages")}>Next: Pricing →</Button>
                </div>
              </div>
            )}

            {activeTab === "packages" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Price 0 rakhne par package disabled ho jayega.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg, i) => (
                    <div key={i} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground text-sm">{pkg.label}</h4>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{pkg.persons}</span>
                      </div>
                      <Input label="Package Label" value={pkg.label} onChange={e => setPackages(prev => prev.map((p, idx) => idx === i ? { ...p, label: e.target.value } : p))} />
                      <Input label="Persons Description" value={pkg.persons} onChange={e => setPackages(prev => prev.map((p, idx) => idx === i ? { ...p, persons: e.target.value } : p))} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input label="Price (₹)" type="number" value={pkg.price || ""} onChange={e => setPackages(prev => prev.map((p, idx) => idx === i ? { ...p, price: Number(e.target.value) } : p))} />
                        <Input label="Max Persons" type="number" value={pkg.maxPersons || ""} onChange={e => setPackages(prev => prev.map((p, idx) => idx === i ? { ...p, maxPersons: Number(e.target.value) } : p))} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setActiveTab("basic")}>← Back</Button>
                  <Button type="button" size="sm" onClick={() => setActiveTab("subscription")}>Next: Subscription →</Button>
                </div>
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 bg-muted/40 p-3.5 rounded-xl border border-border">
                  <input
                    type="checkbox"
                    id="is-sub"
                    className="w-4 h-4 accent-saffron"
                    checked={form.isSubscription}
                    onChange={(e) => setForm(prev => ({ ...prev, isSubscription: e.target.checked }))}
                  />
                  <label htmlFor="is-sub" className="text-sm font-semibold text-foreground cursor-pointer">
                    Enable Subscription for this Puja (मंथली/वीकली सब्सक्रिप्शन चालू करें)
                  </label>
                </div>

                {form.isSubscription && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subscription Interval</label>
                      <select
                        value={form.subscriptionType}
                        onChange={(e) => setForm(prev => ({ ...prev, subscriptionType: e.target.value as any }))}
                        className="w-full border border-border bg-card rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition"
                      >
                        <option value="weekly">Weekly (पूजा हर हफ्ते होगी)</option>
                        <option value="monthly">Monthly (पूजा हर महीने होगी)</option>
                      </select>
                    </div>
                    <Input
                      label="3 Months Discount (%)"
                      type="number"
                      placeholder="e.g. 10"
                      value={form.discount3Months}
                      onChange={(e) => setForm(prev => ({ ...prev, discount3Months: e.target.value }))}
                    />
                    <Input
                      label="6 Months Discount (%)"
                      type="number"
                      placeholder="e.g. 15"
                      value={form.discount6Months}
                      onChange={(e) => setForm(prev => ({ ...prev, discount6Months: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setActiveTab("packages")}>← Back</Button>
                  <Button type="submit" loading={saving} size="sm">
                    {editData ? "Puja Update Karo 🙏" : "Puja Add Karo 🙏"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Puja Manager 🪔</h1>
          <p className="text-muted-foreground mt-1 text-sm">{pujas.length} pujas across all temples</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-medium hover:bg-saffron/90 transition">
          <Plus size={15} /> Naya Puja Add Karo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search puja name..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-saffron transition" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <select value={filterTemple} onChange={e => setFilterTemple(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition">
            <option value="">All Temples</option>
            {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="text-4xl animate-bounce">🪔</div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>Koi puja nahi mila.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p._id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-saffron/30 transition-all">
              {/* Image */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={p.image || p.temple?.coverImage || "/placeholder.jpg"} alt={p.name} fill className="object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-foreground text-sm">{p.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-saffron/80 font-sanskrit mt-0.5">{p.nameHi}</p>
                {p.temple && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    🛕 {p.temple.name} · {p.temple.location?.city}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-saffron font-semibold">
                    <IndianRupee size={11} />{formatCurrency(p.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">⏱ {p.duration}</span>
                  {p.rating > 0 && <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Star size={10} className="text-saffron" /> {p.rating}</span>}
                  {p.totalBooked > 0 && <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Users size={10} /> {p.totalBooked} booked</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.temple?.slug && (
                  <Link href={`/admin/temples/${p.temple._id}?tab=Pujas`} title="View in Temple"
                    className="p-2 rounded-xl text-muted-foreground hover:text-saffron hover:bg-saffron/10 transition">
                    <ExternalLink size={15} />
                  </Link>
                )}
                <button onClick={() => toggleActive(p)} title={p.isActive ? "Deactivate" : "Activate"}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${p.isActive ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"}`}>
                  {p.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => openEdit(p)} title="Edit"
                  className="p-2 rounded-xl text-muted-foreground hover:text-saffron hover:bg-saffron/10 transition">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setConfirmDelete(p)} title="Delete"
                  className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats footer */}
      {!loading && pujas.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Pujas", value: pujas.length, icon: "🪔" },
            { label: "Active", value: pujas.filter(p => p.isActive).length, icon: "✅" },
            { label: "Total Booked", value: pujas.reduce((s, p) => s + (p.totalBooked || 0), 0), icon: "👥" },
            { label: "Avg Rating", value: (pujas.filter(p => p.rating > 0).reduce((s, p) => s + p.rating, 0) / (pujas.filter(p => p.rating > 0).length || 1)).toFixed(1) + "★", icon: "⭐" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="font-heading text-xl text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
