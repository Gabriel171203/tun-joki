-- ========================================================
-- SCHEMA DATABASE: PLATFORM JOKI AKADEMIK & IT (Tuntasin)
-- Jalankan query ini di SQL Editor dashboard Supabase Anda.
-- ========================================================

-- 1. Buat enum status pesanan
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending_verification',  -- Menunggu konfirmasi bukti transfer
        'in_progress',           -- DP terverifikasi, tugas sedang dikerjakan
        'review_ready',          -- Draft tugas siap direview client
        'revision',              -- Dalam proses revisi
        'completed',             -- Pelunasan & tugas selesai
        'cancelled'              -- Dibatalkan
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Buat tabel orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(32) UNIQUE NOT NULL,       -- Misal: TS-2026-X89K
    client_name VARCHAR(100) NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    whatsapp VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    education_level VARCHAR(30) NOT NULL,         -- SMA/SMK, D3, S1, S2, Umum
    service_category VARCHAR(50) NOT NULL,        -- it_dev, academic_doc, media_presentation
    task_title VARCHAR(200) NOT NULL,
    task_description TEXT NOT NULL,
    deadline_date TIMESTAMP WITH TIME ZONE NOT NULL,
    difficulty VARCHAR(30) DEFAULT 'medium',      -- easy, medium, hard
    estimated_price NUMERIC(12, 2) NOT NULL,      -- Total harga estimasi
    dp_amount NUMERIC(12, 2) NOT NULL,             -- Nominal DP minimal (50%)
    task_file_url TEXT,                           -- URL berkas soal tugas
    task_file_name VARCHAR(255),
    payment_proof_url TEXT,                       -- URL screenshot resi QRIS
    status order_status DEFAULT 'pending_verification',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON public.orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp ON public.orders(whatsapp);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 3. Row Level Security (RLS)
-- RLS aktif tanpa policy publik: semua baca/tulis tabel orders hanya lewat
-- API routes di server (src/app/api/orders) memakai SUPABASE_SERVICE_ROLE_KEY,
-- yang bypass RLS. Anon key tidak punya akses tabel, jadi nomor WA client
-- tidak bisa ditarik orang lain dari browser.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can read order by order_code" ON public.orders;

-- 4. Storage: buat 2 bucket publik (bisa dibaca lewat tautan) + cabut izin
-- upload anon. Upload kini hanya lewat POST /api/upload yang memakai
-- SUPABASE_SERVICE_ROLE_KEY, jadi anon key tidak bisa menulis ke bucket.
-- Idempoten, aman dijalankan ulang. Jalankan ulang SQL ini di project yang
-- sudah ada untuk mencabut policy upload lama.
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true),
       ('task-files', 'task-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public upload task files" ON storage.objects;

-- Baca bucket publik tidak perlu policy tambahan: URL publik
-- (getPublicUrl) sudah terbuka untuk bucket ber-flag public.

-- 5. Feedback kritik & saran dari pengunjung
-- Idempoten, aman dijalankan ulang.
DO $$ BEGIN
    CREATE TYPE feedback_category AS ENUM ('saran', 'kritik', 'bug', 'lainnya');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category feedback_category NOT NULL,
    name VARCHAR(80),                                -- opsional: boleh anonim
    email VARCHAR(100),                              -- opsional: hanya untuk balasan admin
    message TEXT NOT NULL,
    page_source VARCHAR(200),                        -- halaman asal saat menulis masukan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- RLS deny-all seperti orders: anon tidak bisa membaca/menulis langsung,
-- semua akses lewat API memakai SUPABASE_SERVICE_ROLE_KEY (lihat
-- src/app/api/feedback dan src/app/api/admin/feedback).
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

