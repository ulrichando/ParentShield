import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
            Terms of <span className="italic">Service.</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-12">Last updated: January 2026</p>

          <div className="space-y-10 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p>By using ParentShield, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">2. Description of Service</h2>
              <p>ParentShield provides parental control software that helps families manage screen time and digital safety across devices.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be 18 years or older to use this service</li>
                <li>You are responsible for maintaining account security</li>
                <li>You agree to use the service in compliance with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">4. Subscription and Billing</h2>
              <p>Subscription fees are billed according to your chosen plan. You may cancel at any time, with access continuing until the end of your billing period.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">5. Contact</h2>
              <p>For questions about these terms, contact us at legal@parentshield.app</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
