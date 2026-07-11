import { type ReactNode } from "react";

export function Container({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}
    >
      {children}
    </section>
  );
}