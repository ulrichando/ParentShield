import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
            Cookie <span className="italic">Policy.</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-12">Last updated: January 2026</p>

          <div className="space-y-10 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">What Are Cookies</h2>
              <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">How We Use Cookies</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-neutral-900 dark:text-white">Essential cookies:</strong> Required for the website to function</li>
                <li><strong className="text-neutral-900 dark:text-white">Analytics cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong className="text-neutral-900 dark:text-white">Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">Managing Cookies</h2>
              <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
