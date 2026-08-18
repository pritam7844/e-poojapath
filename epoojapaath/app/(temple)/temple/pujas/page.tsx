"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { devToast } from "@/lib/toast";
import { Plus, Trash2 } from "lucide-react";
import type { IPuja, IPujaPackage, IPujaFaq } from "@/types";

type PujaRow = IPuja & { _id: string };

const DEFAULT_PACKAGES: IPujaPackage[] = [
  { label: "Single", persons: "For 1 person", price: 0, maxPersons: 1 },
  { label: "Two People", persons: "Upto 2 people", price: 0, maxPersons: 2 },
  { label: "Family", persons: "Upto 4 people", price: 0, maxPersons: 4 },
  { label: "Family+", persons: "Upto 6 people", price: 0, maxPersons: 6 },
];

const EMPTY_FORM = {
  name: "", nameHi: "", description: "", descriptionHi: "",
  price: "", duration: "", image: "", videoUrl: "", benefits: "", includes: "",
  templeId: "", scheduledAt: "",
};

export default function TemplePujasPage() {
  const [temples, setTemples] = useState<{ value: string; label: string }[]>([]);
  const [pujas, setPujas] = useState<PujaRow[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [packages, setPackages] = useState<IPujaPackage[]>(DEFAULT_PACKAGES);
  const [faqs, setFaqs] = useState<IPujaFaq[]>([{ question: "", answer: "" }]);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "packages" | "faqs">("basic");

  useEffect(() => {
    fetch("/api/temples?owner=me").then((r) => r.json()).then((d) => {
      if (d.success) {
        const ts = d.data.filter((t: { status: string }) => t.status === "approved");
        setTemples(ts.map((t: { _id: string; name: string }) => ({ value: t._id, label: t.name })));
        if (ts[0]) {
          setForm((p) => ({ ...p, templeId: ts[0]._id }));
          fetchPujas(ts[0]._id);
        }
      }
    });
  }, []);

  function fetchPujas(tid: string) {
    fetch(`/api/temples/${tid}/pujas`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setPujas(d.data); });
  }

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  function updatePackage(i: number, field: keyof IPujaPackage, value: string | number) {
    setPackages((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }

  function updateFaq(i: number, field: keyof IPujaFaq, value: string) {
    setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  }

  function removeFaq(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const validPackages = packages.filter((p) => p.price > 0);
      const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());

      const payload = {
        ...form,
        price: Number(form.price),
        temple: form.templeId,
        benefits: form.benefits.split(",").map((s) => s.trim()).filter(Boolean),
        includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
        packages: validPackages,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
        faqs: validFaqs,
      };

      const res = await fetch(`/api/temples/${form.templeId}/pujas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        devToast.success("Puja added 🙏");
        setPujas((p) => [...p, data.data]);
        setShowForm(false);
        setForm({ ...EMPTY_FORM, templeId: form.templeId });
        setPackages(DEFAULT_PACKAGES);
        setFaqs([{ question: "", answer: "" }]);
        setActiveTab("basic");
      } else {
        devToast.error(data.error);
      }
    } finally {
      setAdding(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = [
    { key: "name", header: "Name" },
    { key: "nameHi", header: "Hindi", render: (p: PujaRow) => <span className="font-sanskrit text-saffron">{p.nameHi}</span> },
    { key: "price", header: "Base Price", render: (p: PujaRow) => formatCurrency(p.price) },
    { key: "duration", header: "Duration" },
    { key: "packages", header: "Packages", render: (p: PujaRow) => <span className="text-xs">{p.packages?.length ?? 0} tiers</span> },
    { key: "totalBooked", header: "Booked", render: (p: PujaRow) => `${p.totalBooked}+` },
    { key: "isActive", header: "Status", render: (p: PujaRow) => <Badge variant={p.isActive ? "approved" : "rejected"}>{p.isActive ? "Active" : "Inactive"}</Badge> },
  ];

  const tabs = [
    { key: "basic", label: "Basic Info" },
    { key: "packages", label: "Pricing Packages" },
    { key: "faqs", label: "FAQs" },
  ] as const;

  return (
    <DashboardShell
      title="Manage Pujas"
      subtitle="Add and manage puja services with packages and schedules."
      action={
        <Button onClick={() => { setShowForm(!showForm); setActiveTab("basic"); }} size="sm">
          {showForm ? "Cancel" : "+ Add Puja"}
        </Button>
      }
    >
      {temples.length > 1 && (
        <Select
          className="mb-6 max-w-xs"
          options={temples}
          value={form.templeId}
          onChange={(e) => {
            setForm((p) => ({ ...p, templeId: e.target.value }));
            fetchPujas(e.target.value);
          }}
        />
      )}

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg text-foreground">Add New Puja</h3>
            {/* Tab Nav */}
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === tab.key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAdd}>
            {/* ── Tab: Basic Info ── */}
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Puja Name (English)" required value={form.name} onChange={set("name")} placeholder="Rudrabhishek" />
                <Input label="Puja Name (Hindi)" required value={form.nameHi} onChange={set("nameHi")} placeholder="रुद्राभिषेक" />
                <Input label="Base Price (₹)" required value={form.price} onChange={set("price")} type="number" placeholder="2100" />
                <Input label="Duration" required value={form.duration} onChange={set("duration")} placeholder="2 to 2.5 hours" />
                <Input label="Image URL" required value={form.image} onChange={set("image")} placeholder="https://..." />
                <Input
                  label="Schedule Puja Date & Time (optional)"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={set("scheduledAt")}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <Input label="Puja Video URL (YouTube / Vimeo Link)" value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://www.youtube.com/watch?v=..." />
                <Input label="Benefits (comma separated)" value={form.benefits} onChange={set("benefits")} placeholder="Health, Prosperity, Protection" />
                <Input label="Includes (comma separated)" value={form.includes} onChange={set("includes")} placeholder="Abhishek, Aarti, Prasad" className="" />
                <Textarea label="Description (English)" required value={form.description} onChange={set("description")} rows={3} className="md:col-span-2" />
                <Textarea label="Description (Hindi)" required value={form.descriptionHi} onChange={set("descriptionHi")} rows={3} className="md:col-span-2" />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("packages")} size="sm" variant="outline">
                    Next: Pricing Packages →
                  </Button>
                </div>
              </div>
            )}

            {/* ── Tab: Packages ── */}
            {activeTab === "packages" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Set pricing for each devotee tier. Leave price as 0 to disable a tier.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg, i) => (
                    <div key={pkg.label} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{pkg.label}</h4>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {pkg.persons}
                        </span>
                      </div>
                      <Input
                        label="Package Label"
                        value={pkg.label}
                        onChange={(e) => updatePackage(i, "label", e.target.value)}
                        placeholder="Single"
                      />
                      <Input
                        label="Persons Description"
                        value={pkg.persons}
                        onChange={(e) => updatePackage(i, "persons", e.target.value)}
                        placeholder="For 1 person"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Price (₹)"
                          type="number"
                          value={pkg.price || ""}
                          onChange={(e) => updatePackage(i, "price", Number(e.target.value))}
                          placeholder="851"
                        />
                        <Input
                          label="Max Persons"
                          type="number"
                          value={pkg.maxPersons || ""}
                          onChange={(e) => updatePackage(i, "maxPersons", Number(e.target.value))}
                          placeholder="1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={() => setActiveTab("basic")} size="sm" variant="outline">
                    ← Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("faqs")} size="sm" variant="outline">
                    Next: FAQs →
                  </Button>
                </div>
              </div>
            )}

            {/* ── Tab: FAQs ── */}
            {activeTab === "faqs" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add FAQs shown on the puja detail page. Leave empty to use defaults.
                </p>
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-border rounded-xl p-4 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <Input
                      label={`Question ${i + 1}`}
                      value={faq.question}
                      onChange={(e) => updateFaq(i, "question", e.target.value)}
                      placeholder="Why choose us for online Puja booking?"
                    />
                    <Textarea
                      label="Answer"
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      placeholder="Detailed answer..."
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-2 text-sm text-saffron hover:text-saffron/80 font-medium transition-colors"
                >
                  <Plus size={15} /> Add FAQ
                </button>
                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={() => setActiveTab("packages")} size="sm" variant="outline">
                    ← Back
                  </Button>
                  <Button type="submit" loading={adding} size="sm">
                    Add Puja 🙏
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      )}

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <DataTable columns={columns} data={pujas as any} emptyMessage="No pujas added yet." />
    </DashboardShell>
  );
}
