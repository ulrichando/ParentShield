"use client";

import { motion } from "framer-motion";
import { Download, Monitor, Apple, Terminal } from "lucide-react";
import Link from "next/link";

const platforms = [
  {
    name: "Windows",
    icon: Monitor,
    version: "v2.5.1",
    requirements: "Windows 10/11",
    primary: true,
  },
  {
    name: "macOS",
    icon: Apple,
    version: "v2.5.1",
    requirements: "macOS 12+",
    primary: false,
  },
  {
    name: "Linux",
    icon: Terminal,
    version: "v2.5.1",
    requirements: "Ubuntu 20.04+, Debian 11+",
    primary: false,
  },
];

export function DownloadSection() {
  return (
    <section id="download" className="py-16 bg-surface-raised relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Download
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Get Started in <span className="text-gradient">Minutes</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Download ParentShield for your platform. Works on all major operating systems.
          </p>
        </motion.div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              className="bg-surface-card rounded-xl p-5 border border-white/5 text-center hover:border-primary-500/20 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 0 30px rgba(6, 182, 212, 0.12)",
              }}
            >
              {/* Icon */}
              <motion.div
                className="w-14 h-14 mx-auto rounded-xl bg-surface-elevated flex items-center justify-center mb-4"
                whileHover={{ rotate: -5, scale: 1.05 }}
              >
                <platform.icon className="w-7 h-7 text-gray-400" />
              </motion.div>

              {/* Platform Info */}
              <h3 className="text-lg font-bold text-white mb-1">{platform.name}</h3>
              <p className="text-gray-500 text-xs mb-0.5">{platform.version}</p>
              <p className="text-gray-600 text-xs mb-4">{platform.requirements}</p>

              {/* Download Button */}
              <Link
                href="/register"
                className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 w-full px-4 py-2 text-sm ${
                  platform.primary
                    ? "bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/25"
                    : "bg-surface-elevated text-gray-300 border border-white/10 hover:border-primary-500/30 hover:text-white"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-xs">
            All downloads are digitally signed and verified. Need help installing?{" "}
            <a href="/docs" className="text-primary-400 hover:underline">
              View our installation guide
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
