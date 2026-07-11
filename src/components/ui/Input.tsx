import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text placeholder:text-muted/70 transition-colors focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40 ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text placeholder:text-muted/70 transition-colors focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40 ${className}`}
      {...props}
    />
  );
}