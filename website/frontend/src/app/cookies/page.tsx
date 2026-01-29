import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
          <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
            <p className="text-lg">Last updated: January 2026</p>

            <h2 className="text-2xl font-semibold text-white mt-8">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience.</p>

            <h2 className="text-2xl font-semibold text-white mt-8">How We Use Cookies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> Required for the website to function</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
