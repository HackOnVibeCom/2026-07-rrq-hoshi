"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const FAQS = [
  {
    q: "Does Undercut post replies automatically?",
    a: "No. You are always the one pressing the send button. We only prepare drafts. There are no background bots — everything goes through manual clicks from your own account, so shadowban risks do not apply here.",
  },
  {
    q: "What's the difference between X (Twitter) keywords and Instagram usernames?",
    a: "On X, the system searches for posts based on free keywords/hashtags that you specify. On Instagram, the system monitors new posts from competitor accounts via their usernames — because Instagram does not support free keyword searches as reliably as X.",
  },
  {
    q: "Is there a charge if a post is not relevant?",
    a: "No. Gate 1 (relevance filter) is 100% free. The $0.10 cost is only deducted if Gate 2 successfully generates a reply draft.",
  },
  {
    q: "What is the order of credit usage — free demo first or paid credit first?",
    a: "Weekly free demo credits are used first automatically. Paid credits are only deducted after that week's demo credit is exhausted. Every account gets 5 free cycles per week, which reset automatically every 7 days.",
  },
  {
    q: "What payment methods are available?",
    a: "Credit/debit cards, Apple Pay, Google Pay, and Link — all processed securely via Stripe. Balance never expires and is valid forever.",
  },
  {
    q: "How long is the credit balance valid?",
    a: "There is no expiration. Credit balance is valid forever. Only the weekly demo quota resets every 7 days.",
  },
  {
    q: "Is there a limit to the number of competitors I can monitor?",
    a: "In the MVP, a maximum of 5 active targets per platform (5 X keywords + 5 Instagram usernames). This is enough to keep you focused and effective.",
  },
  {
    q: "Why do I need to fill out my app profile before starting?",
    a: "Because Gate 2 needs real context — app name, target audience, tone — so that draft replies are not generic, but tailored to your app's unique value proposition. Without this, you'd just get empty templates.",
  },
  {
    q: "Is it safe from shadowbans?",
    a: "Yes. Since there is no automated posting (everything goes through manual clicks from your own account), the risk that usually comes from spam bots does not apply here.",
  },
  {
    q: "Is my data secure?",
    a: "Row Level Security is active on all tables — technically, other users cannot query your data at all, not just hidden in the UI. Everything is encrypted in Supabase Postgres.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Container id="faq" className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
          Questions? <span className="font-serif italic font-normal">Answered.</span>
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