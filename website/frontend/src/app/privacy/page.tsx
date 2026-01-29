import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
            <p className="text-lg">Last updated: January 2026</p>

            <h2 className="text-2xl font-semibold text-white mt-8">1. Information We Collect</h2>
            <p>ParentShield collects information necessary to provide our parental control services, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email, name)</li>
              <li>Device information for monitoring purposes</li>
              <li>Usage data to improve our services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Send notifications about your child&apos;s activity</li>
              <li>Improve and personalize your experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data, including encryption and secure storage practices.</p>

            <h2 className="text-2xl font-semibold text-white mt-8">4. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at privacy@parentshield.app</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
