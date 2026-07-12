"use client";

import { motion } from "framer-motion";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none";
  const sizes: Record<Size, string> = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-2 text-base",
  };
  const variants: Record<Variant, string> = {
    primary:
      "border border-t-white/30 border-b-[3.5px] border-b-blue-700/90 border-x-blue-600/30 bg-gradient-to-b from-accent-hover to-accent text-white hover:brightness-105 shadow-lg shadow-accent/20 transition-colors",
    ghost:
      "border border-border bg-transparent text-text hover:bg-surface hover:border-accent/40",
  };

  return (
    <motion.button
      whileTap={variant === "primary" ? { y: 2.5 } : { scale: 0.98 }}
      whileHover={variant === "primary" ? { y: -1 } : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}