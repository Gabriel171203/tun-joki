import type { NextConfig } from "next";

// next/image hanya boleh memuat gambar remote dari host Supabase project ini
// (bukti bayar/berkas tugas). Pola "**" dulu mengizinkan https apa pun, padahal
// saat ini satu-satunya gambar remote potensial adalah storage Supabase.
// Host diambil dari env supaya tidak ada hostname tebakan di config.
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !url.startsWith("https://") || url.includes("your-project")) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost }]
      : [],
  },
};

export default nextConfig;
