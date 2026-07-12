import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Terms of Service — Undercut",
  description: "Terms and conditions for using the Undercut platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28 min-h-screen bg-bg">
        <Container className="max-w-3xl">
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Terms of <span className="font-serif italic font-normal">Service.</span>
          </h1>
          <p className="text-xs text-muted mb-8">Last Updated: July 12, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-muted">
            <section>
              <h2 className="text-lg font-bold text-white mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using Undercut, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
              <p>
                Undercut provides a workflow platform that monitors public posts on X (Twitter) and Instagram for keywords or competitor mentions. Undercut uses artificial intelligence models to draft contextual reply suggestions. All replies are sent manually by the user; Undercut does not perform automated posting on your behalf.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">3. Account Registration & Security</h2>
              <p>
                To access features of the platform, you must register for an account using Google OAuth. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">4. Fees, Credits, and Top-Ups</h2>
              <p>
                Undercut operates on a pay-per-use model. Charges are incurred only when AI successfully drafts a reply ($0.10 per draft). All credit top-ups are non-refundable. Your credit balance has no expiration date and remains valid indefinitely. Weekly free demo quotas reset every 7 days and do not roll over.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">5. Acceptable Use Policy</h2>
              <p>
                You agree not to use Undercut to generate replies that contain hate speech, harassment, spam, malware, or any content that violates the terms of service of the third-party platforms (X or Instagram) you are interacting with.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">6. Limitation of Liability</h2>
              <p>
                Undercut is provided on an &quot;as is&quot; basis. We make no guarantees regarding data scraping uptime, AI draft quality, or whether your manual replies will successfully convert leads. In no event shall Undercut be liable for any indirect, incidental, or consequential damages.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
