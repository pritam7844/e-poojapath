"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { devToast } from "@/lib/toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [form,    setForm]    = useState({ name: "", phone: "", city: "", gotra: "", language: "en" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const u = data.data;
            setForm({
              name: u.name || "",
              phone: u.phone || "",
              city: u.city || "",
              gotra: u.gotra || "",
              language: u.language || "en",
            });
          }
        })
        .catch((err) => console.error("Error loading profile:", err));
    }
  }, [session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await update({ name: form.name });
        devToast.success("Profile updated 🙏");
      } else devToast.error(data.error);
    } catch { devToast.error("Update failed"); }
    finally { setLoading(false); }
  }

  return (
    <DashboardShell title="My Profile" subtitle="Keep your devotional profile up to date.">
      <div className="max-w-xl">
        <Card>
          <form onSubmit={handleSave} className="space-y-5">
            <Input label="Full Name"     required placeholder="Your full name" value={form.name}     onChange={(e) => setForm({ ...form, name:     e.target.value })} />
            <Input label="Phone Number"  placeholder="+91 XXXXX XXXXX"         value={form.phone}    onChange={(e) => setForm({ ...form, phone:    e.target.value })} />
            <Input label="City"          placeholder="Your city"                value={form.city}     onChange={(e) => setForm({ ...form, city:     e.target.value })} />
            <Input label="Gotra"         placeholder="e.g. Kashyap, Bharadwaj" value={form.gotra}    onChange={(e) => setForm({ ...form, gotra:    e.target.value })} />
            <Select
              label="Preferred Language"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              options={[{ value: "en", label: "English" }, { value: "hi", label: "हिंदी" }]}
            />
            <Button type="submit" loading={loading} fullWidth>Save Changes</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
