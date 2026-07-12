import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Check } from "lucide-react";

const GROUPS = [
  {
    title: "Monitoring & Scraping",
    items: [
      "Free-text keyword search for X (boolean operators supported)",
      "Username tracking for Instagram",
      "Maximum of 5 active targets per platform",
      "Auto-polling every 10–15 minutes",
      "Automated deduplication (no duplicate leads)",
    ],
  },
  {
    title: "AI Pipeline",
    items: [
      "Free Gate 1 (relevance & sentiment filter)",
      "Gate 2 full personalization based on app profile",
      "150-second timeout per cycle, guaranteed no hanging",
      "Draft replies adjusted for platform limits (262 chars X, 500 chars IG)",
    ],
  },
  {
    title: "Reply & Safety",
    items: [
      "Semi-auto: click send on X, copy+paste on Instagram",
      "No automated posting bots — 100% human-in-the-loop",
      "Edit drafts before sending",
    ],
  },
  {
    title: "Billing",
    items: [
      "Pay per use, no monthly subscription",
      "Top-up any amount starting at $2, or use quick templates",
      "5 free cycles every week, forever",
      "Transparent transaction history",
    ],
  },
  {
    title: "Security & Data",
    items: [
      "Google OAuth login, no passwords to manage",
      "Row Level Security — other users' data is never visible",
      "Payment webhooks verified with signature + idempotency",
    ],
  },
];

export function FeatureReference() {
  return (
    <Container className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
          All the <span className="font-serif italic font-normal">features</span> you were hoping for.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <div className="flex flex-wrap justify-center gap-6">
          {GROUPS.map((group) => (
            <div
              key={group.title}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-2xl border border-[#1b1b1f] border-t-white/10 bg-[#111114] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_8px_16px_rgba(0,0,0,0.4)]"
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
        </div>
      </Reveal>
    </Container>
  );
}