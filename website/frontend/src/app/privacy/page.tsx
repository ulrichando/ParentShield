import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
            Privacy <span className="italic">Policy.</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-12">Last updated: January 2026</p>

          <div className="space-y-10 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">ParentShield collects information necessary to provide our parental control services, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (email, name)</li>
                <li>Device information for monitoring purposes</li>
                <li>Usage data to improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Send notifications about your child&apos;s activity</li>
                <li>Improve and personalize your experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">3. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data, including encryption and secure storage practices.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">4. Contact Us</h2>
              <p>For privacy-related inquiries, contact us at privacy@parentshield.app</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
