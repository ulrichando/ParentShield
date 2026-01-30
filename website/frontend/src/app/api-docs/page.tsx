"use client";

import { motion } from "framer-motion";
import { Code, Key, Shield, Zap, Check, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const features = [
  { icon: Shield, title: "Secure by Design", description: "API key authentication with scoped permissions." },
  { icon: Zap, title: "Real-time Webhooks", description: "Get instant notifications when events occur." },
  { icon: Code, title: "RESTful API", description: "Clean, predictable endpoints following REST best practices." },
];

const endpoints = [
  { method: "GET", path: "/devices", description: "List all connected devices" },
  { method: "GET", path: "/devices/:id", description: "Get device details" },
  { method: "GET", path: "/alerts", description: "List recent alerts" },
  { method: "POST", path: "/blocked-apps", description: "Add blocked application" },
  { method: "GET", path: "/web-filters", description: "Get web filtering rules" },
  { method: "PUT", path: "/settings", description: "Update parental settings" },
];

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Developer API
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
              Build with <span className="italic">ParentShield.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mb-8">
              Integrate powerful parental controls into your apps. Monitor devices, manage settings, and receive real-time alerts programmatically.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                Get API Key Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-[#FAFAFA] dark:bg-neutral-900 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-6">
                  <feature.icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
                Quick Start
              </p>
              <h2 className="text-3xl font-light text-neutral-900 dark:text-white mb-6">
                Simple <span className="italic">integration.</span>
              </h2>
              <div className="space-y-4">
                {["Sign up and get your API key", "Add the key to your request headers", "Start making API calls"].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="border border-neutral-200 dark:border-neutral-800 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-neutral-400 dark:text-neutral-500 text-sm ml-2">Example</span>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code className="text-neutral-600 dark:text-neutral-400">
{`curl -X GET "https://api.parentshield.com/v1/devices" \\
  -H "X-API-Key: your_api_key"

# Response
{
  "devices": [
    {
      "id": "dev_123",
      "name": "Kids Laptop",
      "status": "online"
    }
  ]
}`}
                </code>
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Endpoints
          </p>
          <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-8">
            Available <span className="italic">routes.</span>
          </h2>

          <div className="border border-neutral-200 dark:border-neutral-800">
            {endpoints.map((endpoint, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 text-xs font-mono font-medium ${
                      endpoint.method === "GET"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : endpoint.method === "POST"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400 text-sm">/api/v1{endpoint.path}</span>
                </div>
                <span className="text-neutral-400 dark:text-neutral-500 text-sm hidden md:block">{endpoint.description}</span>
              </div>
            ))}
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 text-center">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Sign in to access full documentation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="border border-neutral-200 dark:border-neutral-800 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                <Key className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">Authentication</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  All API requests require an API key in the <code className="text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-sm">X-API-Key</code> header:
                </p>
                <div className="bg-neutral-100 dark:bg-neutral-800 p-4 font-mono text-sm">
                  <code className="text-neutral-600 dark:text-neutral-400">X-API-Key: ps_live_xxxxxxxxxxxx</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-neutral-900 dark:text-white mb-4">
            Ready to <span className="italic">build?</span>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Create your free account and get your API key in minutes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
