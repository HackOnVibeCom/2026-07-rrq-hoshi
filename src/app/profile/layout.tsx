import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" aria-label="Undercut home" className="shrink-0">
            <Logo />
          </Link>
          <Link
            href="/dashboard/x"
            className="relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-4 py-1.5 text-sm border border-t-white/30 border-b-[3.5px] border-b-blue-700/90 border-x-blue-600/30 bg-gradient-to-b from-accent-hover to-accent text-white hover:brightness-105 shadow-lg shadow-accent/20 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}