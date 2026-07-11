import { CompetitorPanel } from "@/components/dashboard/CompetitorPanel";
import { LeadQueue } from "@/components/dashboard/LeadQueue";
import { DifferentiatorPanel } from "@/components/dashboard/DifferentiatorPanel";

const PLATFORM = "X" as const;

export default function DashboardX() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-text">X (Twitter) leads</h1>
        <p className="mt-1 text-sm text-muted">
          Monitor complaints by free-text keyword search. Reply directly via X
          intent URL.
        </p>
      </header>

      <CompetitorPanel platform={PLATFORM} />
      <LeadQueue platform={PLATFORM} />
      <DifferentiatorPanel />
    </div>
  );
}