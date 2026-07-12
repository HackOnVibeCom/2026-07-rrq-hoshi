"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ToneOfVoice } from "@/lib/types";

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

function VerifiedBadge() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-label="Verified account"
      className="inline-block h-[15px] w-[15px] select-none fill-current text-[#1d9bf0]"
    >
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.408-.17-.868-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.408.17.868.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 4L6 12.5l1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5-8 8z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-muted/40"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TweetCard({
  authorName,
  authorHandle,
  avatar,
  verified,
  text,
  timestamp,
  retweets,
  quotes,
  likes,
  badgeText,
  badgeColor,
}: {
  authorName: string;
  authorHandle: string;
  avatar: string;
  verified: boolean;
  text: string;
  timestamp: string;
  retweets: string;
  quotes: string;
  likes: string;
  badgeText: string;
  badgeColor: string;
}) {
  const formatText = (content: string) => {
    return content.split(" ").map((word, idx) => {
      const isMentionOrTag = word.startsWith("@") || word.startsWith("#");
      return (
        <span
          key={idx}
          className={isMentionOrTag ? "font-semibold text-blue-400" : ""}
        >
          {word}{" "}
        </span>
      );
    });
  };

  return (
    <div className="flex h-full min-h-[290px] flex-col justify-between rounded-3xl border border-[#1b1b1f] border-t-white/10 border-b-[5px] border-b-black/90 bg-gradient-to-b from-[#131316] to-[#0c0c0e] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_20px_40px_rgba(0,0,0,0.55)]">
      <div>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/40 bg-surface-2">
              <img
                src={avatar}
                alt={authorName}
                className={`h-full w-full ${avatar.includes('LogoUndercut.svg') ? 'object-contain p-1' : 'object-cover'}`}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authorName
                  )}&background=1d9bf0&color=fff`;
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold leading-tight text-text">
                  {authorName}
                </span>
                {verified && <VerifiedBadge />}
              </div>
              <span className="mt-0.5 text-xs text-muted leading-tight">
                {authorHandle}
              </span>
            </div>
          </div>
          <XLogo />
        </div>

        {/* Badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}
          >
            {badgeText}
          </span>
        </div>

        {/* Text */}
        <p className="text-sm font-normal leading-relaxed text-text">
          {formatText(text)}
        </p>
      </div>

      <div>
        {/* Timestamp */}
        <p className="mt-4 text-[10px] text-muted select-none">{timestamp}</p>

        {/* Divider */}
        <div className="my-2.5 border-t border-border/30" />

        {/* Stats */}
        <div className="flex items-center gap-4 text-[10px] text-muted select-none">
          <span>
            <strong className="font-bold text-text">{retweets}</strong> Retweets
          </span>
          <span>
            <strong className="font-bold text-text">{quotes}</strong> Quotes
          </span>
          <span>
            <strong className="font-bold text-text">{likes}</strong> Likes
          </span>
        </div>
      </div>
    </div>
  );
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
  const app = appName || "MyApp";
  const reply = replyForTone(tone, appName, differentiator);
  const meta = TONE_SAMPLES[tone];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: Complaint card */}
      <TweetCard
        authorName="Marcus Aurelius"
        authorHandle="@marcus_stores"
        avatar="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
        verified={false}
        text={SAMPLE_COMPLAINT}
        timestamp="12:47 PM · Jun 2, 2026"
        retweets="03"
        quotes="04"
        likes="16"
        badgeText="Sample complaint"
        badgeColor="bg-danger/10 text-danger border border-danger/20"
      />

      {/* Right: Reply draft card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={reply}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="h-full"
        >
          <TweetCard
            authorName={`${app} (AI Draft)`}
            authorHandle={`@${app.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
            avatar="/LogoUndercut.svg"
            verified={true}
            text={reply}
            timestamp="12:48 PM · Jun 2, 2026"
            retweets="01"
            quotes="00"
            likes="01"
            badgeText={`${meta.label} reply`}
            badgeColor="bg-success/10 text-success border border-success/20"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}