import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Check } from "lucide-react";

const GROUPS = [
  {
    title: "Monitoring & Scraping",
    items: [
      "Free-text keyword search untuk X (boolean operator didukung)",
      "Username tracking untuk Instagram",
      "Maksimal 5 target aktif per platform",
      "Polling otomatis tiap 10–15 menit",
      "Deduplikasi otomatis (tidak ada lead dobel)",
    ],
  },
  {
    title: "AI Pipeline",
    items: [
      "Gate 1 gratis (relevance & sentiment filter)",
      "Gate 2 personalisasi penuh berdasarkan profil perusahaan",
      "Timeout 150 detik per siklus, dijamin tidak menggantung",
      "Draf balasan disesuaikan panjang platform (280 char X, 500 char IG)",
    ],
  },
  {
    title: "Reply & Safety",
    items: [
      "Semi-auto: klik kirim di X, salin+tempel di Instagram",
      "Tidak ada bot posting otomatis — 100% human-in-the-loop",
      "Edit draf sebelum kirim",
    ],
  },
  {
    title: "Billing",
    items: [
      "Bayar per pemakaian, tanpa langganan bulanan",
      "Top-up nilai bebas mulai $2, atau template cepat",
      "3 siklus gratis tiap minggu, selamanya",
      "Riwayat transaksi transparan",
    ],
  },
  {
    title: "Keamanan & Data",
    items: [
      "Login Google OAuth, tanpa password untuk dikelola",
      "Row Level Security — data user lain tidak pernah terlihat",
      "Webhook pembayaran terverifikasi signature + idempotent",
    ],
  },
];

export function FeatureReference() {
  return (
    <Container className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-base font-medium uppercase tracking-wider text-accent">
          Full reference
        </p>
        <h2 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          All the features you were hoping for
        </h2>
        <p className="mt-3 text-muted">
          Everything Undercut does — no docs page needed, it&apos;s all here.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-text">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Container>
  );
}