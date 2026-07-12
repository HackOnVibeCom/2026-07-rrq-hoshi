import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Privacy Policy — Undercut",
  description: "Privacy policy detailing how Undercut collects, uses, and secures your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28 min-h-screen bg-bg">
        <Container className="max-w-3xl">
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Privacy <span className="font-serif italic font-normal">Policy.</span>
          </h1>
          <p className="text-xs text-muted mb-8">Last Updated: July 12, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-muted">
            <section>
              <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
              <p>
                We collect your email address and basic profile information via Google OAuth during registration. We also store your product context profiles and competitor monitoring keywords that you explicitly define to customize your AI replies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Data</h2>
              <p>
                Your product context and competitor keywords are shared with AI model endpoints (such as DeepSeek) solely to generate customized reply drafts. We do not sell your personal data, email addresses, or query keywords to any third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">3. Database Security & Isolation</h2>
              <p>
                Our database is built on Supabase Postgres and implements Row Level Security (RLS) policies. This ensures that your private data, competitor queues, and credentials are completely isolated and never queryable by other platform users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">4. Third-Party Webhooks & Payments</h2>
              <p>
                All billing transaction processing is handled securely via Midtrans. We receive secure cryptographic billing webhooks with signature verification and idempotency checks to ensure payment records are written accurately and safely.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">5. Cookies & Analytics</h2>
              <p>
                We use secure browser cookies to maintain your login session. We do not use third-party tracking cookies or advertising pixels.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">6. Your Rights</h2>
              <p>
                You have the right to request deletion of your account and all associated competitor tracking data at any time. Contact us directly if you wish to purge your profile records.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
