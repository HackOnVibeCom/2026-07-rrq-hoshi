import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <Container className="py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center sm:items-start">
            <Logo />
            <p className="mt-3 max-w-xs text-center text-sm text-muted sm:text-left">
              Turn competitor complaints into your next customers. AI drafts, you
              send.
            </p>
            <div className="mt-4">
              <Badge className="border-accent/30 bg-accent/10 text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Built for HackOnVibe 2026
              </Badge>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a href="#" className="text-muted transition-colors hover:text-text">
              Privacy Policy
            </a>
            <a href="#" className="text-muted transition-colors hover:text-text">
              Terms of Service
            </a>
            <a href="#" className="text-muted transition-colors hover:text-text">
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Undercut. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}