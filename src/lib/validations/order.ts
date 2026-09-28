import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const whatsappField = z
  .string()
  .min(9, "Nomor WhatsApp minimal 9 digit")
  .max(16, "Nomor WhatsApp maksimal 16 digit")
  .regex(/^[0-9+]+$/, "Nomor WhatsApp hanya boleh angka dan tanda +");

const educationLevelField = z.enum(["SMA/SMK", "D3", "S1", "S2", "Umum"], {
  errorMap: () => ({ message: "Pilih jenjang pendidikan" }),
});

const serviceCategoryField = z.enum(["it_dev", "academic_doc", "media_presentation"], {
  errorMap: () => ({ message: "Pilih kategori layanan tugas" }),
});

const difficultyField = z.enum(["easy", "medium", "hard"], {
  errorMap: () => ({ message: "Pilih tingkat kesulitan" }),
});

export const orderCodeSchema = z
  .string()
  .regex(/^TS-\d{4}-[A-Z0-9]{4,6}$/, "Format kode pesanan tidak valid");

// Tautan berkas hanya boleh https absolut atau data-URL base64 (mode mock
// saat Supabase Storage gagal/belum dikonfigurasi). javascript:/data:text-html
// diblokir karena field ini dirender jadi <href> di halaman admin dan tracking.
const MAX_FILE_URL_LENGTH = 40 * 1024 * 1024; // data-URL mock: file 25MB → ~33MB base64
const SCRIPTABLE_MIME = ["text/html", "application/xhtml+xml", "image/svg+xml", "text/xml", "application/xml"];

function isMockDataUrl(value: string): boolean {
  const comma = value.indexOf(",");
  if (comma < 0) return false;

  const header = value.slice(0, comma).toLowerCase();
  if (!header.endsWith(";base64")) return false;

  const mime = header.slice("data:".length, -";base64".length);
  if (SCRIPTABLE_MIME.includes(mime)) return false;
  if (!/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/.test(mime)) return false;

  return /^[A-Za-z0-9+/]+={0,2}$/.test(value.slice(comma + 1));
}

function isSafeFileUrl(value: string): boolean {
  if (value.startsWith("data:")) return isMockDataUrl(value);
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

const fileUrlField = z
  .string()
  .min(1)
  .max(MAX_FILE_URL_LENGTH, "Tautan berkas terlalu panjang")
  .refine(isSafeFileUrl, { message: "Tautan berkas harus https atau data URL base64" });

export const orderStep1Schema = z.object({
  client_name: z.string().min(2, "Nama minimal 2 karakter").max(80, "Nama maksimal 80 karakter"),
  is_anonymous: z.boolean().default(false),
  whatsapp: whatsappField,
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  education_level: educationLevelField,
  service_category: serviceCategoryField,
  task_title: z.string().min(3, "Judul tugas minimal 3 karakter").max(150, "Judul tugas terlalu panjang"),
  task_description: z.string().min(10, "Berikan instruksi/deskripsi tugas minimal 10 karakter"),
  deadline_date: z.string().min(1, "Tentukan tanggal deadline"),
  deadline_time: z.string().min(1, "Tentukan jam deadline"),
  difficulty: difficultyField,
  task_file_url: z.string().optional(),
  task_file_name: z.string().optional(),
});

export const orderStep3Schema = z.object({
  payment_proof_url: z.string().min(1, "Bukti pembayaran QRIS wajib diunggah"),
});

// Skema untuk POST /api/orders. Field privileged (admin_notes, status selain
// pending_verification, id, created_at) sengaja tidak didefinisikan di sini
// sehingga Zod membuangnya dari payload. order_code juga tidak ada: kode
// pesanan dibuat di server dengan CSPRNG, bukan dipercaya dari client.
export const orderCreateSchema = z.object({
  client_name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80, "Nama maksimal 80 karakter"),
  is_anonymous: z.boolean(),
  whatsapp: whatsappField,
  email: z.union([z.string().email("Format email tidak valid"), z.literal("")]).optional(),
  education_level: educationLevelField,
  service_category: serviceCategoryField,
  task_title: z.string().trim().min(3, "Judul tugas minimal 3 karakter").max(150, "Judul tugas terlalu panjang"),
  task_description: z.string().trim().min(10, "Deskripsi tugas minimal 10 karakter"),
  deadline_date: z.string().datetime({ offset: true, message: "Deadline harus format ISO 8601" }),
  difficulty: difficultyField,
  estimated_price: z.number().min(0, "Harga tidak boleh negatif").max(100_000_000, "Harga tidak wajar"),
  dp_amount: z.number().min(0, "DP tidak boleh negatif").max(100_000_000, "DP tidak wajar"),
  task_file_url: fileUrlField.optional(),
  task_file_name: z.string().max(255).optional(),
  payment_proof_url: fileUrlField.optional(),
});

export type OrderStep1Input = z.infer<typeof orderStep1Schema>;
export type OrderStep3Input = z.infer<typeof orderStep3Schema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export const orderStatusField = z.enum(
  ["pending_verification", "in_progress", "review_ready", "revision", "completed", "cancelled"],
  { errorMap: () => ({ message: "Status pesanan tidak dikenal" }) }
);

// GET /api/admin/orders
export const adminListQuerySchema = z.object({
  status: orderStatusField.optional(),
  q: z
    .string()
    .trim()
    .max(100, "Kata kunci pencarian maksimal 100 karakter")
    // Karakter ini adalah sintaks filter PostgREST .or(), buang agar
    // input user tidak bisa menyuntik kondisi filter tambahan.
    .transform((v) => v.replace(/[(),]/g, ""))
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// PATCH /api/admin/orders/[code]
export const adminUpdateSchema = z
  .object({
    status: orderStatusField.optional(),
    admin_notes: z.string().max(2000, "Catatan admin maksimal 2000 karakter").optional(),
  })
  .refine((d) => d.status !== undefined || d.admin_notes !== undefined, {
    message: "Tidak ada perubahan: isi status atau admin_notes",
  });

export type AdminListQuery = z.infer<typeof adminListQuerySchema>;
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>;

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Format berkas bukti bayar harus berupa gambar (JPG, PNG, atau WEBP)." };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: "Ukuran berkas melebihi batas maksimal 5 MB." };
  }
  return { valid: true };
}

export function validateTaskFile(file: File): { valid: boolean; error?: string } {
  const maxDocSize = 25 * 1024 * 1024; // 25MB
  if (file.size > maxDocSize) {
    return { valid: false, error: "Ukuran berkas tugas melebihi batas maksimal 25 MB." };
  }
  return { valid: true };
}
