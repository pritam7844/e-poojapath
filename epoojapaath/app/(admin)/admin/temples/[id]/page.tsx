"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Globe, Star, ArrowLeft,
  BookOpen, Flower2, IndianRupee, Users, Clock,
  Plus, Pencil, Trash2, X, Save, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { devToast } from "@/lib/toast";
import type { IPujaPackage, IPujaFaq, IChadawaOfferingItem } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────
type Temple = {
  _id: string; name: string; slug: string; description: string;
  shortDescription: string; deity: string; coverImage: string; images: string[];
  location: { address: string; city: string; state: string; pincode: string };
  status: "pending" | "approved" | "rejected"; featured: boolean;
  rating: number; reviewCount: number; totalBookings: number; timings: string;
  established?: string; contactPhone: string; contactEmail: string;
  website?: string; instagramUrl?: string; googleMapsUrl?: string;
  owner: { name: string; email: string; phone?: string };
  createdAt: string; tags: string[]; availableChadawaDates?: string[];
};
type Puja = {
  _id: string; name: string; nameHi: string; description: string;
  descriptionHi: string; price: number; duration: string;
  image: string; isActive: boolean; totalBooked: number; rating: number;
  benefits: string[]; includes: string[];
  packages?: IPujaPackage[];
  faqs?: IPujaFaq[];
  availableDates?: string[];
  chadawas?: any[];
};
type Chadawa = {
  _id: string; name: string; nameHi: string; description: string;
  descriptionHi: string; price: number; image: string;
  isActive: boolean; deity: string; offeringItems: { name: string; nameHi: string; price: number; image: string; description?: string }[];
};
type Booking = {
  _id: string; serviceName: string; serviceType: string; amount: number;
  status: string; paymentStatus: string; devoteeName: string;
  createdAt: string; date: string; user: { name: string; email: string };
};
type Detail = { temple: Temple; pujas: Puja[]; chadawas: Chadawa[]; bookings: Booking[]; revenue: number };

const TABS = ["Overview", "Pujas", "Chadawa", "History"] as const;
type Tab = typeof TABS[number];

// ─── Puja Form ────────────────────────────────────────────────────────────────
const DEFAULT_PACKAGES: IPujaPackage[] = [
  { label: "Single", persons: "For 1 person", price: 0, maxPersons: 1 },
  { label: "Two People", persons: "Upto 2 people", price: 0, maxPersons: 2 },
  { label: "Family", persons: "Upto 4 people", price: 0, maxPersons: 4 },
  { label: "Family+", persons: "Upto 6 people", price: 0, maxPersons: 6 },
];
const EMPTY_PUJA = {
  name: "", nameHi: "", description: "", descriptionHi: "",
  price: "", duration: "", image: "", videoUrl: "", benefits: "", includes: "", scheduledAt: "",
  availableDates: [] as string[],
  isActive: true,
  chadawas: [] as string[],
};
const EMPTY_CHADAWA = {
  name: "", nameHi: "", description: "", descriptionHi: "",
  price: "", deity: "", image: "", items: "",
};
const EMPTY_OFFERING: Omit<IChadawaOfferingItem, "price"> & { price: string } = {
  name: "", nameHi: "", price: "", image: "", description: "",
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? "✅" : "❌"} {msg}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
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

