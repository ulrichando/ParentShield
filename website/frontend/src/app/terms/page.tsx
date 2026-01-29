import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
            <p className="text-lg">Last updated: January 2026</p>

            <h2 className="text-2xl font-semibold text-white mt-8">1. Acceptance of Terms</h2>
            <p>By using ParentShield, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>

            <h2 className="text-2xl font-semibold text-white mt-8">2. Description of Service</h2>
            <p>ParentShield provides parental control software that helps families manage screen time and digital safety across devices.</p>

            <h2 className="text-2xl font-semibold text-white mt-8">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be 18 years or older to use this service</li>
              <li>You are responsible for maintaining account security</li>
              <li>You agree to use the service in compliance with applicable laws</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">4. Subscription and Billing</h2>
            <p>Subscription fees are billed according to your chosen plan. You may cancel at any time, with access continuing until the end of your billing period.</p>

            <h2 className="text-2xl font-semibold text-white mt-8">5. Contact</h2>
            <p>For questions about these terms, contact us at legal@parentshield.app</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
