"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const FAQS = [
  {
    q: "Apakah Undercut mem-posting balasan secara otomatis?",
    a: "Tidak. Anda selalu yang menekan tombol kirim. Kami hanya menyiapkan draf. Tidak ada bot background — semua lewat klik manual dari akun Anda sendiri, jadi risiko shadowban tidak berlaku di sini.",
  },
  {
    q: "Apa bedanya input keyword (X) dan username (Instagram)?",
    a: "Di X, sistem mencari postingan berdasarkan keyword/hashtag bebas yang Anda tentukan. Di Instagram, sistem memantau postingan terbaru dari akun kompetitor via username-nya — karena Instagram tidak mendukung pencarian kata kunci bebas seandal X.",
  },
  {
    q: "Apakah ada biaya jika postingan tidak relevan?",
    a: "Tidak. Gate 1 (filter relevansi) 100% gratis. Biaya $0.10 hanya dipotong jika Gate 2 berhasil membuat draf balasan.",
  },
  {
    q: "Bagaimana urutan pemakaian saldo — demo gratis dulu atau kredit dulu?",
    a: "Demo gratis mingguan dipakai duluan secara otomatis. Kredit berbayar baru dipotong setelah demo minggu itu habis. Setiap akun dapat 3 siklus gratis per minggu yang reset otomatis tiap 7 hari.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "GoPay, QRIS, Virtual Account semua bank besar, dan kartu kredit/debit — semua via Midtrans. Saldo tidak ada kadaluarsa dan berlaku selamanya.",
  },
  {
    q: "Berapa lama saldo kredit berlaku?",
    a: "Tidak ada kadaluarsa. Saldo kredit berlaku selamanya. Hanya kuota demo mingguan yang reset tiap 7 hari.",
  },
  {
    q: "Apakah ada batasan jumlah kompetitor yang bisa dipantau?",
    a: "Di MVP, maksimal 5 target aktif per platform (5 keyword X + 5 username Instagram). Cukup untuk fokus dan efektif.",
  },
  {
    q: "Kenapa harus isi profil aplikasi sebelum mulai?",
    a: "Karena Gate 2 butuh konteks nyata — aplikasi, target audiens, tone — supaya draf balasannya tidak generik, melainkan disesuaikan dengan nilai keunggulan aplikasi Anda. Tanpa ini, hasilnya cuma template kosong.",
  },
  {
    q: "Apakah aman dari shadowban?",
    a: "Ya. Karena tidak ada posting otomatis (semua lewat klik manual dari akun Anda sendiri), risiko yang biasanya datang dari bot spam tidak berlaku di sini.",
  },
  {
    q: "Data saya aman?",
    a: "Row Level Security aktif di semua tabel — secara teknis, user lain tidak bisa query data Anda sama sekali, bukan cuma disembunyikan di UI. Semua dienkripsi di Postgres Supabase.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Container id="faq" className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-base font-medium uppercase tracking-wider text-accent">
          FAQ
        </p>
        <h2 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          Questions? Answered.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base font-medium text-text">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-muted"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-8 text-sm leading-relaxed text-muted">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Reveal>
    </Container>
  );
}