"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { OrderRecord, OrderStatus } from "@/types/order";
import { FeedbackRecord } from "@/types/feedback";
import { ORDER_STATUS_LABELS, SERVICE_CATEGORIES } from "@/lib/constants";
import { formatRupiah, cleanPhoneNumber, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type FeedbackCategory } from "@/lib/validations/feedback";
import {
  Search,
  RefreshCw,
  LogOut,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const TOKEN_KEY = "tuntasin_admin_token";

const STATUS_ORDER: OrderStatus[] = [
  "pending_verification",
  "in_progress",
  "review_ready",
  "revision",
  "completed",
  "cancelled",
];

const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: { variant?: "terracotta" | "emerald" | "navy" | "neutral"; className?: string } }
> = {
  pending_verification: { label: ORDER_STATUS_LABELS.pending_verification, badge: { variant: "neutral" } },
  in_progress: { label: ORDER_STATUS_LABELS.in_progress, badge: { variant: "terracotta" } },
  review_ready: { label: ORDER_STATUS_LABELS.review_ready, badge: { variant: "navy" } },
  revision: {
    label: ORDER_STATUS_LABELS.revision,
    badge: { variant: "terracotta", className: "bg-terracotta-500 text-white border-terracotta-600" },
  },
  completed: { label: ORDER_STATUS_LABELS.completed, badge: { variant: "emerald" } },
  cancelled: { label: ORDER_STATUS_LABELS.cancelled, badge: { variant: "neutral" } },
};

const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-1";

const FEEDBACK_META: Record<
  FeedbackCategory,
  { label: string; badge: { variant?: "terracotta" | "emerald" | "navy" | "neutral"; className?: string } }
