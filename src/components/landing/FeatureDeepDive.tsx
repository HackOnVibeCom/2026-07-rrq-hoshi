import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface FeatureBlock {
  badge: string;
  headline: string;
  description: string;
  cards: { icon: string; label: string }[];
  tactic: { title: string; steps: string[] };
  mockup: React.ReactNode;
}

const BLOCKS: FeatureBlock[] = [
  {
    badge: "Blok 1 — Dual Platform Monitoring",
    headline: "Monitor X and Instagram, the right way for each.",
    description:
      "X pakai keyword/boolean search, Instagram pakai username karena keterbatasan native search-nya — dijelaskan jujur, bukan disembunyikan.",
    cards: [
      { icon: "🎯", label: "Free-text query di X" },
      { icon: "👤", label: "Username tracking di IG" },
      { icon: "🔄", label: "Polling otomatis tiap 10–15 menit" },
    ],
    tactic: {
      title: "Tactic example",
      steps: [
        "Tambahkan @CompetitorApp lambat sebagai target X",
        "Tambahkan tokopedia sebagai target IG",
        "Undercut mulai memantau keduanya secara paralel",
      ],
    },
    mockup: <PlatformMockup />,
  },
  {
    badge: "Blok 2 — Double-Gate AI Pipeline",
    headline: "Two AI gates. Zero wasted spend.",
    description:
      "Gate 1 (gratis) menyaring, Gate 2 (berbayar $0.10) hanya jalan kalau lead beneran relevan.",
    cards: [
      { icon: "🆓", label: "Gate 1 selalu gratis" },
      { icon: "⚡", label: "Gate 2 pakai DeepSeek V4 Flash" },
      { icon: "⏱️", label: "Maksimal 150 detik per siklus" },
    ],
    tactic: {
      title: "Tactic example",
      steps: [
        "Postingan masuk dari scraper",
        "Gate 1 cek relevansi dalam hitungan detik",
        "Kalau lolos, Gate 2 langsung siapkan draf siap kirim",
      ],
    },
    mockup: <GateMockup />,
  },
  {
    badge: "Blok 3 — App-Personalized Replies",
    headline: "Replies that sound like you, not a bot.",
    description:
      "Karena Gate 2 tahu app_description, target_audience, dan tone_of_voice dari profil aplikasi, balasannya bukan template generik.",
    cards: [
      { icon: "✍️", label: "4 pilihan tone of voice" },
      { icon: "🎯", label: "Konteks produk tersimpan sekali" },
      { icon: "🔁", label: "Edit draf sebelum kirim, kapan saja" },
    ],
    tactic: {
      title: "Tactic example",
      steps: [
        "Isi profil sekali saat onboarding",
        "Semua balasan otomatis pakai konteks itu",
        "Update profil kapan saja, balasan berikutnya menyesuaikan",
      ],
    },
    mockup: <ToneMockup />,
  },
];

export function FeatureDeepDive() {
  return (
    <Container id="features" className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-base font-medium uppercase tracking-wider text-accent">
          Features
        </p>
        <h2 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          Built to do the heavy lifting for you
        </h2>
      </Reveal>

      <div className="mt-16 space-y-24">
        {BLOCKS.map((block, i) => (
          <FeatureRow key={block.headline} block={block} reverse={i % 2 === 1} />
        ))}
      </div>
    </Container>
  );
}

function FeatureRow({
  block,
  reverse,
}: {
  block: FeatureBlock;
  reverse: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(reverse && "lg:order-2")}>
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          {block.badge}
        </span>
        <h3 className="mt-3 text-2xl font-bold text-text sm:text-3xl">
          {block.headline}
        </h3>
        <p className="mt-4 text-base text-muted">{block.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {block.cards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-surface px-3 py-3 text-center"
            >
              <div className="text-xl">{c.icon}</div>
              <p className="mt-1.5 text-xs font-medium text-text">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {block.tactic.title}
          </p>
          <ol className="mt-3 space-y-3">
            {block.tactic.steps.map((step, si) => (
              <li key={si} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {si + 1}
                </span>
                <span className="text-sm text-muted">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal delay={0.1} className={cn(reverse && "lg:order-1")}>
        {block.mockup}
      </Reveal>
    </div>
  );
}

function PlatformMockup() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl">
      <div className="flex gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium text-text">
          X (Twitter)
          <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">4</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-muted">
          Instagram
          <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px]">2</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2.5">
          <span className="text-xs text-muted">@CompetitorApp lambat</span>
          <span className="h-2 w-2 rounded-full bg-success" />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2.5">
          <span className="text-xs text-muted">#CompetitorFail OR slow</span>
          <span className="h-2 w-2 rounded-full bg-success" />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2.5">
          <span className="text-xs text-accent">@TokopediaCare OR lambat</span>
          <span className="h-2 w-2 rounded-full bg-warning" />
        </div>
      </div>
    </div>
  );
}

function GateMockup() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl">
      <div className="space-y-3">
        <div className="rounded-xl border border-success/30 bg-success/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-success">GATE 1 — Filter</span>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
              PASSED · FREE
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">
            “This app keeps deleting my notes…” → complaint detected, relevance
            0.91
          </p>
        </div>
        <div className="flex justify-center text-muted">↓</div>
        <div className="rounded-xl border border-accent/40 bg-accent/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent">GATE 2 — Generator</span>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
              DRAFT READY · $0.10
            </span>
          </div>
          <p className="mt-2 text-xs text-text">
            “Sorry to hear that — I built MyApp with auto-save so this never
            happens. Free trial 👇”
          </p>
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted">
            <span>model: deepseek-chat</span>
            <span>128ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToneMockup() {
  const tones = ["Professional", "Friendly", "Casual", "Playful"];
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Tone of voice
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {tones.map((t, i) => (
          <div
            key={t}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              i === 1
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface-2 text-muted"
            )}
          >
            {t}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Live preview
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text">
          Hey! Hearing you on the crashes — that sucks. MyApp autosaves every
          keystroke so you never lose work again. Wanna try it free? 🙌
        </p>
      </div>
    </div>
  );
}