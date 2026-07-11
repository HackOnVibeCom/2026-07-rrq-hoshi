"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Edit3, Check, X, Timer, ArrowUpRight } from "lucide-react";
import {
  XIcon,
  InstagramIcon,
} from "@/components/ui/BrandIcons";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { markLeadReplied, updateLeadDraft } from "@/lib/data";
import type { Lead } from "@/lib/types";

export function LeadCard({
  lead,
  showCoachmark,
  onReplied,
}: {
  lead: Lead;
  showCoachmark?: boolean;
  onReplied: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lead.gate_2_generated_reply ?? "");
  const [expanded, setExpanded] = useState(false);
  const [replying, setReplying] = useState(false);
  const toast = useToast();

  const isX = lead.platform === "X";
  const PlatformIcon = isX ? XIcon : InstagramIcon;
  const charLimit = isX ? 280 : 500;

  const handleReply = async () => {
    if (replying) return;
    setReplying(true);

    // Optimistic UI: hide card immediately
    if (isX) {
      const url =
        `https://twitter.com/intent/tweet?in_reply_to=${lead.external_post_id}` +
        `&text=${encodeURIComponent(draft)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      try {
        await navigator.clipboard.writeText(draft);
        window.open(lead.post_url, "_blank", "noopener,noreferrer");
      } catch {
        toast.error("Couldn't access clipboard. Copy draft manually.");
      }
    }

    toast.success("Reply sent ✓");
    // Optimistic update before server confirms
    onReplied(lead.id);
    markLeadReplied(lead.id).catch(() => {
      toast.error("Reply mark failed — please refresh");
    });
  };

  const handleSaveDraft = async () => {
    await updateLeadDraft(lead.id, draft);
    setEditing(false);
    toast.success("Draft updated");
  };

  const wordOverflow = draft.length > charLimit;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {/* Complaint header */}
      <div className="flex items-center gap-3 border-b border-border px-4 pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-muted">
          {lead.author_username.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-text">
            @{lead.author_username}
          </span>
          <span className="text-[10px] text-muted">
            {new Date(lead.created_at).toLocaleString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-1 text-[10px] text-muted">
          <PlatformIcon style={{ fontSize: 11 }} />
          {isX ? "X" : "Instagram"}
        </span>
      </div>

      {/* Raw complaint */}
      <div className="px-4 pt-3">
        <p
          className={`text-sm leading-relaxed text-muted ${
            !expanded && lead.raw_content.length > 180 ? "line-clamp-3" : ""
          }`}
        >
          {lead.raw_content}
        </p>
        {lead.raw_content.length > 180 && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="mt-1 text-xs font-medium text-accent"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* AI Draft */}
      <div className="mt-3 border-t border-border px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
            <Timer size={11} /> AI Draft
          </span>
          <span className="text-[10px] text-muted">
            {lead.processing_time_ms
              ? `${(lead.processing_time_ms / 1000).toFixed(1)}s · `
            : ""}
            {lead.gate_2_model_used ?? "draft model"}
          </span>
          <button
            onClick={() => setEditing((p) => !p)}
            className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted transition-colors hover:bg-surface-2 hover:text-text"
            aria-label="Edit draft"
          >
            {editing ? <X size={12} /> : <Edit3 size={12} />}
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              className="text-sm"
            />
            <div className="mt-2 flex items-center justify-between">
              <span
                className={`text-[10px] ${
                  wordOverflow ? "text-danger" : "text-muted"
                }`}
              >
                {draft.length}/{charLimit}
              </span>
              <Button size="sm" variant="ghost" onClick={handleSaveDraft}>
                <Check size={12} /> Save draft
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-text">{draft}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <a
          href={lead.post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-muted transition-colors hover:text-text"
        >
          View original <ArrowUpRight size={11} />
        </a>
        <Button
          size="sm"
          variant="primary"
          onClick={handleReply}
          disabled={replying || wordOverflow}
          className="relative"
        >
          <Send size={12} />
          {isX ? "Reply on X" : "Reply on IG"}
        </Button>
      </div>

      {/* One-time coachmark — first lead card */}
      {showCoachmark && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative border-t border-accent/30 bg-accent/5 px-4 py-3"
          >
            <p className="text-xs text-muted">
              <span className="font-semibold text-accent">Tip:</span> Edit draf
              sebelum kirim — buat jadi gaya kamu. Tombol &ldquo;Reply&rdquo;
              akan buka tab baru dengan balasan siap dikirim dari akunmu sendiri.
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}