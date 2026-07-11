import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Radar, ShieldCheck, UserCog, Send, LineChart } from "lucide-react";

const PILLARS = [
  { icon: Radar, label: "Temukan FUD", href: "#features" },
  { icon: ShieldCheck, label: "Verifikasi AI", href: "#features" },
  { icon: UserCog, label: "Personalisasi", href: "#features" },
  { icon: Send, label: "Kirim Sekali Klik", href: "#features" },
  { icon: LineChart, label: "Lacak Hasil", href: "#features" },
];

export function ValuePillars() {
  return (
    <Container className="py-12">
      <Reveal>
        <div className="rounded-2xl border border-border bg-surface/40 px-4 py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PILLARS.map((p, i) => (
              <a
                key={p.label}
                href={p.href}
                className={`group flex flex-col items-center gap-3 rounded-xl px-3 py-4 text-center transition-colors hover:bg-surface-2 ${
                  i < PILLARS.length - 1 ? "lg:border-r lg:border-border" : ""
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform group-hover:scale-110">
                  <p.icon size={22} />
                </div>
                <span className="text-sm font-medium text-text">{p.label}</span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Container>
  );
}