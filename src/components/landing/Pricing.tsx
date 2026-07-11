"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { useAuthModal } from "@/components/AuthModalProvider";

const TEMPLATES = [
  { amount: 2, cycles: "20" },
  { amount: 5, cycles: "50" },
  { amount: 10, cycles: "100" },
  { amount: 15, cycles: "150" },
  { amount: 30, cycles: "300" },
  { amount: 50, cycles: "515", bonus: "+3%" },
  { amount: 100, cycles: "1050", bonus: "+5%" },
];

const INCLUDES = [
  "$0.10 per successful reply draft",
  "Free if Gate 1 rejects the lead",
  "$2.00 free credits on signup",
  "3 free reply cycles every week, forever",
];

export function Pricing() {
  const { open } = useAuthModal();
  return (
    <Container id="pricing" className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-base font-medium uppercase tracking-wider text-accent">
          Pricing
        </p>
        <h2 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          Simple, transparent pricing.
        </h2>
        <p className="mt-3 text-muted">
          No subscription. Pay for what you use.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-3xl border border-accent/30 bg-surface p-8 text-center glow-accent">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-5xl font-bold text-text">$0.10</span>
            <span className="text-lg text-muted">/ reply draft</span>
          </div>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Charged only when Gate 2 successfully generates a ready-to-send
            draft. Rejected leads cost nothing.
          </p>

          <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left">
            {INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex justify-center">
            <Button size="lg" onClick={open}>
              Get Started Free
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-8 max-w-3xl">
        <p className="text-center text-sm font-medium text-muted">
          Top up anytime — pick a template or enter any amount from $2
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {TEMPLATES.map((t) => (
            <div
              key={t.amount}
              className="rounded-xl border border-border bg-surface px-3 py-4 text-center transition-colors hover:border-accent/40"
            >
              <div className="text-lg font-bold text-text">${t.amount}</div>
              <div className="mt-1 text-xs text-muted">{t.cycles} cycles</div>
              {t.bonus && (
                <div className="mt-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                  {t.bonus}
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}