import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
            GDPR <span className="italic">Compliance.</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-12">Last updated: January 2026</p>

          <div className="space-y-10 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">Your Rights Under GDPR</h2>
              <p className="mb-4">If you are in the European Economic Area, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-neutral-900 dark:text-white">Right to access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-neutral-900 dark:text-white">Right to rectification:</strong> Request correction of inaccurate data</li>
                <li><strong className="text-neutral-900 dark:text-white">Right to erasure:</strong> Request deletion of your data</li>
                <li><strong className="text-neutral-900 dark:text-white">Right to portability:</strong> Receive your data in a portable format</li>
                <li><strong className="text-neutral-900 dark:text-white">Right to object:</strong> Object to processing of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">Data Processing</h2>
              <p>We process personal data based on legitimate interests, contractual necessity, and your consent where required.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">Contact Our DPO</h2>
              <p>For GDPR-related requests, contact our Data Protection Officer at dpo@parentshield.app</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
