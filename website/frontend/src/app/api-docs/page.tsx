"use client";

import { motion } from "framer-motion";
import { Code, Key, Shield, Zap, Book, ChevronRight, DollarSign, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const pricingPlans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    requests: "1,000",
    features: ["1,000 requests/month", "REST API access", "Email support", "Basic analytics"],
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    requests: "10,000",
    popular: true,
    features: ["10,000 requests/month", "REST API access", "Webhooks", "Priority support", "Advanced analytics"],
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/month",
    requests: "100,000",
    features: ["100,000 requests/month", "REST API access", "Webhooks", "Dedicated support", "Custom integrations", "SLA guarantee"],
  },
];

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/devices",
    description: "List all registered devices",
  },
  {
    method: "POST",
    path: "/api/v1/devices",
    description: "Register a new device",
  },
  {
    method: "GET",
    path: "/api/v1/blocks",
    description: "Get current blocking rules",
  },
  {
    method: "POST",
    path: "/api/v1/blocks",
    description: "Create a new blocking rule",
  },
  {
    method: "GET",
    path: "/api/v1/activity",
    description: "Get activity logs",
  },
  {
    method: "GET",
    path: "/api/v1/schedules",
    description: "List schedules",
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "OAuth 2.0 and API key authentication for secure access to your data.",
  },
  {
    icon: Zap,
    title: "Real-time Webhooks",
    description: "Get instant notifications when events occur on your devices.",
  },
  {
    icon: Code,
    title: "RESTful Design",
    description: "Clean, predictable API following REST best practices.",
  },
];

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-600/20 rounded-full px-4 py-2 mb-6">
              <Code className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">Developer API</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">API Documentation</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Integrate ParentShield with your applications using our RESTful API.
            </p>
          </motion.div>

          {/* Pricing */}
          <motion.div
            className="bg-linear-to-r from-primary-600/10 to-secondary-600/10 rounded-2xl border border-primary-500/20 p-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">API Pricing</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Choose a plan that fits your integration needs. All plans include full API access.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-surface-card rounded-xl p-4 border ${
                    plan.popular ? "border-primary-500" : "border-white/5"
                  }`}
                >
                  {plan.popular && (
                    <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">Popular</span>
                  )}
                  <h3 className="text-lg font-bold text-white mt-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-bold text-primary-400">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{plan.requests} requests/month</p>
                  <ul className="space-y-1.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <Check className="w-3 h-3 text-primary-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/settings">
                <Button size="sm">Get API Key</Button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            className="bg-surface-card/50 rounded-2xl border border-white/5 p-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Quick Start</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Get your API key</h3>
                  <p className="text-gray-500 text-sm">Generate an API key from your account settings in the dashboard.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Make your first request</h3>
                  <p className="text-gray-500 text-sm mb-3">Include your API key in the Authorization header.</p>
                  <div className="bg-surface-base rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <code className="text-gray-300">
                      curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; \<br />
                      &nbsp;&nbsp;https://api.parentshield.app/v1/devices
                    </code>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Explore the API</h3>
                  <p className="text-gray-500 text-sm">Check out the endpoints below to see what&apos;s possible.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-surface-card/50 rounded-xl border border-white/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Endpoints */}
          <motion.div
            className="bg-surface-card/50 rounded-2xl border border-white/5 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">API Endpoints</h2>
              <Link href="#">
                <Button variant="secondary" size="sm">
                  <Book className="w-4 h-4 mr-2" />
                  Full Reference
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {endpoints.map((endpoint, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                        endpoint.method === "GET"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-gray-300">{endpoint.path}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm hidden md:block">{endpoint.description}</span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Authentication */}
          <motion.div
            className="bg-surface-card/50 rounded-2xl border border-white/5 p-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center shrink-0">
                <Key className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Authentication</h2>
                <p className="text-gray-400 mb-4">
                  All API requests require authentication. Include your API key in the Authorization header:
                </p>
                <div className="bg-surface-base rounded-lg p-4 font-mono text-sm">
                  <code className="text-gray-300">Authorization: Bearer YOUR_API_KEY</code>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  API keys can be generated and managed in your{" "}
                  <Link href="/dashboard/settings" className="text-primary-400 hover:underline">
                    account settings
                  </Link>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