> = {
  saran: { label: "Saran", badge: { variant: "navy" } },
  kritik: { label: "Kritik", badge: { variant: "terracotta" } },
  bug: {
    label: "Bug",
    badge: { variant: "terracotta", className: "bg-terracotta-500 text-white border-terracotta-600" },
  },
  lainnya: { label: "Lainnya", badge: { variant: "neutral" } },
};

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const [booted, setBooted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loginErr, setLoginErr] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [checking, setChecking] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<OrderStatus>("pending_verification");
  const [draftNotes, setDraftNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setBooted(true);
  }, []);

  const logout = useCallback((msg?: string) => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setOrders([]);
    setTotal(0);
    setExpandedId(null);
    setFeedback([]);
    setFeedbackTotal(0);
    setFeedbackError("");
    if (msg) setLoginErr(msg);
  }, []);

  const authHeaders = useCallback(
    (): Record<string, string> => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
    }),
    [token]
  );

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (q) params.set("q", q);
      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout("Token tidak valid, silakan masuk ulang.");
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        orders?: OrderRecord[];
        total?: number;
        error?: string;
      } | null;
      if (!res.ok || !data?.success) {
        setError(data?.error || `Gagal memuat pesanan (HTTP ${res.status})`);
        return;
      }
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError("Server tidak terjangkau. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, q, logout]);

  useEffect(() => {
    if (token) loadOrders();
  }, [token, loadOrders]);

  const loadFeedback = useCallback(async () => {
    if (!token) return;
    setFeedbackLoading(true);
    setFeedbackError("");
    try {
      const res = await fetch("/api/admin/feedback?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout("Token tidak valid, silakan masuk ulang.");
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        feedback?: FeedbackRecord[];
        total?: number;
        error?: string;
        message?: string;
      } | null;
      if (!res.ok || !data?.success) {
        setFeedbackError(data?.error || data?.message || `Gagal memuat masukan (HTTP ${res.status})`);
        return;
      }
      setFeedback(data.feedback ?? []);
      setFeedbackTotal(data.total ?? 0);
    } catch {
      setFeedbackError("Server tidak terjangkau. Coba lagi.");
    } finally {
      setFeedbackLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) loadFeedback();
  }, [token, loadFeedback]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = tokenInput.trim();
    if (!value) {
      setLoginErr("Token wajib diisi");
      return;
    }
    setChecking(true);
    setLoginErr("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (res.status === 401) {
        setLoginErr("Token tidak valid");
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setLoginErr(data?.error || `Gagal masuk (HTTP ${res.status})`);
        return;
      }
      localStorage.setItem(TOKEN_KEY, value);
      setTokenInput("");
      setToken(value);
    } catch {
      setLoginErr("Server tidak terjangkau");
    } finally {
      setChecking(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(searchInput.trim());
    setExpandedId(null);
  };

  const toggleExpand = (o: OrderRecord) => {
    if (expandedId === o.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(o.id);
    setDraftStatus(o.status);
    setDraftNotes(o.admin_notes ?? "");
    setSaveMsg(null);
  };

  const handleSave = async (o: OrderRecord) => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${o.order_code}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: draftStatus, admin_notes: draftNotes }),
      });
      if (res.status === 401) {
        logout("Token tidak valid, silakan masuk ulang.");
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        order?: OrderRecord;
        error?: string;
        message?: string;
        issues?: { message: string }[];
      } | null;
      if (!res.ok || !data?.success) {
        setSaveMsg({
          ok: false,
          text: data?.issues?.[0]?.message || data?.error || data?.message || "Gagal menyimpan",
        });
        return;
      }
      if (data.order) {
        setOrders((prev) => prev.map((x) => (x.id === data.order!.id ? data.order! : x)));
      }
      setSaveMsg({ ok: true, text: "Tersimpan" });
    } catch {
      setSaveMsg({ ok: false, text: "Server tidak terjangkau" });
    } finally {
      setSaving(false);
    }
  };

  if (!booted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white border-2 border-earth-200 rounded-3xl p-8 space-y-4 shadow-warm-lg"
        >
          
          <div>
            <h1 className="text-xl font-black text-navy-950">Masuk Admin</h1>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-token" className="text-xs font-bold text-earth-800 block">
              Token Admin
            </label>
            <input
              id="admin-token"
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              autoComplete="off"
              placeholder="tempel token di sini"
              className={cn(
                "w-full px-4 py-2.5 min-h-[44px] rounded-xl border-2 border-earth-500 text-sm text-navy-950 placeholder:text-earth-500",
                focusRing
              )}
            />
          </div>
          {loginErr && (
            <p role="alert" className="text-xs font-semibold text-terracotta-700">
              {loginErr}
            </p>
          )}
          <Button type="submit" isLoading={checking} className="w-full">
            Masuk
          </Button>
        </form>
      </div>
    );
  }

  const hasFilter = Boolean(q || statusFilter);

  return (
    <div className="py-10 md:py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950">Admin Pesanan</h1>
          <p className="text-sm text-earth-600 mt-0.5">
            {loading ? "Memuat pesanan..." : `${total} pesanan`}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => logout()}>
          <LogOut className="w-4 h-4" />
          Keluar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          <label htmlFor="status-filter" className="sr-only">
            Filter status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setExpandedId(null);
            }}
            className={cn(
              "px-3 py-2 min-h-[44px] rounded-xl border-2 border-earth-500 bg-white text-sm font-semibold text-earth-800",
              focusRing
            )}
          >
            <option value="">Semua status</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          <Button variant="ghost" size="sm" onClick={loadOrders} disabled={loading} title="Muat ulang">
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Muat ulang
          </Button>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:max-w-xs sm:ml-auto">
          <label htmlFor="search-orders" className="sr-only">
            Cari pesanan
          </label>
          <input
            id="search-orders"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari kode / nama pemesan..."
            className={cn(
              "flex-1 min-w-0 px-4 py-2 min-h-[44px] rounded-xl border-2 border-earth-500 bg-white text-sm text-navy-950 placeholder:text-earth-500",
              focusRing
            )}
          />
          <Button type="submit" variant="secondary" size="sm">
            <Search className="w-4 h-4" />
            Cari
          </Button>
        </form>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-terracotta-50 border-2 border-terracotta-200"
        >
          <p className="text-sm font-semibold text-terracotta-800">{error}</p>
          <Button variant="outline" size="sm" onClick={loadOrders}>
            Coba lagi
          </Button>
        </div>
      )}

      {loading && orders.length === 0 && !error && (
        <div className="flex items-center justify-center gap-3 py-16 text-earth-600">
          <div className="w-6 h-6 border-[3px] border-terracotta-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Memuat pesanan...</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-16 bg-white border-2 border-dashed border-earth-200 rounded-3xl">
          <p className="font-bold text-earth-800">
            {hasFilter ? "Tidak ada pesanan yang cocok." : "Belum ada pesanan masuk."}
          </p>
          <p className="text-sm text-earth-600 mt-1.5 px-6">
            {hasFilter
              ? "Ubah kata kunci atau pilih “Semua status” lalu coba lagi."
              : "Pesanan baru dari halaman /order akan muncul di sini."}
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {orders.map((o) => {
          const categoryTitle =
            SERVICE_CATEGORIES.find((c) => c.id === o.service_category)?.title ??
            o.service_category;
          const isOpen = expandedId === o.id;

          return (
            <li key={o.id} className="bg-white border-2 border-earth-200 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleExpand(o)}
                aria-expanded={isOpen}
                className={cn(
                  "w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-earth-50/70 transition-colors",
                  focusRing
                )}
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-navy-950">{o.order_code}</span>
                    <Badge {...STATUS_META[o.status].badge}>{STATUS_META[o.status].label}</Badge>
                    {o.is_anonymous && (
                      <Badge variant="neutral" className="border-dashed">
                        Anonim
                      </Badge>
                    )}
                  </div>
                  <p className="font-semibold text-earth-900 text-sm sm:text-base break-words">
                    {o.task_title}
                  </p>
                  <p className="text-xs text-earth-600">
                    {o.client_name} · {categoryTitle} ·{" "}
                    {o.estimated_price > 0 ? formatRupiah(o.estimated_price) : "Biaya menyusul"} ·{" "}
                    {formatDateTime(o.created_at)}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 shrink-0 text-earth-500 transition-transform mt-1",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="border-t-2 border-earth-200 bg-earth-50/70 p-4 sm:p-5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div>
                      <p className="text-xs font-bold text-earth-700">
                        Pemesan
                      </p>
                      <p className="font-semibold text-navy-950 mt-0.5 break-words">{o.client_name}</p>
                      {o.email && (
                        <a
                          href={`mailto:${o.email}`}
                          className={cn(
                            "block text-xs font-semibold text-earth-700 hover:text-terracotta-700 underline underline-offset-2 break-all mt-0.5",
                            focusRing
                          )}
                        >
                          {o.email}
                        </a>
                      )}
                      <a
                        href={`https://wa.me/${cleanPhoneNumber(o.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2",
                          focusRing
                        )}
                      >
                        <Image src="/whatsapp-logo.png" alt="" aria-hidden width={20} height={20} className="w-3.5 h-3.5" />
                        Chat {o.whatsapp}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-earth-700">
                        Deadline
                      </p>
                      <p className="font-semibold text-navy-950 mt-0.5">
                        {formatDateTime(o.deadline_date)}
                      </p>
                      <p className="text-xs text-earth-600 mt-1">
                        Total {o.estimated_price > 0 ? formatRupiah(o.estimated_price) : "-"} · DP{" "}
                        {o.dp_amount > 0 ? formatRupiah(o.dp_amount) : "-"} · {categoryTitle}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-bold text-earth-700">
                        Instruksi Tugas
                      </p>
                      <p className="text-earth-800 mt-1 whitespace-pre-line break-words">
                        {o.task_description}
                      </p>
                    </div>
                    {(o.task_file_url || o.payment_proof_url) && (
                      <div className="sm:col-span-2 flex flex-wrap gap-2">
                        {o.task_file_url && (
                          <a
                            href={o.task_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-earth-200 text-xs font-bold text-earth-800 hover:border-terracotta-300",
                              focusRing
                            )}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {o.task_file_name || "File Tugas"}
                          </a>
                        )}
                        {o.payment_proof_url && (
                          <a
                            href={o.payment_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-earth-200 text-xs font-bold text-earth-800 hover:border-terracotta-300",
                              focusRing
                            )}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Bukti Bayar QRIS
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-earth-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor={`status-${o.id}`} className="text-xs font-bold text-earth-800 block">
                          Status Pesanan
                        </label>
                        <select
                          id={`status-${o.id}`}
                          value={draftStatus}
                          onChange={(e) => {
                            setDraftStatus(e.target.value as OrderStatus);
                            setSaveMsg(null);
                          }}
                          className={cn(
                            "w-full px-3 py-2 min-h-[44px] rounded-xl border-2 border-earth-500 bg-white text-sm font-semibold text-navy-950",
                            focusRing
                          )}
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor={`notes-${o.id}`} className="text-xs font-bold text-earth-800 block">
                          Catatan Admin
                        </label>
                        <textarea
                          id={`notes-${o.id}`}
                          value={draftNotes}
                          onChange={(e) => {
                            setDraftNotes(e.target.value);
                            setSaveMsg(null);
                          }}
                          rows={3}
                          maxLength={2000}
                          placeholder="Mis. DP sudah diverifikasi, sedang dikerjakan tim."
                          className={cn(
                            "w-full px-3 py-2 min-h-[44px] rounded-xl border-2 border-earth-500 bg-white text-sm text-navy-950 placeholder:text-earth-500 resize-y",
                            focusRing
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={saving}
                        onClick={() => handleSave(o)}
                      >
                        Simpan Perubahan
                      </Button>
                      {saveMsg && (
                        <p
                          role="status"
                          className={cn(
                            "text-xs font-bold",
                            saveMsg.ok ? "text-emerald-700" : "text-terracotta-700"
                          )}
                        >
                          {saveMsg.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="feedback-heading" className="pt-6 border-t-2 border-earth-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="feedback-heading" className="text-lg font-black text-navy-950">
              Masukan Pengunjung
            </h2>
            <p className="text-sm text-earth-600 mt-0.5">
              {feedbackLoading
                ? "Memuat masukan..."
                : feedbackError
                  ? "Belum bisa dimuat"
                  : `${feedbackTotal} masukan dari halaman Kritik & Saran`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={loadFeedback} disabled={feedbackLoading}>
            <RefreshCw className={cn("w-4 h-4", feedbackLoading && "animate-spin")} />
            Muat ulang
          </Button>
        </div>

        {feedbackError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-terracotta-50 border-2 border-terracotta-200"
          >
            <p className="text-sm font-semibold text-terracotta-800">{feedbackError}</p>
            <Button variant="outline" size="sm" onClick={loadFeedback}>
              Coba lagi
            </Button>
          </div>
        )}

        {feedbackLoading && feedback.length === 0 && !feedbackError && (
          <div className="flex items-center justify-center gap-3 py-10 text-earth-600">
            <div className="w-6 h-6 border-[3px] border-terracotta-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold">Memuat masukan...</p>
          </div>
        )}

        {!feedbackLoading && !feedbackError && feedback.length === 0 && (
          <div className="text-center py-10 bg-white border-2 border-dashed border-earth-200 rounded-3xl">
            <p className="font-bold text-earth-800">Belum ada masukan.</p>
            <p className="text-sm text-earth-600 mt-1.5 px-6">
              Kritik dan saran yang dikirim lewat halaman /feedback akan muncul di sini.
            </p>
          </div>
        )}

        {feedback.length > 0 && (
          <ul className="space-y-3">
            {feedback.map((f) => {
              const meta = FEEDBACK_META[f.category] ?? FEEDBACK_META.lainnya;
              return (
                <li key={f.id} className="bg-white border-2 border-earth-200 rounded-2xl p-4 sm:p-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge {...meta.badge}>{meta.label}</Badge>
                    {!f.name && (
                      <Badge variant="neutral" className="border-dashed">
                        Anonim
                      </Badge>
                    )}
                    <span className="text-xs text-earth-600 ml-auto">{formatDateTime(f.created_at)}</span>
                  </div>
                  <p className="text-sm sm:text-base text-earth-900 whitespace-pre-line break-words">
                    {f.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-earth-600">
                    {f.name && (
                      <span>
                        {f.name}
                        {f.email && (
                          <a
                            href={`mailto:${f.email}`}
                            className={cn(
                              "font-semibold text-earth-700 hover:text-terracotta-700 underline underline-offset-2 ml-1.5 break-all",
                              focusRing
                            )}
                          >
                            {f.email}
                          </a>
                        )}
                      </span>
                    )}
                    {f.page_source && <span>Halaman: {f.page_source}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!feedbackLoading && !feedbackError && feedbackTotal > feedback.length && (
          <p className="text-xs text-earth-600 text-center">
            Menampilkan {feedback.length} masukan terbaru dari {feedbackTotal}.
          </p>
        )}
      </section>
    </div>
  );
}
