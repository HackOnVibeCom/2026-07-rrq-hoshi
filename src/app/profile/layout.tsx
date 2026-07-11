import { Logo } from "@/components/ui/Logo";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-5">
          <Logo />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}