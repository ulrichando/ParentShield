"use client";

import { motion } from "framer-motion";
import { Tag, Sparkles, Bug, Zap, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const releases = [
  {
    version: "0.2.0",
    date: "January 2026",
    type: "minor",
    title: "Activity & Alerts Update",
    description: "New activity dashboard, alerts page, and device linking improvements.",
    changes: [
      { type: "feature", text: "Activity Dashboard - Real-time feed of blocked attempts" },
      { type: "feature", text: "Alerts Page - View and manage device notifications" },
      { type: "feature", text: "Quick Device Linking - Generate activation codes from website" },
      { type: "improvement", text: "Enhanced device management on web dashboard" },
      { type: "security", text: "Content Security Policy added for improved security" },
    ],
  },
  {
    version: "0.1.0",
    date: "January 2026",
    type: "major",
    title: "Initial Release",
    description: "The first public release of ParentShield.",
    changes: [
      { type: "feature", text: "Cross-platform support for Windows, macOS, and Linux" },
      { type: "feature", text: "Game blocking with 200+ gaming sites and apps" },
      { type: "feature", text: "AI service blocking (ChatGPT, Claude, etc.)" },
      { type: "feature", text: "DNS-level web filtering" },
      { type: "feature", text: "Web dashboard for remote management" },
    ],
  },
  {
    version: "0.0.9",
    date: "December 2025",
    type: "beta",
    title: "Beta Release",
    description: "Final beta before public launch.",
    changes: [
      { type: "improvement", text: "Improved daemon stability on Linux" },
      { type: "fix", text: "Fixed memory leak in process monitor" },
      { type: "fix", text: "Fixed schedule timezone issues" },
    ],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case "improvement":
      return <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "fix":
      return <Bug className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    case "security":
      return <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />;
    default:
      return <Tag className="w-4 h-4 text-neutral-400" />;
  }
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Changelog
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
              What&apos;s <span className="italic">new.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
              All notable changes to ParentShield are documented here.
            </p>
          </motion.div>

          {/* Releases */}
          <div className="space-y-16">
            {releases.map((release, i) => (
              <motion.div
                key={release.version}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h2 className="text-2xl font-light text-neutral-900 dark:text-white">v{release.version}</h2>
                  <span className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    {release.date}
                  </span>
                </div>

                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">{release.title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">{release.description}</p>

                <div className="border border-neutral-200 dark:border-neutral-800 p-6">
                  <ul className="space-y-3">
                    {release.changes.map((change, j) => (
                      <li key={j} className="flex items-start gap-3">
                        {getTypeIcon(change.type)}
                        <span className="text-neutral-600 dark:text-neutral-400 text-sm">{change.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
