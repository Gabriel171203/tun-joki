import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project")
);

// Inisialisasi Supabase client jika environment variables sudah diisi
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Upload berkas lewat POST /api/upload (validasi + penulisan di server).
// Anon key tidak punya izin tulis ke bucket, jadi client tidak bisa upload
// langsung. Mode mock (Supabase belum dikonfigurasi) memakai data URL karena
// memang tidak ada tujuan penyimpanan. Kalau Supabase sudah dikonfigurasi tapi
// upload gagal, error diteruskan ke caller: data URL ratusan KB jangan sampai
// tersimpan ke database.
export async function uploadFileToStorage(
  file: File,
  bucketName: "payment-proofs" | "task-files"
): Promise<{ url: string; fileName: string; isMock?: boolean }> {
  const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 255);

  if (!isSupabaseConfigured) {
    return { url: await toDataUrl(file), fileName: sanitizedOriginal, isMock: true };
  }

  const formData = new FormData();
  formData.append("bucket", bucketName);
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = (await res.json().catch(() => null)) as {
    success?: boolean;
    url?: string;
    file_name?: string;
    error?: string;
  } | null;

  if (!res.ok || !data?.success || !data.url) {
    throw new Error(data?.error || `Upload gagal (HTTP ${res.status})`);
  }

  return { url: data.url, fileName: data.file_name || sanitizedOriginal, isMock: false };
}

async function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
