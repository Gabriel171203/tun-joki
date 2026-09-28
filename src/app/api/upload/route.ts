import { NextRequest, NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// Upload berkas kini hanya lewat endpoint ini (memakai service role).
// Anon key tidak punya izin tulis ke bucket, jadi orang lain tidak bisa
// menumpang-numpang upload lewat browser mereka sendiri.
const RATE_LIMIT = { limit: 20, windowMs: 10 * 60 * 1000 };

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TASK_SIZE = 25 * 1024 * 1024; // 25MB

const IMAGE_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Ekstensi yang boleh untuk berkas tugas. html/svg/js sengaja tidak ada:
// bucket ini bersifat publik, berkas semacam itu bisa dipakai menyamar
// sebagai halaman yang dibuka langsung lewat tautan.
const TASK_EXTENSIONS = [
  "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
  "txt", "csv", "zip", "rar",
  "jpg", "jpeg", "png", "webp",
  "mp4", "mov", "webm",
];

function bad(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot < 0 || dot === name.length - 1) return "";
  return name.slice(dot + 1).toLowerCase();
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "_").replace(/\s+/g, " ").trim().slice(0, 255);
}

function validate(
  bucket: string,
  file: File
): { ok: true; extension: string } | { ok: false; error: string } {
  if (file.size <= 0) return { ok: false, error: "Berkas kosong" };

  if (bucket === "payment-proofs") {
    const extension = IMAGE_MIME[file.type.toLowerCase()];
    if (!extension) {
      return { ok: false, error: "Format bukti bayar harus JPG, PNG, atau WEBP" };
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return { ok: false, error: "Ukuran bukti bayar melebihi 5 MB" };
    }
    return { ok: true, extension };
  }

  const extension = extensionOf(file.name);
  if (!TASK_EXTENSIONS.includes(extension)) {
    return { ok: false, error: `Format .${extension || "?"} tidak diizinkan untuk berkas tugas` };
  }
  if (file.size > MAX_TASK_SIZE) {
    return { ok: false, error: "Ukuran berkas tugas melebihi 25 MB" };
  }
  return { ok: true, extension };
}

export async function POST(req: NextRequest) {
  try {
    const limited = await checkRateLimit(`upload:${clientIp(req)}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak permintaan upload, coba lagi beberapa menit lagi" },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
      );
    }

    if (!adminSupabase) {
      return NextResponse.json(
        { success: false, error: "Storage belum dikonfigurasi di server" },
        { status: 503 }
      );
    }

    const form = await req.formData().catch(() => null);
    if (!form) return bad("Format permintaan tidak valid");

    const bucket = form.get("bucket");
    const file = form.get("file");

    if (typeof bucket !== "string" || (bucket !== "payment-proofs" && bucket !== "task-files")) {
      return bad("Bucket tidak dikenal");
    }
    if (!(file instanceof File)) return bad("Berkas tidak ditemukan");

    const fileName = sanitizeFileName(file.name) || "berkas";
    const checked = validate(bucket, file);
    if (!checked.ok) return bad(checked.error);

    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 15);
    const storagePath = `${Date.now()}_${uniqueId}.${checked.extension}`;

    const { error } = await adminSupabase.storage.from(bucket).upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengunggah berkas, coba lagi" },
        { status: 500 }
      );
    }

    const { data } = adminSupabase.storage.from(bucket).getPublicUrl(storagePath);
    return NextResponse.json({ success: true, url: data.publicUrl, file_name: fileName });
  } catch (err: unknown) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
