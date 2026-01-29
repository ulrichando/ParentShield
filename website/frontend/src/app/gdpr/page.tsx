import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">GDPR Compliance</h1>
          <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
            <p className="text-lg">Last updated: January 2026</p>

            <h2 className="text-2xl font-semibold text-white mt-8">Your Rights Under GDPR</h2>
            <p>If you are in the European Economic Area, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to erasure:</strong> Request deletion of your data</li>
              <li><strong>Right to portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to object:</strong> Object to processing of your data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">Data Processing</h2>
            <p>We process personal data based on legitimate interests, contractual necessity, and your consent where required.</p>

            <h2 className="text-2xl font-semibold text-white mt-8">Contact Our DPO</h2>
            <p>For GDPR-related requests, contact our Data Protection Officer at dpo@parentshield.app</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
