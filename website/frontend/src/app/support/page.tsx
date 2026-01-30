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
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Support
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
              Help <span className="italic">center.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">
              Find answers, guides, and resources to help you get the most out of ParentShield.
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 py-4 pl-12 pr-4 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                placeholder="Search for help..."
              />
            </div>
          </motion.div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 mb-16">
            {categories.map((category, i) => (
              <motion.div
                key={category.title}
                className="bg-white dark:bg-neutral-950 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{category.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article}>
                      <Link
                        href="#"
                        className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm py-1 group"
                      >
                        <ChevronRight className="w-4 h-4 mr-2 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white" />
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
            className="border border-neutral-200 dark:border-neutral-800 p-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                <Video className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-neutral-900 dark:text-white">Video Tutorials</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Watch step-by-step guides</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {["Getting Started with ParentShield", "Setting Up Web Filters", "Managing Screen Time"].map((title) => (
                <div key={title} className="group cursor-pointer">
                  <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 mb-3 flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 transition-colors">
                    <Video className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{title}</p>
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
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              FAQ
            </p>
            <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-8">
              Frequently asked <span className="italic">questions.</span>
            </h2>
            <div className="space-y-px bg-neutral-200 dark:bg-neutral-800">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-neutral-950"
                >
                  <button
                    className="w-full px-6 py-5 text-left flex items-center justify-between"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <span className="font-medium text-neutral-900 dark:text-white">{faq.question}</span>
                    <ChevronRight className={`w-5 h-5 text-neutral-400 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-6 pb-5 text-neutral-500 dark:text-neutral-400">
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
