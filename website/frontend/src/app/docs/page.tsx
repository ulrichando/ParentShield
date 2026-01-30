"use client";

import { motion } from "framer-motion";
import { Book, Download, Settings, Shield, Clock, Globe, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useState } from "react";

const sections = [
  {
    icon: Download,
    title: "Getting Started",
    description: "Install and set up ParentShield",
    articles: [
      { title: "Quick Start Guide", description: "Get up and running in 5 minutes" },
      { title: "System Requirements", description: "Supported platforms and requirements" },
      { title: "Installation Guide", description: "Step-by-step installation instructions" },
      { title: "First-Time Setup", description: "Configure ParentShield for your family" },
    ],
  },
  {
    icon: Shield,
    title: "Blocking & Filtering",
    description: "Configure content blocking",
    articles: [
      { title: "Game Blocking", description: "Block games and gaming websites" },
      { title: "Web Filtering", description: "Filter inappropriate websites" },
      { title: "App Blocking", description: "Prevent specific applications from running" },
      { title: "Custom Block Lists", description: "Create your own blocking rules" },
    ],
  },
  {
    icon: Clock,
    title: "Screen Time",
    description: "Manage device usage",
    articles: [
      { title: "Time Limits", description: "Set daily screen time limits" },
      { title: "Schedules", description: "Create usage schedules" },
      { title: "Bedtime Mode", description: "Configure bedtime restrictions" },
      { title: "Break Reminders", description: "Encourage healthy breaks" },
    ],
  },
  {
    icon: Settings,
    title: "Settings & Admin",
    description: "Configure your account",
    articles: [
      { title: "Account Settings", description: "Manage your ParentShield account" },
      { title: "Device Management", description: "Add and manage devices" },
      { title: "Password & Security", description: "Keep your settings secure" },
      { title: "Notifications", description: "Configure alerts and reports" },
    ],
  },
  {
    icon: Globe,
    title: "Web Dashboard",
    description: "Use the online portal",
    articles: [
      { title: "Dashboard Overview", description: "Navigate the web interface" },
      { title: "Activity Reports", description: "View usage statistics" },
      { title: "Remote Management", description: "Control devices remotely" },
      { title: "Family Sharing", description: "Add family members" },
    ],
  },
  {
    icon: Book,
    title: "Troubleshooting",
    description: "Solve common issues",
    articles: [
      { title: "Connection Issues", description: "Fix connectivity problems" },
      { title: "Blocking Not Working", description: "Troubleshoot blocking issues" },
      { title: "Performance Tips", description: "Optimize ParentShield" },
      { title: "Uninstall Guide", description: "How to remove ParentShield" },
    ],
  },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
              Documentation
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
              Learn <span className="italic">everything.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">
              Everything you need to know about using ParentShield effectively.
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 py-4 pl-12 pr-4 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                placeholder="Search documentation..."
              />
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 mb-12">
            {[
              { title: "Quick Start", description: "Get started in 5 minutes", href: "#" },
              { title: "Video Tutorials", description: "Watch step-by-step guides", href: "#" },
              { title: "FAQ", description: "Common questions answered", href: "/support" },
            ].map((link, i) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block bg-white dark:bg-neutral-950 p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{link.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{link.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Documentation Sections */}
          <div className="grid md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                className="bg-white dark:bg-neutral-950 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <div>
                    <h2 className="font-medium text-neutral-900 dark:text-white">{section.title}</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{section.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {section.articles.map((article) => (
                    <li key={article.title}>
                      <Link
                        href="#"
                        className="flex items-center justify-between py-2 group"
                      >
                        <div>
                          <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{article.title}</span>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500">{article.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
