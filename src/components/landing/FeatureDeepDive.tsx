"use client";

import { Container } from "@/components/ui/Container";
import Image from "next/image";

const CARDS = [
  {
    num: "01",
    title: "Dual-Platform Monitoring",
    description: [
      "Undercut watches X and Instagram simultaneously. On X, it performs keyword and boolean search across public posts. On Instagram, it tracks usernames you define.",
      "Every 10 to 15 minutes, fresh complaints surface in your dashboard — ",
      { serif: true, text: "without you lifting a finger." },
    ],
    illustration: "/feature-monitor.png",
  },
  {
    num: "02",
    title: "Two-Gate AI Filter",
    description: [
      "Not every complaint is worth your time. Gate 1 runs a free relevance check on every post. Only complaints that pass are forwarded to Gate 2, where a full reply is drafted using your product context, tone of voice, and target audience.",
      { serif: true, text: "You pay only when a lead is genuinely worth pursuing." },
    ],
    illustration: "/feature-filter.png",
  },
  {
    num: "03",
    title: "Personalized Replies, Ready to Send",
    description: [
      "Gate 2 knows your product, your brand voice, and the character limits of each platform. The reply it produces is tailored, not templated. Edit it if you want. Or simply click send.",
      { serif: true, text: "Your words, your account, your reputation — always in your control." },
    ],
    illustration: "/feature-reply.png",
  },
];

type Segment = string | { serif: true; text: string };

function CardDescription({ segments }: { segments: Segment[] }) {
  return (
    <p className="text-base leading-relaxed text-muted">
      {segments.map((seg, i) =>
        typeof seg === "string" ? (
          <span key={i}>{seg}</span>
        ) : (
          <em key={i} className="font-serif not-italic text-white/80">
            {seg.text}
          </em>
        )
      )}
    </p>
  );
}

function StickyCard({
  card,
  index,
}: {
  card: (typeof CARDS)[0];
  index: number;
}) {
  return (
    <div
      className="sticky"
      style={{ top: "110px", zIndex: 10 + index * 10 }}
    >
      <div className="rounded-3xl border border-[#1b1b1f] border-t-white/10 border-b-[5px] border-b-black/90 bg-gradient-to-b from-[#131316] to-[#0c0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_24px_48px_rgba(0,0,0,0.65)] overflow-hidden lg:h-[460px] hover:border-accent/40 transition-colors duration-300">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:h-full">
          {/* Left: text */}
          <div className="flex flex-col justify-center p-10 lg:p-14 lg:h-full">
            <span className="font-sans font-semibold text-sm text-white mb-6 block tracking-wider">
              +{card.num}&nbsp;&nbsp;/&nbsp;&nbsp;0{CARDS.length}
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6">
              {card.title}
            </h3>
            <CardDescription segments={card.description} />
          </div>

          {/* Right: illustration */}
          <div className="relative flex items-center justify-center border-t border-border lg:border-t-0 lg:border-l bg-[#0d0d11] min-h-[300px] lg:min-h-0 lg:h-full">
            <Image
              src={card.illustration}
              alt={card.title}
              width={440}
              height={360}
              className="object-contain p-8 drop-shadow-[0_0_48px_rgba(59,130,246,0.25)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureDeepDive() {
  return (
    <Container id="features" className="py-24 sm:py-32">
      {/* Section heading */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
          Three features.{" "}
          <span className="font-serif italic font-normal">One unfair advantage.</span>
        </h2>
      </div>

      {/* Sticky cards stacking area with robust spacer layout */}
      <div className="relative">
        <StickyCard card={CARDS[0]} index={0} />
        <div className="h-[35vh]" />
        
        <StickyCard card={CARDS[1]} index={1} />
        <div className="h-[35vh]" />
        
        <StickyCard card={CARDS[2]} index={2} />
        <div className="h-[25vh]" />
      </div>
    </Container>
  );
}