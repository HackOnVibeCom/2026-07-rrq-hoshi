import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { UserPlus, Target, Filter, Sparkles, Send } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Set up your profile",
    desc: "Isi info produk sekali. AI butuh ini untuk balasan yang personal.",
  },
  {
    icon: Target,
    title: "Add competitors",
    desc: "X pakai keyword, Instagram pakai username. Kami yang pantau.",
  },
  {
    icon: Filter,
    title: "AI filters the noise",
    desc: "Gate 1 menyaring ribuan postingan, hanya keluhan relevan yang lolos.",
  },
  {
    icon: Sparkles,
    title: "Get ready-to-send replies",
    desc: "Gate 2 menyusun draf balasan kontekstual siap pakai.",
  },
  {
    icon: Send,
    title: "Click & reply",
    desc: "Balasan terkirim dari akunmu sendiri. Bukan bot. Aman dari shadowban.",
  },
];

export function HowItWorks() {
  return (
    <Container id="how" className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-base font-medium uppercase tracking-wider text-accent">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          From setup to sent in 5 steps
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08}>
            <div className="group relative h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <step.icon size={20} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs font-bold text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold text-text">
                  {step.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}