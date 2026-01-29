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
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Documentation</h1>
            <p className="text-base text-gray-400 max-w-2xl mx-auto mb-6">
              Everything you need to know about using ParentShield effectively.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                placeholder="Search documentation..."
              />
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-3 mb-8">
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
                  className="block bg-primary-600/10 border border-primary-500/20 rounded-lg p-3 hover:bg-primary-600/20 transition-colors"
                >
                  <h3 className="font-medium text-white text-sm mb-0.5">{link.title}</h3>
                  <p className="text-xs text-gray-400">{link.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Documentation Sections */}
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                className="bg-surface-card/50 rounded-xl border border-white/5 p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <section.icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">{section.title}</h2>
                    <p className="text-gray-500 text-xs">{section.description}</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {section.articles.map((article) => (
                    <li key={article.title}>
                      <Link
                        href="#"
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-elevated transition-colors group"
                      >
                        <div>
                          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{article.title}</span>
                          <p className="text-xs text-gray-500">{article.description}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-400 transition-colors" />
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
