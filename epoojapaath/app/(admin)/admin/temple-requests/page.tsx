"use client";

import { useEffect, useState } from "react";
import {
  Search, Trash2, Phone, Mail, Calendar, MapPin,
  User, Building2, MessageSquare, AlertTriangle, X, Check,
} from "lucide-react";
import { devToast } from "@/lib/toast";
import { ITempleRequest } from "@/types";

function ConfirmDialog({
  msg,
  onConfirm,
  onCancel,
  loading,
}: {
  msg: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={22} />
          <h3 className="font-heading text-foreground">Confirm Delete?</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{msg}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium disabled:opacity-50 transition"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TempleRequestsPage() {
  const [requests, setRequests] = useState<ITempleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Delete action states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status updating states
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/temple-requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
      } else {
        devToast.error(data.error || "Failed to load requests");
      }
    } catch {
      devToast.error("An error occurred loading requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/temple-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        devToast.success("Status updated successfully! 🙏");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus as any } : r))
        );
      } else {
        devToast.error(data.error || "Failed to update status");
      }
    } catch {
      devToast.error("An error occurred updating status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/temple-requests/${deletingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        devToast.success("Request deleted successfully");
        setRequests((prev) => prev.filter((r) => r._id !== deletingId));
        setDeletingId(null);
      } else {
        devToast.error(data.error || "Failed to delete request");
      }
    } catch {
      devToast.error("An error occurred deleting request");
    } finally {
      setDeleteLoading(false);
    }
  }

  // Clean phone helper for WhatsApp
  function getWhatsAppLink(phone: string, contactName: string, templeName: string) {
    const cleanDigits = phone.replace(/\D/g, "");
    // Prepend India country code if 10 digits
    const targetPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    const text = encodeURIComponent(
      `Jai Shree Ram/Namaste ${contactName}, thank you for requesting a listing for ${templeName} on ePoojapaath. Let's connect to set up your temple profile. 🙏`
    );
    return `https://api.whatsapp.com/send?phone=${targetPhone}&text=${text}`;
  }

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.templeName.toLowerCase().includes(search.toLowerCase()) ||
      r.contactName.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.state.toLowerCase().includes(search.toLowerCase()) ||
      (r.phone && r.phone.includes(search)) ||
      (r.email && r.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "contacted":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border border-gray-500/20";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Temple Requests Manager</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage public temple onboarding listing requests. Directly contact, track onboarding statuses, or update logs.
          </p>
        </div>
        <div className="bg-saffron/10 border border-saffron/20 rounded-2xl px-4 py-2 text-saffron text-sm font-semibold flex items-center gap-1.5">
          🛕 {requests.filter(r => r.status === "pending").length} Pending Requests
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search temple name, contact person, location, phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-card border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
        >
          <option value="">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="contacted">📞 Contacted</option>
          <option value="completed">✅ Completed</option>
          <option value="rejected">❌ Rejected</option>
        </select>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-4xl animate-bounce">🛕</div>
          <p className="text-sm text-muted-foreground font-medium">Loading requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl">
          <Building2 size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-heading text-lg text-foreground">No Requests Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {requests.length === 0
              ? "No public request submissions have been made yet."
              : "No requests match your current search/filter parameters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((req) => (
            <div
              key={req._id}
              className="bg-card border border-border hover:border-saffron/30 rounded-2xl p-5 transition-all shadow-sm flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden"
            >
              {/* Highlight bar for pending */}
              {req.status === "pending" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
              )}

              {/* Left Column: Temple & Deity */}
              <div className="flex-1 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-xl shrink-0 mt-0.5">
                    🛕
                  </div>
                  <div>
                    <h3 className="font-heading text-base text-foreground leading-snug">
                      {req.templeName}
                    </h3>
                    <p className="text-xs text-saffron font-medium mt-0.5">
                      {req.deity ? `Deity: ${req.deity}` : "Deity: Not Specified"}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                      <MapPin size={13} className="text-muted-foreground/60" />
                      <span>{req.city}, {req.state}</span>
                    </div>
                  </div>
                </div>

                {/* notes */}
                {req.notes && (
                  <div className="bg-muted/40 border border-border rounded-xl p-3 text-xs text-muted-foreground flex gap-2">
                    <MessageSquare size={13} className="shrink-0 mt-0.5 text-muted-foreground/75" />
                    <p className="leading-relaxed whitespace-pre-line">{req.notes}</p>
                  </div>
                )}

                {/* attribution */}
                {(req.utmSource || req.utmMedium || req.utmCampaign || req.fbclid) && (
                  <div className="bg-saffron/5 border border-saffron/10 rounded-xl p-3 text-[11px] text-foreground/80 flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                    <span className="font-semibold text-saffron">Attribution:</span>
                    {req.utmSource && <span>Source: <strong className="select-all font-semibold">{req.utmSource}</strong></span>}
                    {req.utmMedium && <span>Medium: <strong className="select-all font-semibold">{req.utmMedium}</strong></span>}
                    {req.utmCampaign && <span>Campaign: <strong className="select-all font-semibold">{req.utmCampaign}</strong></span>}
                    {req.fbclid && <span className="truncate max-w-[200px]" title={req.fbclid}>fbclid: <strong className="select-all font-semibold">{req.fbclid}</strong></span>}
                  </div>
                )}
              </div>

              {/* Middle Column: Owner / Contact Details */}
              <div className="w-full md:w-72 shrink-0 space-y-3 md:border-l md:border-border md:pl-5">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-muted-foreground/60" />
                  <span className="text-xs font-semibold text-foreground">{req.contactName}</span>
                </div>

                <div className="flex flex-col gap-2.5 pt-1">
                  {/* Phone / Whatsapp */}
                  <div className="flex items-center justify-between gap-2 bg-muted/30 hover:bg-muted/65 border border-border/80 rounded-xl p-2.5 transition">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 select-all">
                      📞 {req.phone}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      <a
                        href={`tel:${req.phone}`}
                        title="Direct Call"
                        className="p-1 text-muted-foreground hover:text-saffron hover:bg-saffron/10 rounded-lg transition"
                      >
                        <Phone size={13} />
                      </a>
                      <a
                        href={getWhatsAppLink(req.phone, req.contactName, req.templeName)}
                        target="_blank"
                        rel="noreferrer"
                        title="WhatsApp Chat"
                        className="p-1 text-muted-foreground hover:text-green-500 hover:bg-green-500/10 rounded-lg transition flex items-center gap-0.5 text-[10px] font-bold"
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.028 14.07 1.01 11.5 1.012c-5.443 0-9.859 4.37-9.863 9.8-.001 1.83.5 3.61 1.45 5.212L1.896 20.02l4.75-1.248zM17.41 14.16c-.318-.16-1.884-.93-2.175-1.038-.29-.108-.502-.162-.713.162-.21.324-.813 1.028-.996 1.244-.183.216-.366.243-.684.08-1.545-.772-2.55-1.4-3.567-2.316-.27-.243-.27-.39 0-.63.243-.243.684-.813.813-1.083.13-.27.065-.502-.032-.693-.098-.19-.713-1.72-.977-2.355-.26-.622-.52-.53-.713-.53-.183 0-.39-.027-.597-.027s-.543.08-.827.39c-.284.31-.1.084-1.087 1.084-.987 1-.987 2.625 0 3.625.987 1 2.87 2.87 5.795 4.13.693.3 1.236.48 1.658.615.697.22 1.33.19 1.83.115.557-.08 1.884-.77 2.15-1.514.266-.74.266-1.38.187-1.514-.08-.135-.29-.216-.607-.378z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Email if exists */}
                  {req.email ? (
                    <a
                      href={`mailto:${req.email}`}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-saffron hover:bg-saffron/10 border border-border/80 rounded-xl p-2.5 transition"
                    >
                      <Mail size={13} className="text-muted-foreground/60" />
                      <span className="truncate select-all">{req.email}</span>
                    </a>
                  ) : (
                    <div className="border border-dashed border-border/80 text-muted-foreground/45 rounded-xl p-2.5 text-center text-[10px] font-medium select-none">
                      No Email Provided
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Status & Date & Delete */}
              <div className="w-full md:w-44 shrink-0 flex md:flex-col justify-between items-center md:items-end gap-3 md:border-l md:border-border md:pl-5">
                {/* Date */}
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 font-semibold uppercase tracking-wider">
                    <Calendar size={10} />
                    <span>Submitted</span>
                  </div>
                  <div className="text-xs font-semibold text-foreground/80 mt-0.5">
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Status selector */}
                <div className="w-full space-y-1.5 md:mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                      Status
                    </span>
                    {updatingId === req._id && (
                      <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin text-saffron" />
                    )}
                  </div>
                  <select
                    value={req.status}
                    disabled={updatingId === req._id}
                    onChange={(e) => handleUpdateStatus(req._id, e.target.value)}
                    className={`w-full text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none transition ${getStatusBadgeClass(
                      req.status
                    )}`}
                  >
                    <option value="pending" className="bg-card text-foreground font-semibold">⏳ Pending</option>
                    <option value="contacted" className="bg-card text-foreground font-semibold">📞 Contacted</option>
                    <option value="completed" className="bg-card text-foreground font-semibold">✅ Completed</option>
                    <option value="rejected" className="bg-card text-foreground font-semibold">❌ Rejected</option>
                  </select>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => setDeletingId(req._id)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition md:mt-auto"
                  title="Delete Request Lead"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <ConfirmDialog
          msg="Are you sure you want to permanently delete this temple request record? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