// ─── Confirm ──────────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel, loading }: {
  message: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={22} />
          <h3 className="font-heading text-foreground">Are you sure?</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Temple Field ────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", rows }: {
  label: string; name: string; value: string; onChange: (n: string, v: string) => void; type?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {rows
        ? <textarea name={name} value={value} onChange={e => onChange(name, e.target.value)} rows={rows}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-saffron transition resize-none" />
        : <input type={type} name={name} value={value} onChange={e => onChange(name, e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-saffron transition" />
      }
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────
function Row({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted-foreground w-24 shrink-0 text-xs">{label}</dt>
      <dd className="text-foreground flex items-center gap-1 break-all text-xs">
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminTempleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  // URL ?tab= param se initial tab set karo
  const initialTab = (searchParams.get("tab") as Tab) || "Overview";
  const [tab, setTab] = useState<Tab>(TABS.includes(initialTab as any) ? initialTab : "Overview");
  const isNewTemple = searchParams.get("new") === "1";
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  // Modals
  const [editTemple, setEditTemple] = useState(false);
  const [showPujaForm, setShowPujaForm] = useState(false);
  const [editPujaData, setEditPujaData] = useState<Puja | null>(null);
  const [showChadawaForm, setShowChadawaForm] = useState(false);
  const [editChadawaData, setEditChadawaData] = useState<Chadawa | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "temple" | "puja" | "chadawa"; id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Temple edit form
  const [templeForm, setTempleForm] = useState<Record<string, any>>({});
  const [templeNewDateInput, setTempleNewDateInput] = useState("");

  const handleAddTempleDate = () => {
    if (!templeNewDateInput) return;
    const currentDates = templeForm.availableChadawaDates || [];
    if (currentDates.includes(templeNewDateInput)) return;
    const updated = [...currentDates, templeNewDateInput].sort();
    setTempleForm(f => ({ ...f, availableChadawaDates: updated }));
    setTempleNewDateInput("");
  };

  const handleRemoveTempleDate = (d: string) => {
    const currentDates = templeForm.availableChadawaDates || [];
    setTempleForm(f => ({ ...f, availableChadawaDates: currentDates.filter((date: string) => date !== d) }));
  };

  // Puja form state
  const [pujaForm, setPujaForm] = useState(EMPTY_PUJA);
  const [packages, setPackages] = useState<IPujaPackage[]>(DEFAULT_PACKAGES);
  const [faqs, setFaqs] = useState<IPujaFaq[]>([{ question: "", answer: "" }]);
  const [pujaTab, setPujaTab] = useState<"basic" | "packages" | "faqs" | "chadawas">("basic");
  const [pujaDateMode, setPujaDateMode] = useState<"any" | "specific">("any");
  const [pujaNewDateInput, setPujaNewDateInput] = useState("");

  // Chadawa form state
  const [chadawaForm, setChadawaForm] = useState(EMPTY_CHADAWA);
  const [offeringItems, setOfferingItems] = useState<(typeof EMPTY_OFFERING)[]>([]);
  const [newOfferingItem, setNewOfferingItem] = useState(EMPTY_OFFERING);
  const [showOfferingItemForm, setShowOfferingItemForm] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  function reload() {
    setLoading(true);
    fetch(`/api/admin/temples/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [id]);

  // ?edit=1 param se auto edit modal open karo jab data load ho
  const isEditParam = searchParams.get("edit") === "1";
  useEffect(() => {
    if (isEditParam && data) openEditTemple();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditParam, data]);

  // ── Temple Edit ──────────────────────────────────────────────────────────
  function openEditTemple() {
    if (!data) return;
    const t = data.temple;
    setTempleForm({
      name: t.name, deity: t.deity, description: t.description,
      shortDescription: t.shortDescription || "", timings: t.timings,
      established: t.established || "",
      "location.address": t.location.address, "location.city": t.location.city,
      "location.state": t.location.state, "location.pincode": t.location.pincode,
      contactPhone: t.contactPhone || "", contactEmail: t.contactEmail || "",
      website: t.website || "", instagramUrl: t.instagramUrl || "", googleMapsUrl: t.googleMapsUrl || "",
      coverImage: t.coverImage,
      images: t.images || [],
      availableChadawaDates: t.availableChadawaDates || [],
    });
    setEditTemple(true);
  }

  async function saveTemple() {
    setSaving(true);
    try {
      const body: Record<string, unknown> = { ...templeForm };
      body.location = {
        address: templeForm["location.address"], city: templeForm["location.city"],
        state: templeForm["location.state"], pincode: templeForm["location.pincode"],
      };
      delete body["location.address"]; delete body["location.city"];
      delete body["location.state"]; delete body["location.pincode"];
      const res = await fetch(`/api/admin/temples/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await res.json();
      if (d.success) { showToast("Temple updated! 🛕"); setEditTemple(false); reload(); }
      else showToast(d.error || "Failed", "error");
    } finally { setSaving(false); }
  }

  // ── Puja Form ─────────────────────────────────────────────────────────────
  function openAddPuja() {
    // Temple ki cover image default rakhte hain — admin baad mein change kar sakta hai
    setPujaForm({ ...EMPTY_PUJA, image: temple.coverImage || "", availableDates: [] });
    setPackages(DEFAULT_PACKAGES);
    setFaqs([{ question: "", answer: "" }]);
    setPujaTab("basic");
    setEditPujaData(null);
    setPujaDateMode("any");
    setPujaNewDateInput("");
    setShowPujaForm(true);
  }

  function openEditPuja(p: Puja) {
    setPujaForm({
      name: p.name, nameHi: p.nameHi, description: p.description,
      descriptionHi: p.descriptionHi, price: String(p.price),
      duration: p.duration, image: p.image, videoUrl: (p as any).videoUrl || "",
      benefits: p.benefits?.join(", ") || "",
      includes: p.includes?.join(", ") || "",
      scheduledAt: "",
      availableDates: p.availableDates || [],
      isActive: p.isActive !== false,
      chadawas: p.chadawas?.map((c: any) => typeof c === "object" ? c._id.toString() : c.toString()) || [],
    });
    setPackages(p.packages?.length ? p.packages : DEFAULT_PACKAGES);
    setFaqs(p.faqs?.length ? p.faqs : [{ question: "", answer: "" }]);
    setPujaTab("basic");
    setEditPujaData(p);
    setPujaDateMode(p.availableDates && p.availableDates.length > 0 ? "specific" : "any");
    setPujaNewDateInput("");
    setShowPujaForm(true);
  }

  const handleAddPujaDate = () => {
    if (!pujaNewDateInput) return;
    if (pujaForm.availableDates.includes(pujaNewDateInput)) return;
    const updated = [...pujaForm.availableDates, pujaNewDateInput].sort();
    setPujaForm(p => ({ ...p, availableDates: updated }));
    setPujaNewDateInput("");
  };

  const handleRemovePujaDate = (d: string) => {
    setPujaForm(p => ({ ...p, availableDates: p.availableDates.filter(date => date !== d) }));
  };

  const setPujaField = (k: keyof typeof EMPTY_PUJA) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setPujaForm(p => ({ ...p, [k]: e.target.value }));

  function updatePackage(i: number, field: keyof IPujaPackage, value: string | number) {
    setPackages(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  async function savePuja(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const validPackages = packages.filter(p => p.price > 0);
      const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
      const payload = {
        ...pujaForm,
        price: Number(pujaForm.price),
        benefits: pujaForm.benefits.split(",").map(s => s.trim()).filter(Boolean),
        includes: pujaForm.includes.split(",").map(s => s.trim()).filter(Boolean),
        packages: validPackages,
        scheduledAt: pujaForm.scheduledAt ? new Date(pujaForm.scheduledAt).toISOString() : undefined,
        faqs: validFaqs,
        availableDates: pujaDateMode === "specific" ? pujaForm.availableDates : [],
      };

      const url = editPujaData ? `/api/admin/pujas/${editPujaData._id}` : `/api/admin/temples/${id}/pujas`;
      const method = editPujaData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (d.success) {
        showToast(editPujaData ? "Puja updated! 🪔" : "Puja add ho gayi! 🪔");
        setShowPujaForm(false);
        reload();
      } else showToast(d.error || "Failed", "error");
    } finally { setSaving(false); }
  }

  // ── Chadawa Form ──────────────────────────────────────────────────────────
  function openAddChadawa() {
    // Temple ki cover image default rakhte hain — admin baad mein change kar sakta hai
    setChadawaForm({ ...EMPTY_CHADAWA, image: temple.coverImage || "" });
    setOfferingItems([]);
    setNewOfferingItem(EMPTY_OFFERING);
    setShowOfferingItemForm(false);
    setEditChadawaData(null);
    setShowChadawaForm(true);
  }

  function openEditChadawa(c: Chadawa) {
    setChadawaForm({
      name: c.name, nameHi: c.nameHi, description: c.description,
      descriptionHi: c.descriptionHi, price: String(c.price),
      deity: c.deity, image: c.image, items: "",
    });
    setOfferingItems(c.offeringItems?.map(i => ({ ...i, price: String(i.price) })) || []);
    setNewOfferingItem(EMPTY_OFFERING);
    setShowOfferingItemForm(false);
    setEditChadawaData(c);
    setShowChadawaForm(true);
  }

  const setChadawaField = (k: keyof typeof EMPTY_CHADAWA) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setChadawaForm(p => ({ ...p, [k]: e.target.value }));

  const setOfferingField = (k: keyof typeof EMPTY_OFFERING) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setNewOfferingItem(p => ({ ...p, [k]: e.target.value }));

  function addOfferingItem() {
    if (!newOfferingItem.name || !newOfferingItem.nameHi || !newOfferingItem.price || !newOfferingItem.image) {
      showToast("Item ka naam, hindi naam, price aur image zaroori hai", "error");
      return;
    }
    setOfferingItems(p => [...p, { ...newOfferingItem }]);
    setNewOfferingItem(EMPTY_OFFERING);
    setShowOfferingItemForm(false);
  }

  async function saveChadawa(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...chadawaForm,
        price: Number(chadawaForm.price),
        items: chadawaForm.items.split(",").map(s => s.trim()).filter(Boolean),
        offeringItems: offeringItems.map(item => ({ ...item, price: Number(item.price) })),
      };
      const url = editChadawaData ? `/api/admin/chadawa/${editChadawaData._id}` : `/api/admin/temples/${id}/chadawa`;
      const method = editChadawaData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (d.success) {
        showToast(editChadawaData ? "Chadawa updated! 🌸" : "Chadawa add ho gayi! 🌸");
        setShowChadawaForm(false);
        reload();
      } else showToast(d.error || "Failed", "error");
    } finally { setSaving(false); }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const urlMap = {
        temple: `/api/admin/temples/${id}`,
        puja: `/api/admin/pujas/${confirmDelete.id}`,
        chadawa: `/api/admin/chadawa/${confirmDelete.id}`,
      };
      const res = await fetch(urlMap[confirmDelete.type], { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        showToast(`${confirmDelete.name} deleted ✓`);
        setConfirmDelete(null);
        if (confirmDelete.type === "temple") router.push("/admin/temples");
        else reload();
      } else showToast(d.error || "Failed", "error");
    } finally { setDeleting(false); }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-4xl animate-bounce">🛕</div></div>;
  if (!data) return <div className="p-8 text-muted-foreground">Temple not found.</div>;

  const { temple, pujas, chadawas, bookings, revenue } = data;
  const pujaTabItems = [
    { key: "basic", label: "Basic Info" },
    { key: "packages", label: "Pricing Packages" },
    { key: "faqs", label: "FAQs" },
    { key: "chadawas", label: "Select Chadawas" }
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmDialog
          message={`"${confirmDelete.name}" permanently delete karna chahte hain?${confirmDelete.type === "temple" ? " Iske sare Puja aur Chadawa bhi delete ho jayenge!" : ""}`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}

      {/* ── Edit Temple Modal ── */}
      {editTemple && (
        <Modal title="Temple Edit Karo" onClose={() => setEditTemple(false)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Temple Name" name="name" value={templeForm.name} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Deity" name="deity" value={templeForm.deity} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Timings" name="timings" value={templeForm.timings} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Established" name="established" value={templeForm.established} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <div className="md:col-span-2"><Field label="Short Description" name="shortDescription" value={templeForm.shortDescription} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} rows={2} /></div>
            <div className="md:col-span-2">
              <RichTextEditor
                label="Full Description"
                value={templeForm.description}
                onChange={html => setTempleForm(f => ({ ...f, description: html }))}
                placeholder="History, significance, and details..."
              />
            </div>
            <Field label="Address" name="location.address" value={templeForm["location.address"]} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="City" name="location.city" value={templeForm["location.city"]} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="State" name="location.state" value={templeForm["location.state"]} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Pincode" name="location.pincode" value={templeForm["location.pincode"]} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Contact Phone (Optional)" name="contactPhone" value={templeForm.contactPhone} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Contact Email (Optional)" name="contactEmail" value={templeForm.contactEmail} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} type="email" />
            <Field label="Website (Optional)" name="website" value={templeForm.website} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Instagram Profile Link (Optional)" name="instagramUrl" value={templeForm.instagramUrl} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <Field label="Google Maps URL" name="googleMapsUrl" value={templeForm.googleMapsUrl} onChange={(n, v) => setTempleForm(f => ({ ...f, [n]: v }))} />
            <div className="md:col-span-2 space-y-4">
              <ImageUpload
                label="Cover Image"
                required
                value={templeForm.coverImage}
                onChange={url => setTempleForm(f => ({ ...f, coverImage: url }))}
                folder="temples"
                previewHeight="h-44"
              />

              <div className="space-y-3 pt-3 border-t border-border">
                <label className="block text-xs font-medium text-muted-foreground">
                  Gallery Images (Devotees ko slider me show karne ke liye)
                </label>
                
                {templeForm.images && templeForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {templeForm.images.map((url: string, idx: number) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border group h-24">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setTempleForm(f => ({ ...f, images: f.images.filter((_: any, i: number) => i !== idx) }))}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition opacity-0 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <ImageUpload
                  value=""
                  onChange={url => {
                    if (url) {
                      setTempleForm(f => ({ ...f, images: [...(f.images || []), url] }));
                    }
                  }}
                  folder="temples"
                  previewHeight="h-24"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">Nayi images add karne ke liye upar box me click ya drag-drop karein. Ek se zyada images add kar sakte hain.</p>
              </div>

              {/* Special Chadawa Dates Section */}
              <div className="space-y-3 pt-4 border-t border-border mt-4">
                <label className="block text-sm font-bold text-foreground">
                  Special Chadawa Dates (Mandir Special Chadawa Dates)
                </label>
                <p className="text-xs text-muted-foreground">
                  Yahan date add karne se, is mandir ke sabhi Special Chadawa me yahi dates automatically option me show hongi.
                </p>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={templeNewDateInput}
                    onChange={e => setTempleNewDateInput(e.target.value)}
                    className="flex-1 border border-border bg-card rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddTempleDate}
                  >
                    Add Date
                  </Button>
                </div>

                {templeForm.availableChadawaDates && templeForm.availableChadawaDates.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {templeForm.availableChadawaDates.map((d: string) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 bg-saffron/10 border border-saffron/20 text-saffron text-xs px-2.5 py-1 rounded-full font-medium"
                      >
                        {d}
                        <button
                          type="button"
                          onClick={() => handleRemoveTempleDate(d)}
                          className="text-saffron/70 hover:text-saffron transition ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No dates added yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setEditTemple(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition">Cancel</button>
            <button onClick={saveTemple} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-saffron text-white text-sm font-medium hover:bg-saffron/90 disabled:opacity-50 transition flex items-center justify-center gap-2">
              <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add / Edit Puja Modal (same form as temple owner) ── */}
      {showPujaForm && (
        <Modal title={editPujaData ? `Puja Edit: ${editPujaData.name}` : "Naya Puja Add Karo 🪔"} onClose={() => setShowPujaForm(false)}>
          {/* Tab Nav */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 mb-5">
            {pujaTabItems.map(t => (
              <button key={t.key} type="button" onClick={() => setPujaTab(t.key)}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${pujaTab === t.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <form onSubmit={savePuja}>
            {/* Basic Info */}
            {pujaTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Puja Name (English)" required value={pujaForm.name} onChange={setPujaField("name")} placeholder="Rudrabhishek" />
                <Input label="Puja Name (Hindi)" required value={pujaForm.nameHi} onChange={setPujaField("nameHi")} placeholder="रुद्राभिषेक" />
                <Input label="Base Price (₹)" required value={pujaForm.price} onChange={setPujaField("price")} type="number" placeholder="2100" />
                <Input label="Duration" required value={pujaForm.duration} onChange={setPujaField("duration")} placeholder="2 to 2.5 hours" />
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Puja Image"
                    required
                    value={pujaForm.image}
                    onChange={url => setPujaForm(p => ({ ...p, image: url }))}
                    folder="pujas"
                    previewHeight="h-36"
                  />
                </div>
                <Input label="Schedule Date & Time (optional)" type="datetime-local" value={pujaForm.scheduledAt} onChange={setPujaField("scheduledAt")} min={new Date().toISOString().slice(0, 16)} />
                <Input label="Puja Video URL (YouTube / Vimeo Link)" value={pujaForm.videoUrl} onChange={setPujaField("videoUrl")} placeholder="https://www.youtube.com/watch?v=..." />
                
                {/* Booking Dates Selection */}
                <div className="md:col-span-2 border-t border-border pt-4 mt-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Booking Dates Options</label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="pujaDateMode"
                        value="any"
                        checked={pujaDateMode === "any"}
                        onChange={() => setPujaDateMode("any")}
                        className="text-saffron focus:ring-saffron"
                      />
                      Any Future Date
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="pujaDateMode"
                        value="specific"
                        checked={pujaDateMode === "specific"}
                        onChange={() => setPujaDateMode("specific")}
                        className="text-saffron focus:ring-saffron"
                      />
                      Specific Dates Only
                    </label>
                  </div>

                  {pujaDateMode === "specific" && (
                    <div className="space-y-3 bg-muted/40 p-3.5 rounded-xl border border-border">
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={pujaNewDateInput}
                          onChange={e => setPujaNewDateInput(e.target.value)}
                          className="flex-1 border border-border bg-card rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddPujaDate}
                        >
                          Add Date
                        </Button>
                      </div>

                      {pujaForm.availableDates && pujaForm.availableDates.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pujaForm.availableDates.map(d => (
                            <span
                              key={d}
                              className="inline-flex items-center gap-1 bg-saffron/10 border border-saffron/20 text-saffron text-xs px-2.5 py-1 rounded-full font-medium"
                            >
                              {d}
                              <button
                                type="button"
                                onClick={() => handleRemovePujaDate(d)}
                                className="text-saffron/70 hover:text-saffron transition ml-1"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No dates added yet. Please select and add available dates.</p>
                      )}
                    </div>
                  )}
                </div>

                <Input label="Benefits (comma separated)" value={pujaForm.benefits} onChange={setPujaField("benefits")} placeholder="Health, Prosperity, Protection" />
                <Input label="Includes (comma separated)" value={pujaForm.includes} onChange={setPujaField("includes")} placeholder="Abhishek, Aarti, Prasad" />
                <Textarea label="Description (English)" required value={pujaForm.description} onChange={setPujaField("description")} rows={3} className="md:col-span-2" />
                <Textarea label="Description (Hindi)" required value={pujaForm.descriptionHi} onChange={setPujaField("descriptionHi")} rows={2} className="md:col-span-2" />
                <div className="md:col-span-2">
                  <Select
                    label="Website Visibility"
                    value={pujaForm.isActive ? "true" : "false"}
                    onChange={e => setPujaForm(p => ({ ...p, isActive: e.target.value === "true" }))}
                    options={[
                      { value: "true", label: "Show on Website (Active) 🟢" },
                      { value: "false", label: "Hide from Website (Hidden) 🔴" },
                    ]}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="button" size="sm" variant="outline" onClick={() => setPujaTab("packages")}>Next: Pricing Packages →</Button>
                </div>
              </div>
            )}

            {/* Packages */}
            {pujaTab === "packages" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Har tier ke liye price set karo. 0 rakhne par disabled ho jayega.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg, i) => (
                    <div key={pkg.label} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground text-sm">{pkg.label}</h4>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{pkg.persons}</span>
                      </div>
                      <Input label="Package Label" value={pkg.label} onChange={e => updatePackage(i, "label", e.target.value)} placeholder="Single" />
                      <Input label="Persons Description" value={pkg.persons} onChange={e => updatePackage(i, "persons", e.target.value)} placeholder="For 1 person" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input label="Price (₹)" type="number" value={pkg.price || ""} onChange={e => updatePackage(i, "price", Number(e.target.value))} placeholder="851" />
                        <Input label="Max Persons" type="number" value={pkg.maxPersons || ""} onChange={e => updatePackage(i, "maxPersons", Number(e.target.value))} placeholder="1" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setPujaTab("basic")}>← Back</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setPujaTab("faqs")}>Next: FAQs →</Button>
                </div>
              </div>
            )}

            {/* FAQs */}
            {pujaTab === "faqs" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">FAQs jo puja page par dikhenge. Khali chodne par default use hoga.</p>
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-border rounded-xl p-4 space-y-3 relative">
                    <button type="button" onClick={() => setFaqs(f => f.filter((_, idx) => idx !== i))}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                    <Input label={`Question ${i + 1}`} value={faq.question} onChange={e => setFaqs(f => f.map((x, idx) => idx === i ? { ...x, question: e.target.value } : x))} placeholder="Why choose us for online Puja booking?" />
                    <Textarea label="Answer" rows={2} value={faq.answer} onChange={e => setFaqs(f => f.map((x, idx) => idx === i ? { ...x, answer: e.target.value } : x))} placeholder="Detailed answer..." />
                  </div>
                ))}
                <button type="button" onClick={() => setFaqs(f => [...f, { question: "", answer: "" }])}
                  className="flex items-center gap-2 text-sm text-saffron hover:text-saffron/80 font-medium">
                  <Plus size={15} /> FAQ Add Karo
                </button>
                <div className="flex justify-between pt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setPujaTab("packages")}>← Back</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setPujaTab("chadawas")}>Next: Select Chadawas →</Button>
                </div>
              </div>
            )}

            {/* Chadawas Selection Tab */}
            {pujaTab === "chadawas" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select specific Chadawa offerings of this temple to show on this Puja&apos;s page. (If none selected, all active regular Chadawas will be shown)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1 border border-border rounded-xl bg-card">
                  {chadawas
                    .filter((c: any) => c.isActive && !c.isSpecial)
                    .map((c: any) => {
                      const isChecked = pujaForm.chadawas?.includes(c._id.toString());
                      return (
                        <label key={c._id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:bg-muted/40 transition cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const currentSelected = pujaForm.chadawas || [];
                              const updated = currentSelected.includes(c._id.toString())
                                ? currentSelected.filter((id) => id !== c._id.toString())
                                : [...currentSelected, c._id.toString()];
                              setPujaForm((prev) => ({ ...prev, chadawas: updated }));
                            }}
                            className="rounded border-border text-saffron focus:ring-saffron"
                          />
                          <div className="flex items-center gap-2.5 min-w-0">
                            {c.image && (
                              <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                                <Image src={c.image} alt={c.name} fill className="object-cover" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">{c.name}</p>
                              <p className="text-xs text-saffron font-medium">{formatCurrency(c.price)}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  {chadawas.filter((c: any) => c.isActive && !c.isSpecial).length === 0 && (
                    <p className="text-sm text-muted-foreground italic p-4 col-span-2 text-center">No active regular Chadawa offerings found in this temple.</p>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setPujaTab("faqs")}>← Back</Button>
                  <Button type="submit" loading={saving} size="sm">
                    {editPujaData ? "Puja Update Karo 🙏" : "Puja Add Karo 🙏"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* ── Add / Edit Chadawa Modal (same form as temple owner) ── */}
      {showChadawaForm && (
        <Modal title={editChadawaData ? `Chadawa Edit: ${editChadawaData.name}` : "Naya Chadawa Add Karo 🌸"} onClose={() => setShowChadawaForm(false)}>
          <form onSubmit={saveChadawa} className="space-y-5">
            {/* Basic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Name (English)" required value={chadawaForm.name} onChange={setChadawaField("name")} placeholder="Bilva Patra Offering" />
              <Input label="Name (Hindi)" required value={chadawaForm.nameHi} onChange={setChadawaField("nameHi")} placeholder="बेलपत्र अर्पण" />
              <Input label="Deity" required value={chadawaForm.deity} onChange={setChadawaField("deity")} placeholder="Lord Shiva" />
              <Input label="Base Price (₹)" required value={chadawaForm.price} onChange={setChadawaField("price")} type="number" placeholder="151" />
              <div className="md:col-span-2">
                <ImageUpload
                  label="Cover Image"
                  required
                  value={chadawaForm.image}
                  onChange={url => setChadawaForm(p => ({ ...p, image: url }))}
                  folder="chadawa"
                  previewHeight="h-36"
                />
              </div>
              <Input label="Includes (comma separated)" value={chadawaForm.items} onChange={setChadawaField("items")} placeholder="Bilva leaves, Gangajal" />
              <Textarea label="Description (English)" required value={chadawaForm.description} onChange={setChadawaField("description")} rows={2} className="md:col-span-2" />
              <Textarea label="Description (Hindi)" required value={chadawaForm.descriptionHi} onChange={setChadawaField("descriptionHi")} rows={2} className="md:col-span-2" />
            </div>

            {/* Offering Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-heading text-sm text-foreground">Individual Offering Items</h4>
                  <p className="text-xs text-muted-foreground">Devotees individual items choose kar sakte hain</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowOfferingItemForm(!showOfferingItemForm)}>
                  {showOfferingItemForm ? "Cancel" : "+ Add Item"}
                </Button>
              </div>

              {offeringItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {offeringItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 border border-deep-gold/20 rounded-xl p-3 bg-background">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-saffron">{item.nameHi}</p>
                        <p className="text-xs text-muted-foreground font-medium">₹{item.price}</p>
                      </div>
                      <button type="button" onClick={() => setOfferingItems(p => p.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 text-lg">×</button>
                    </div>
                  ))}
                </div>
              )}

              {offeringItems.length === 0 && !showOfferingItemForm && (
                <div className="border-2 border-dashed border-deep-gold/20 rounded-xl p-4 text-center text-muted-foreground text-sm">
                  Koi offering item nahi. Upar button se add karo.
                </div>
              )}

              {showOfferingItemForm && (
                <div className="border border-deep-gold/30 rounded-xl p-4 bg-saffron/5 space-y-3">
                  <p className="text-sm font-medium text-foreground">New Offering Item</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Item Name (English)" required value={newOfferingItem.name} onChange={setOfferingField("name")} placeholder="Bilva Patra" />
                    <Input label="Item Name (Hindi)" required value={newOfferingItem.nameHi} onChange={setOfferingField("nameHi")} placeholder="बेलपत्र" />
                    <Input label="Price (₹)" required value={newOfferingItem.price} onChange={setOfferingField("price")} type="number" placeholder="21" />
                    <div className="sm:col-span-2">
                      <ImageUpload
                        label="Item Image"
                        required
                        value={newOfferingItem.image}
                        onChange={url => setNewOfferingItem(p => ({ ...p, image: url }))}
                        folder="chadawa-items"
                        previewHeight="h-28"
                      />
                    </div>
                    <Textarea label="Description (optional)" value={newOfferingItem.description || ""} onChange={setOfferingField("description")} rows={2} className="sm:col-span-2" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setShowOfferingItemForm(false); setNewOfferingItem(EMPTY_OFFERING); }}>Cancel</Button>
                    <Button type="button" size="sm" onClick={addOfferingItem}>Add Item</Button>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" loading={saving} fullWidth>
              {editChadawaData ? "Chadawa Update Karo 🌸" : `Chadawa Add Karo 🌸${offeringItems.length > 0 ? ` (${offeringItems.length} items ke saath)` : ""}`}
            </Button>
          </form>
        </Modal>
      )}

      {/* ── Header ── */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground transition"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="font-heading text-xl text-foreground">{temple.name}</h1>
          <p className="text-xs text-muted-foreground">{temple.location.city}, {temple.location.state}</p>
        </div>
        <Badge variant={temple.status}>{temple.status}</Badge>
        {temple.featured && <Badge variant="saffron">⭐ Featured</Badge>}
        <div className="flex items-center gap-2 ml-2">
          <button onClick={openEditTemple} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saffron/10 text-saffron hover:bg-saffron/20 transition text-xs font-medium">
            <Pencil size={13} /> Edit
          </button>
          <button onClick={() => setConfirmDelete({ type: "temple", id: temple._id, name: temple.name })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition text-xs font-medium">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {temple.coverImage && (
        <div className="relative h-48 w-full">
          <Image src={temple.coverImage} alt={temple.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* ── New Temple Welcome Banner ── */}
      {isNewTemple && (
        <div className="bg-gradient-to-r from-saffron/10 via-amber-500/5 to-saffron/10 border-b border-saffron/20 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-heading text-foreground text-sm">🎉 Temple successfully add ho gaya!</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ab is temple ke liye Puja aur Chadawa add karo</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTab("Pujas")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition">
                <BookOpen size={13} /> 🪔 Puja Add Karo
              </button>
              <button onClick={() => setTab("Chadawa")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition">
                <Flower2 size={13} /> 🌸 Chadawa Add Karo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {[
          { icon: <IndianRupee size={16} />, label: "Revenue", value: formatCurrency(revenue) },
          { icon: <BookOpen size={16} />, label: "Bookings", value: bookings.length },
          { icon: <Star size={16} />, label: "Rating", value: `${temple.rating || "—"} ★` },
          { icon: <Users size={16} />, label: "Reviews", value: temple.reviewCount || 0 },
        ].map(s => (
          <div key={s.label} className="bg-card px-5 py-4 flex items-center gap-3">
            <span className="text-saffron">{s.icon}</span>
            <div>
              <p className="font-heading text-lg text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-saffron text-saffron" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t}
            {t === "Pujas" && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{pujas.length}</span>}
            {t === "Chadawa" && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{chadawas.length}</span>}
            {t === "History" && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{bookings.length}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 max-w-5xl space-y-6">

        {/* ══ OVERVIEW ══ */}
        {tab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-heading text-base text-foreground">Temple Details</h3>
              <dl className="space-y-2 text-sm">
                <Row label="Deity" value={temple.deity} />
                <Row label="Timings" value={temple.timings} />
                <Row label="Address" value={`${temple.location.address}, ${temple.location.city}, ${temple.location.state} – ${temple.location.pincode}`} />
                <Row label="Established" value={temple.established || "Ancient"} />
                <Row label="Registered" value={formatDateShort(temple.createdAt)} />
              </dl>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-heading text-base text-foreground">Owner / Contact</h3>
              <dl className="space-y-2 text-sm">
                <Row label="Owner" value={temple.owner?.name || "—"} />
                <Row label="Email" value={temple.owner?.email || "—"} icon={<Mail size={13} />} />
                {temple.owner?.phone && <Row label="Phone" value={temple.owner.phone} icon={<Phone size={13} />} />}
                {temple.contactPhone && <Row label="Contact" value={temple.contactPhone} icon={<Phone size={13} />} />}
                {temple.website && <Row label="Website" value={temple.website} icon={<Globe size={13} />} />}
              </dl>
            </div>
            {temple.description && (
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-5">
                <h3 className="font-heading text-base text-foreground mb-2">About</h3>
                {temple.description.startsWith("<") || /<[a-z][\s\S]*>/i.test(temple.description) ? (
                  <div 
                    className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-body prose-headings:font-semibold prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5" 
                    dangerouslySetInnerHTML={{ __html: temple.description }} 
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{temple.description}</p>
                )}
              </div>
            )}
            {/* Sync Images Banner */}
            <div className="md:col-span-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-heading text-sm text-foreground">🖼️ Pujas/Chadawa ki images sync karo</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Jis puja/chadawa mein image nahi hai, usse temple cover image automatically assign hogi
                </p>
              </div>
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    const res = await fetch(`/api/admin/temples/${id}/sync-images`, { method: "POST" });
                    const d = await res.json();
                    if (d.success) { showToast(d.message + " ✓"); reload(); }
                    else showToast(d.error || "Failed", "error");
                  } finally { setSaving(false); }
                }}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 disabled:opacity-50 transition whitespace-nowrap"
              >
                {saving ? "Syncing..." : "🔄 Sync Images"}
              </button>
            </div>
          </div>
        )}

        {/* ══ PUJAS ══ */}
        {tab === "Pujas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg text-foreground">Pujas ({pujas.length})</h2>
              <button onClick={openAddPuja}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-medium hover:bg-saffron/90 transition">
                <Plus size={15} /> Puja Add Karo
              </button>
            </div>
            {pujas.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-4xl mb-3">🪔</p>
                <p className="text-muted-foreground text-sm">Koi puja nahi hai. Upar button se add karo.</p>
              </div>
            )}
            {pujas.map(p => (
              <div key={p._id} className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center gap-4">
                {p.image && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{p.name}</p>
                    <span className="font-sanskrit text-saffron text-xs">{p.nameHi}</span>
                    {p.isActive !== false ? (
                      <Badge variant="approved">Visible 🟢</Badge>
                    ) : (
                      <Badge variant="rejected">Hidden 🔴</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <Clock size={11} /> {p.duration}
                    <span className="text-border">•</span>
                    <Star size={11} /> {p.rating || "—"}
                    <span className="text-border">•</span>
                    {p.totalBooked} booked
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="font-heading text-saffron text-base">{formatCurrency(p.price)}</p>
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => openEditPuja(p)} className="p-1.5 rounded-lg bg-saffron/10 text-saffron hover:bg-saffron/20 transition"><Pencil size={13} /></button>
                    <button onClick={() => setConfirmDelete({ type: "puja", id: p._id, name: p.name })} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"><Trash2 size={13} /></button>
                    <Link href={`/puja/${p._id}`} target="_blank" className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition text-xs flex items-center">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ CHADAWA ══ */}
        {tab === "Chadawa" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg text-foreground">Chadawa Offerings ({chadawas.length})</h2>
              <button onClick={openAddChadawa}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-medium hover:bg-saffron/90 transition">
                <Plus size={15} /> Chadawa Add Karo
              </button>
            </div>
            {chadawas.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-4xl mb-3">🌸</p>
                <p className="text-muted-foreground text-sm">Koi chadawa nahi hai. Upar button se add karo.</p>
              </div>
            )}
            {chadawas.map(c => (
              <div key={c._id} className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center gap-4">
                {c.image && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <Image src={c.image} alt={c.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{c.name}</p>
                    <span className="font-sanskrit text-saffron text-xs">{c.nameHi}</span>
                    {!c.isActive && <Badge variant="rejected">Inactive</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Flower2 size={11} /> {c.deity}
                    <span className="text-border mx-1">•</span>
                    {c.offeringItems?.length ?? 0} offering items
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="font-heading text-saffron text-base">{formatCurrency(c.price)}</p>
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => openEditChadawa(c)} className="p-1.5 rounded-lg bg-saffron/10 text-saffron hover:bg-saffron/20 transition"><Pencil size={13} /></button>
                    <button onClick={() => setConfirmDelete({ type: "chadawa", id: c._id, name: c.name })} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"><Trash2 size={13} /></button>
                    <Link href={`/chadawa/${c._id}`} target="_blank" className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition text-xs flex items-center">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {tab === "History" && (
          <div className="space-y-3">
            {bookings.length === 0 && <p className="text-muted-foreground text-sm">No bookings yet.</p>}
            {bookings.map(b => (
              <div key={b._id} className="rounded-2xl border border-border bg-card px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground text-sm">{b.serviceName}</p>
                      <Badge variant={b.serviceType === "puja" ? "saffron" : "pink"}>{b.serviceType}</Badge>
                      <Badge variant={b.status as any}>{b.status}</Badge>
                      <Badge variant={b.paymentStatus === "paid" ? "approved" : "pending"}>{b.paymentStatus}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">{b.devoteeName}</span>
                      {b.user?.name && b.user.name !== b.devoteeName && ` (${b.user.name})`}
                      {b.user?.email && <span className="ml-1 opacity-70">• {b.user.email}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Booked {formatDateShort(b.createdAt)} • Puja date: {formatDateShort(b.date)}
                      <span className="mx-2">•</span>
                      <Link href={`/user/bookings/${b._id}`} className="text-saffron hover:underline">Details →</Link>
                    </p>
                  </div>
                  <p className="font-heading text-saffron text-base shrink-0">{formatCurrency(b.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
