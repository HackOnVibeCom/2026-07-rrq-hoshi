"use client";

import { useEffect, useState } from "react";
import { Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getBillingStatus, type BillingStatus } from "@/lib/data";

const DAY_MS = 24 * 60 * 60 * 1000;

function formatResetLabel(iso: string) {
  const reset = new Date(iso);
  const days = Math.ceil((+reset - Date.now()) / DAY_MS);
  if (days <= 0) return "resets soon";
  if (days === 1) return "resets tomorrow";
  return `resets in ${days}d`;
}

export function CreditWidget({ onTopUp }: { onTopUp: () => void }) {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getBillingStatus().then((s) => {
      if (mounted) {
        setStatus(s);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !status) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-28" />
        <Skeleton className="h-9 w-20" />
      </div>
    );
  }

  const lowBalance =
    status.free_demo_credits_remaining === 0 && status.credit_balance < 0.1;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2">
        <Wallet size={16} className="text-accent" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-text">
            ${status.credit_balance.toFixed(2)}
          </span>
          <span className="text-[10px] text-muted">credit balance</span>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 sm:flex">
        <Sparkles size={14} className="text-warning" />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-text">
            {status.free_demo_credits_remaining}/5 free
          </span>
          <span className="text-[10px] text-muted">
            {formatResetLabel(status.free_demo_reset_at)}
          </span>
        </div>
      </div>

      <Button size="sm" variant={lowBalance ? "primary" : "ghost"} onClick={onTopUp}>
        {lowBalance ? "Top Up →" : "Top Up"}
      </Button>
    </div>
  );
}