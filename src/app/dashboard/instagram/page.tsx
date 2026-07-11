import { CompetitorPanel } from "@/components/dashboard/CompetitorPanel";
import { LeadQueue } from "@/components/dashboard/LeadQueue";
import { DifferentiatorPanel } from "@/components/dashboard/DifferentiatorPanel";

const PLATFORM = "INSTAGRAM" as const;

export default function DashboardInstagram() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-text">Instagram leads</h1>
        <p className="mt-1 text-sm text-muted">
          Monitor competitor posts via username. Reply copies draft and opens
          the original post.
        </p>
      </header>

      <CompetitorPanel platform={PLATFORM} />
      <LeadQueue platform={PLATFORM} />
      <DifferentiatorPanel />
    </div>
  );
}