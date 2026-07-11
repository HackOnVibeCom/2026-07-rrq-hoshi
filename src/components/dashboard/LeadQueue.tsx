"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Radar, Sparkles } from "lucide-react";
import { LeadCard } from "@/components/dashboard/LeadCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { listLeads } from "@/lib/data";
import type { Lead, Platform } from "@/lib/types";

const COACHMARK_KEY = "undercut:coachmark-seen";

export function LeadQueue({ platform }: { platform: Platform }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCoachmark, setShowCoachmark] = useState(false);
  const toast = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listLeads(platform, "PENDING");
      setLeads((prev) => {
        // Detect new leads via realtime stub (diff by id)
        if (prev.length > 0 && data.length > prev.length) {
          const prevIds = new Set(prev.map((l) => l.id));
          const newcomers = data.filter((l) => !prevIds.has(l.id));
          if (newcomers.length > 0) {
            toast.success(`Lead baru ditemukan! (${newcomers.length})`);
          }
        }
        return data;
      });
    } finally {
      setLoading(false);
    }
  }, [platform, toast]);

  useEffect(() => {
    fetchLeads();
    setShowCoachmark(
      typeof window !== "undefined" && !localStorage.getItem(COACHMARK_KEY)
    );
    // Poll every 30s as realtime stub (see PRD §G.11 tahap 5).
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const handleReplied = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    // Mark coachmark as seen once first reply is clicked
    if (typeof window !== "undefined") {
      localStorage.setItem(COACHMARK_KEY, "1");
      setShowCoachmark(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-2/3" />
            <Skeleton className="mt-3 h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={<Radar size={22} />}
        title="Belum ada lead untuk platform ini"
        description={
          platform === "X"
            ? "Tambahkan target kompetitor pertamamu, lalu tunggu 10-15 menit. AI akan otomatis menyaring dan menyiapkan draf balasan siap kirim."
            : "Tambahkan username kompetitor, lalu tunggu 10-15 menit. AI akan otomatis menyaring dan menyiapkan draf balasan siap kirim."
        }
        action={
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Sparkles size={12} className="text-accent" /> Tips: gunakan keyword
            spesifik seperti &ldquo;@app lambat&rdquo; untuk menemukan lead lebih cepat
          </span>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">
          Lead queue
        </h2>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
          {leads.length} pending
        </span>
      </div>
      <AnimatePresence mode="popLayout">
        {leads.map((lead, i) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            showCoachmark={showCoachmark && i === 0}
            onReplied={handleReplied}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}