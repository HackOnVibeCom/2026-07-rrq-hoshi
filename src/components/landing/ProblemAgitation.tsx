import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const MANUAL = [
  { task: "Monitor tiap platform setiap jam", cost: "30 min/hari" },
  { task: "Baca ratusan postingan satu per satu", cost: "1 jam/hari" },
  { task: "Tulis balasan personal tiap kali", cost: "1–2 jam/hari" },
];

const WITH_UNDERCUT = [
  { task: "Setup target sekali", cost: "2 menit" },
  { task: "AI menyaring otomatis", cost: "0 menit" },
  { task: "AI draft dulu, kamu tinggal kirim", cost: "beberapa klik" },
];

export function ProblemAgitation() {
  return (
    <Container className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-base font-medium uppercase tracking-wider text-accent">
          The problem
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          Are you scrolling X and Instagram all day, hunting for complaints?
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl space-y-4 text-lg text-muted">
        <p>
          Ratusan orang mengeluh soal kompetitormu di X dan Instagram — hari ini,
          sekarang.
        </p>
        <p>
          Apakah kamu melihat semuanya? Sempat membalas dengan personal sebelum
          kompetitor lain duluan?
        </p>
        <p className="text-2xl font-bold text-text">STOP scrolling manual.</p>
        <p>
          Undercut memantau, menyaring, dan menyiapkan balasan untukmu. Kamu
          tinggal klik kirim.
        </p>
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="border-b border-border bg-surface/40 p-6 sm:border-b-0 sm:border-r">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Tanpa Undercut (manual)
            </h3>
            <ul className="mt-5 space-y-4">
              {MANUAL.map((row) => (
                <li key={row.task} className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted">{row.task}</span>
                  <span className="shrink-0 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                    {row.cost}
                  </span>
                </li>
              ))}
              <li className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base font-bold text-danger">
                <span>Total</span>
                <span>2–4 jam/hari per kompetitor</span>
              </li>
            </ul>
          </div>

          <div className="bg-accent/5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Dengan Undercut
            </h3>
            <ul className="mt-5 space-y-4">
              {WITH_UNDERCUT.map((row) => (
                <li key={row.task} className="flex items-start justify-between gap-4">
                  <span className="text-sm text-text">{row.task}</span>
                  <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                    {row.cost}
                  </span>
                </li>
              ))}
              <li className="mt-4 flex items-center justify-between border-t border-accent/20 pt-4 text-base font-bold text-success">
                <span>Total</span>
                <span>Beberapa klik per hari</span>
              </li>
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.25} className="mt-10 text-center text-lg font-medium text-text">
        Save hours a week. Focus on building, not monitoring.
      </Reveal>
    </Container>
  );
}