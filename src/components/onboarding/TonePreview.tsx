"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ToneOfVoice } from "@/lib/types";
import { Sparkles } from "lucide-react";

const SAMPLE_COMPLAINT =
  "Ugh, @CompetitorApp keeps deleting my notes. What's a real alternative? Looking for something that just works.";

const TONE_SAMPLES: Record<ToneOfVoice, { emoji: string; label: string }> = {
  professional: { emoji: "💼", label: "Professional" },
  friendly: { emoji: "🙌", label: "Friendly" },
  casual: { emoji: "💬", label: "Casual" },
  playful: { emoji: "🎭", label: "Playful" },
};

function replyForTone(tone: ToneOfVoice, appName: string, diff: string) {
  const app = appName || "MyApp";
  const diffText = diff || "autosaves every keystroke";
  switch (tone) {
    case "professional":
      return `Apologies for the disruption. ${app} is designed to prevent exactly this — ${diffText}. A free trial is available if you'd like to evaluate it.`;
    case "friendly":
      return `Ouch, that's rough 🙌 I built ${app} so this never happens — ${diffText}. Free trial if you wanna swap 👇`;
    case "casual":
      return `man that sucks. ${app} does ${diffText}. free trial if you wanna try something that actually saves your drafts`;
    case "playful":
      return `Tell me about it 😅 ${app} eats note-eating gremlins for breakfast. ${diffText}. Try free — your drafts will thank you 🙌`;
  }
}

export function TonePreview({
  tone,
  appName,
  differentiator,
}: {
  tone: ToneOfVoice;
  appName: string;
  differentiator: string;
}) {
  const reply = replyForTone(tone, appName, differentiator);
  const meta = TONE_SAMPLES[tone];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
          Sample complaint
        </span>
        <p className="mt-2 text-sm text-muted">{SAMPLE_COMPLAINT}</p>
      </div>
      <div className="rounded-xl border border-accent/40 bg-surface p-4 glow-accent">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
            <Sparkles size={11} /> {meta.emoji} {meta.label} reply
          </span>
          <motion.span
            key={tone}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[10px] text-muted"
          >
            live preview
          </motion.span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={reply}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm leading-relaxed text-text"
          >
            {reply}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}