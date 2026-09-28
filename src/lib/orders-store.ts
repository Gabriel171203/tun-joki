import { OrderRecord } from "@/types/order";

const LOCAL_STORAGE_KEY = "tuntasin_user_orders";

// orderCode dihasilkan server; client hanya memakainya untuk display/mirror
// lokal, jadi kode asli dari client tidak pernah dipercaya.
export type SaveOrderResult = { success: boolean; error?: string; orderCode?: string };

export async function saveOrder(order: OrderRecord): Promise<SaveOrderResult> {
  // Mirror lokal agar kode pesanan tetap bisa dilacak di perangkat ini
  // meski server sedang tidak terjangkau.
  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const orders: OrderRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      orders.unshift(order);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders.slice(0, 20)));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }
  }

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = (await res.json().catch(() => null)) as {
      success?: boolean;
      error?: string;
      message?: string;
      order_code?: string;
    } | null;

    if (!res.ok || !data?.success) {
      const message = data?.error || data?.message || `HTTP ${res.status}`;
      console.error("Gagal menyimpan pesanan via API:", message);
      return { success: false, error: message };
    }

    if (data.order_code) {
      syncLocalOrderCode(order.id, data.order_code);
      return { success: true, orderCode: data.order_code };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghubungi server";
    console.error("Error saving order:", message);
    return { success: false, error: message };
  }
}

// Ganti kode sementara di mirror lokal dengan kode resmi dari server.
function syncLocalOrderCode(orderId: string, orderCode: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;
    const orders: OrderRecord[] = JSON.parse(raw);
    const target = orders.find((o) => o.id === orderId);
    if (!target || target.order_code === orderCode) return;
    target.order_code = orderCode;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn("Gagal sinkron kode pesanan lokal:", e);
  }
}

export async function getOrderByCode(code: string): Promise<OrderRecord | null> {
  const trimmed = code.trim().toUpperCase();

  // 1. Cari lewat API (database saat Supabase aktif, 404 saat mode mock)
  try {
    const res = await fetch(`/api/orders/track?code=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      const data = (await res.json()) as { success?: boolean; order?: OrderRecord };
      if (data?.success && data.order) return data.order;
    }
  } catch (e) {
    console.warn("Track API tidak terjangkau:", e);
  }

  // 2. Cek localStorage perangkat ini
  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (existingRaw) {
        const orders: OrderRecord[] = JSON.parse(existingRaw);
        const match = orders.find((o) => o.order_code.toUpperCase() === trimmed);
        if (match) return match;
      }
    } catch (e) {
      console.warn("LocalStorage search error:", e);
    }
  }

  // 3. Fallback dummy record jika pengguna mengetik contoh kode pesanan
  if (trimmed === "TS-DEMO" || trimmed === "TS-2026-DEMO") {
    return {
      id: "demo-id",
      order_code: "TS-2026-DEMO",
      client_name: "Mahasiswa Contoh",
      is_anonymous: true,
      whatsapp: "085812345678",
      education_level: "S1",
      service_category: "it_dev",
      task_title: "Aplikasi Web Pemesanan Tiket Bioskop (React + Tailwind)",
      task_description: "Buat halaman login, katalog film, dan checkout film dengan state management.",
      deadline_date: new Date(Date.now() + 86400000 * 2).toISOString(),
      difficulty: "medium",
      estimated_price: 350000,
      dp_amount: 175000,
      payment_proof_url: "/qris-image.webp",
      status: "in_progress",
      admin_notes: "DP telah terkonfirmasi. Tim developer sedang menyusun komponen frontend.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return null;
}
