"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Target, Trash2, Loader2, Plus, Radio } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import {
  addCompetitor,
  deleteCompetitor,
  listCompetitors,
  toggleCompetitor,
} from "@/lib/data";
import type { Competitor, Platform } from "@/lib/types";

const MAX_TARGETS = 5;

const placeHolder = (platform: Platform) =>
  platform === "X"
    ? "@CompetitorApp lambat OR #CompetitorFail"
    : "tokopedia";

export function CompetitorPanel({ platform }: { platform: Platform }) {
  const [list, setList] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuery, setEditQuery] = useState("");

  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const data = await listCompetitors(platform);
    setList(data);
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    load();
  }, [platform]);

  const activeCount = list.filter((c) => c.is_active).length;

  const handleAdd = async () => {
    if (!name.trim() || !query.trim()) {
      toast.error("Both name and query are required");
      return;
    }
    if (activeCount >= MAX_TARGETS) {
      toast.warning(`Max ${MAX_TARGETS} active targets per platform`);
      return;
    }
    setSubmitting(true);
    let cleanQuery = query.trim();
    if (platform === "INSTAGRAM") {
      cleanQuery = cleanQuery.replace(/@/g, "");
    }
    await addCompetitor({
      competitor_name: name.trim(),
      platform,
      search_query: cleanQuery,
    });
    setName("");
    setQuery("");
    setSubmitting(false);
    toast.success("Target added — Undercut will start monitoring");
    load();
  };

  const handleDelete = async (id: string, compName: string) => {
    await deleteCompetitor(id);
    toast.success(`Target "${compName}" removed`);
    load();
  };

  const handleToggle = async (id: string) => {
    await toggleCompetitor(id);
    load();
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Target size={16} className="text-accent" />
        <h2 className="text-base font-bold text-text">
          Competitor targets — {platform === "X" ? "X (Twitter)" : "Instagram"}
        </h2>
        <span className="ml-auto rounded-full bg-surface-2 px-2 py-1 text-[10px] font-medium text-muted">
          {activeCount}/{MAX_TARGETS} active
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
        <Input
          placeholder="Competitor name (alias)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder={placeHolder(platform)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button size="sm" onClick={handleAdd} disabled={submitting}>
          {submitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <Plus size={14} /> Add
            </>
          )}
        </Button>
      </div>

      <p className="mt-2 text-xs text-muted">
        {platform === "X" ? (
          <>
            <strong className="text-text">Format X:</strong> free-text query with
            boolean operators (OR, AND), hashtag (<code className="text-accent">#</code>),
            mention (<code className="text-accent">@</code>). E.g.{" "}
            <code className="text-accent">@CompetitorApp lambat OR #CompetitorFail</code>.
          </>
        ) : (
          <>
            <strong className="text-text">Format Instagram:</strong> username only
            (without <code className="text-accent">@</code>). We&apos;ll auto-strip{" "}
            <code className="text-accent">@</code> if you add it. E.g.{" "}
            <code className="text-accent">tokopedia</code>.
          </>
        )}
      </p>

      <div className="mt-4 space-y-2">
        <AnimatePresence>
          {list.map((c) => {
            const isEditing = editingId === c.id;
            return (
              <motion.div
                layout
                key={c.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5"
              >
                {isEditing ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      value={editQuery}
                      onChange={(e) => setEditQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Done
                    </Button>
                  </>
                ) : (
                  <>
                    <div
                      className={`flex h-2 w-2 shrink-0 rounded-full ${
                        c.is_active ? "bg-success" : "bg-muted"
                      }`}
                      title={c.is_active ? "Active" : "Paused"}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-text">
                        {c.competitor_name}
                      </span>
                      <span className="font-mono text-[11px] text-muted">
                        {c.search_query}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle(c.id)}
                      className="rounded-lg px-2.5 py-1 text-xs text-muted transition-colors hover:bg-surface hover:text-text"
                    >
                      {c.is_active ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.competitor_name)}
                      aria-label="Delete"
                      className="rounded-lg p-1.5 text-muted transition-colors hover:text-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!loading && list.length === 0 && (
          <EmptyState
            icon={<Radio size={22} />}
            title="Tambahkan kompetitor pertamamu"
            description={
              platform === "X"
                ? "Mulai dengan satu target — misalnya @CompetitorApp lambat. Kami mulai memantau dalam 10-15 menit."
                : "Mulai dengan satu username — misalnya tokopedia. Kami pantau postingan terbaru secara paralel."
            }
          />
        )}
      </div>
    </section>
  );
}