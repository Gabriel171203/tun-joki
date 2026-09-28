import { z } from "zod";

export const feedbackCategoryField = z.enum(["saran", "kritik", "bug", "lainnya"], {
  errorMap: () => ({ message: "Pilih jenis masukan" }),
});

// POST /api/feedback. Nama & email sengaja opsional: masukan anonim tetap
// diterima, kontak hanya dibutuhkan kalau admin ingin membalas.
export const feedbackSchema = z.object({
  category: feedbackCategoryField,
  name: z.string().trim().max(80, "Nama maksimal 80 karakter").optional(),
  email: z
    .union([z.string().email("Format email tidak valid"), z.literal("")])
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tuliskan masukan Anda minimal 10 karakter")
    .max(2000, "Masukan maksimal 2000 karakter"),
  page_source: z.string().trim().max(200).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type FeedbackCategory = z.infer<typeof feedbackCategoryField>;

// GET /api/admin/feedback
export const adminFeedbackQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type AdminFeedbackQuery = z.infer<typeof adminFeedbackQuerySchema>;
