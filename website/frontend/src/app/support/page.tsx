"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Book, MessageCircle, Video, FileText, ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const categories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics of setting up ParentShield",
    articles: ["Quick Start Guide", "Installing on Windows", "Installing on Mac", "Mobile Setup"],
  },
  {
    icon: HelpCircle,
    title: "Account & Billing",
    description: "Manage your subscription and account settings",
    articles: ["Upgrade Your Plan", "Cancel Subscription", "Update Payment Method", "Invoice History"],
  },
  {
    icon: FileText,
    title: "Features & Settings",
    description: "Learn about all ParentShield features",
    articles: ["Blocking Games", "Web Filtering", "Screen Time Limits", "Activity Reports"],
  },
  {
    icon: MessageCircle,
    title: "Troubleshooting",
    description: "Solutions to common issues",
    articles: ["App Not Blocking", "Connection Issues", "Password Reset", "Uninstall Guide"],
  },
];

const faqs = [
  {
    question: "How do I install ParentShield on my child's device?",
    answer: "Download the installer from your dashboard, run it on the target device, and enter your account credentials. The setup wizard will guide you through the rest.",
  },
  {
    question: "Can my child bypass ParentShield?",
    answer: "ParentShield uses enterprise-grade protection including daemon services, firewall rules, and tamper detection. It's designed to resist common bypass attempts.",
  },
  {
    question: "What happens when my trial ends?",
    answer: "After your 7-day free trial, you'll need to subscribe to continue using ParentShield. Your settings and configurations will be preserved.",
  },
  {
    question: "Can I use ParentShield on multiple devices?",
    answer: "Yes! The Basic plan covers up to 3 devices, and the Pro plan covers up to 10 devices. You can manage all devices from a single dashboard.",
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team via email at support@parentshield.app, through live chat on our website, or by phone during business hours.",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Help Center</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Find answers, guides, and resources to help you get the most out of ParentShield.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                placeholder="Search for help..."
              />
            </div>
          </motion.div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {categories.map((category, i) => (
              <motion.div
                key={category.title}
                className="bg-surface-card/50 rounded-2xl border border-white/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <category.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                    <p className="text-gray-500 text-sm">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article}>
                      <Link
                        href="#"
                        className="flex items-center text-gray-400 hover:text-primary-400 transition-colors text-sm py-1"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Video Tutorials */}
          <motion.div
            className="bg-surface-card/50 rounded-2xl border border-white/5 p-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-secondary-600/20 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-secondary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Video Tutorials</h2>
                <p className="text-gray-500">Watch step-by-step guides</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {["Getting Started with ParentShield", "Setting Up Web Filters", "Managing Screen Time"].map((title) => (
                <div key={title} className="bg-surface-elevated rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="aspect-video bg-surface-base rounded-lg mb-3 flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-300">{title}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-surface-card/50 rounded-xl border border-white/5 overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-6 pb-4 text-gray-400">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
