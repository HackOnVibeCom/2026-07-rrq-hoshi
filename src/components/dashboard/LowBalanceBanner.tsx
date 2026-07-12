"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LowBalanceBanner({
  visible,
  onTopUp,
}: {
  visible: boolean;
  onTopUp: () => void;
}) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-2 z-30 mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 backdrop-blur"
    >
      <AlertTriangle size={18} className="shrink-0 text-warning" />
      <p className="flex-1 text-sm text-text">
        Balance exhausted. Top up <span className="font-semibold">$2</span> to
        continue processing leads.
      </p>
      <Button size="sm" variant="primary" onClick={onTopUp}>
        Top up →
      </Button>
    </motion.div>
  );
}