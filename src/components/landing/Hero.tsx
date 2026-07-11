"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { XIcon, InstagramIcon } from "@/components/ui/BrandIcons";
import { useAuthModal } from "@/components/AuthModalProvider";

function ComplaintCard() {
  return (
    <div
      className="absolute left-0 top-10 hidden w-64 lg:block"
      style={{ transform: "perspective(900px) rotateY(16deg) rotateX(6deg)" }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-xl border border-border bg-surface p-4 shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-muted">
            @
          </div>
          <div>
            <p className="text-sm font-semibold text-text">frustrated_user</p>
            <p className="text-xs text-muted">@frust_dev</p>
          </div>
          <div className="ml-auto text-muted">
            <XIcon style={{ fontSize: 14 }} />
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Ugh, @CompetitorApp keeps crashing everytime I open it. Lost all my
          drafts twice this week. Why is there no alternative? 😤
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <MessageSquare size={12} />
          10:22 PM · just now
        </div>
      </motion.div>
    </div>
  );
}

function ReplyCard() {
  return (
    <div
      className="absolute right-0 bottom-0 hidden w-72 lg:block"
      style={{ transform: "perspective(900px) rotateY(-16deg) rotateX(-4deg)" }}
    >
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className="rounded-xl border border-accent/40 bg-surface p-4 shadow-2xl glow-accent"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Check size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Draft ready</p>
            <p className="text-xs text-muted">Undercut · Gate 2</p>
          </div>
          <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
            280 chars
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text">
          Sorry to hear the drafts keep disappearing — that&apos;s rough. I made
          <span className="text-accent"> MyApp</span> exactly for this: autosave
          every keystroke, offline-first. Free trial if you want to test it 👇
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">
            <Send size={12} /> Reply on X
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { open } = useAuthModal();

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <Badge className="border-accent/30 bg-accent/10 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Built for HackOnVibe 2026
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl"
          >
            Turn competitor complaints into your{" "}
            <span className="text-gradient">next customers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl"
          >
            Undercut watches X and Instagram for people complaining about your
            competitors — AI drafts the reply, you just hit send.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-9 flex flex-col items-center gap-3"
          >
            <Button size="lg" onClick={open} className="w-full sm:w-auto">
              Start Free — No Card Needed
              <ArrowRight size={18} />
            </Button>
            <p className="text-sm text-muted">
              3 free replies every week. Forever.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10 flex items-center justify-center gap-5 text-xs text-muted"
          >
            <span className="inline-flex items-center gap-1.5">
              <XIcon style={{ fontSize: 14 }} /> X / Twitter
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <InstagramIcon style={{ fontSize: 14 }} /> Instagram
            </span>
          </motion.div>
        </div>

        <div className="relative mx-auto mt-16 h-[340px] max-w-4xl">
          <ComplaintCard />
          <ReplyCard />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 glow-accent"
            >
              <ArrowRight className="text-accent" size={28} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-6 max-w-md rounded-lg border border-border bg-surface/60 p-3 text-center text-xs text-muted lg:hidden"
          >
            Live demo: complaint → AI draft → one-click reply
          </motion.div>
        </div>
      </div>
    </section>
  );
}