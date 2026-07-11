"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { XIcon, InstagramIcon } from "@/components/ui/BrandIcons";
import { useAuthModal } from "@/components/AuthModalProvider";

const EXAMPLES = [
  {
    platform: "X",
    author: "@frust_dev",
    complaint:
      "Used @CompetitorApp for 2 years but the sync is broken AGAIN. Lost a whole week of notes. Looking for an alternative tbh.",
    reply:
      "Ugh, losing notes is the worst. I built MyApp with offline-first sync so drafts never disappear — even on flaky wifi. Free trial if you wanna swap 👇",
  },
  {
    platform: "Instagram",
    author: "@marketingguy",
    complaint:
      "Why is @CompetitorApp charging $40/mo now and STILL showing ads? This is getting ridiculous 🤦",
    reply:
      "Right?? Paying AND getting ads is rough. MyApp is $9/mo, zero ads, no upsell treadmill. First month free if you DM me 🙌",
  },
  {
    platform: "X",
    author: "@startup_founder",
    complaint:
      "@CompetitorApp customer support hasn't replied in 5 days. FIVE DAYS. Anyone know a tool that actually answers tickets?",
    reply:
      "Heard you — 5 days is unacceptable. MyApp has 24h SLA on every plan, even free. We answer tickets ourselves, no bots. Want a test account?",
  },
];

function Typewriter({ text }: { text: string }) {
  const [typed, setTyped] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      indexRef.current += 1;
      setTyped(text.slice(0, indexRef.current));
      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(tick, 18);
      }
    };
    timerRef.current = setTimeout(tick, 350);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text]);

  return (
    <p className="text-sm leading-relaxed text-text">
      {typed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="ml-0.5 inline-block h-4 w-0.5 bg-accent align-middle"
      />
    </p>
  );
}

export function LiveDemoWidget() {
  const { open } = useAuthModal();
  const [index, setIndex] = useState(0);
  const example = EXAMPLES[index];
  const next = () => setIndex((p) => (p + 1) % EXAMPLES.length);

  return (
    <Container className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-base font-medium uppercase tracking-wider text-accent">
          Live demo
        </p>
        <h2 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          See it in action
        </h2>
        <p className="mt-3 text-muted">
          A real complaint. An AI-drafted reply. In seconds.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                {example.platform === "X" ? (
                  <XIcon style={{ fontSize: 12 }} />
                ) : (
                  <InstagramIcon style={{ fontSize: 12 }} />
                )}
                Complaint
              </span>
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted transition-colors hover:text-text"
              >
                <RefreshCw size={12} />
                Try another
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <p className="text-xs font-semibold text-muted">{example.author}</p>
                <p className="mt-2 text-sm leading-relaxed text-text">
                  {example.complaint}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rounded-2xl border border-accent/40 bg-surface p-5 glow-accent">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              Undercut&apos;s Reply
            </span>
            <div className="mt-4 min-h-[88px]">
              <Typewriter key={index} text={example.reply} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted">
              <span>tone: friendly · 240 chars</span>
              <span className="text-accent">draft ready</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="primary" onClick={open}>
            This could be your reply. Try it free
            <ArrowRight size={18} />
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}