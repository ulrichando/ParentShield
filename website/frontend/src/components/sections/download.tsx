"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Monitor, Apple, Terminal } from "lucide-react";

const platforms = [
  {
    name: "Windows",
    icon: Monitor,
    version: "0.1.0",
    size: "3.2 MB",
    requirements: "Windows 10+",
    downloadUrl: "/downloads/windows/ParentShield_0.1.0_x64-setup.exe",
  },
  {
    name: "macOS",
    icon: Apple,
    version: "0.1.0",
    size: "11.5 MB",
    requirements: "macOS 12+",
    downloadUrl: "/downloads/macos/ParentShield_0.1.0_universal.dmg",
  },
  {
    name: "Linux",
    icon: Terminal,
    version: "0.1.0",
    size: "7.6 MB",
    requirements: "Ubuntu 20.04+",
    downloadUrl: "/downloads/linux/ParentShield_0.1.0_amd64.deb",
  },
];

export function DownloadSection() {
  return (
    <section id="download" className="py-32 bg-[#FAFAFA] dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Editorial Header */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-500 mb-6">
              Download
            </p>
            <h2 className="text-5xl md:text-7xl font-extralight text-neutral-900 dark:text-white leading-[0.9] tracking-tight">
              Install.
              <br />
              <span className="italic font-light">Protect.</span>
              <br />
              <span className="text-neutral-300 dark:text-neutral-700">Done.</span>
            </h2>
          </motion.div>

          <motion.div
            className="flex items-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="border-l border-neutral-200 dark:border-neutral-700 pl-8">
              <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                Five minutes from download to complete protection.
                No technical expertise. No complicated setup.
              </p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500">
                All builds are code-signed and verified.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Platform Cards - Magazine Layout */}
        <div className="relative">
          {/* Large background number */}
          <div className="absolute -top-20 -right-20 text-[20rem] font-extralight text-neutral-100 dark:text-neutral-800 select-none pointer-events-none leading-none">
            3
          </div>

          <div className="grid md:grid-cols-3 gap-0 relative">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                className="group relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                {/* Card */}
                <div className="border border-neutral-200 dark:border-neutral-800 p-10 md:p-14 h-full bg-[#FAFAFA] dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-800 transition-colors duration-500">
                  {/* Index */}
                  <span className="text-xs text-neutral-300 dark:text-neutral-600 font-mono">
                    0{index + 1}
                  </span>

                  {/* Icon */}
                  <div className="my-8">
                    <platform.icon
                      className="w-10 h-10 text-neutral-900 dark:text-white stroke-1"
                    />
                  </div>

                  {/* Platform Name */}
                  <h3 className="text-3xl font-light text-neutral-900 dark:text-white mb-2 tracking-tight">
                    {platform.name}
                  </h3>

                  {/* Details */}
                  <div className="flex gap-4 text-xs text-neutral-400 dark:text-neutral-500 mb-10">
                    <span>v{platform.version}</span>
                    <span>·</span>
                    <span>{platform.size}</span>
                    <span>·</span>
                    <span>{platform.requirements}</span>
                  </div>

                  {/* Download Link */}
                  <a
                    href={platform.downloadUrl}
                    download
                    className="inline-flex items-center gap-3 text-neutral-900 dark:text-white group/link"
                  >
                    <span className="text-sm font-medium tracking-wide uppercase">
                      Download
                    </span>
                    <ArrowDownRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:translate-y-1" />
                  </a>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-neutral-900 dark:bg-white group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <p className="text-4xl font-extralight text-neutral-900 dark:text-white mb-1">50K+</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Downloads</p>
          </div>
          <div>
            <p className="text-4xl font-extralight text-neutral-900 dark:text-white mb-1">5 min</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Setup time</p>
          </div>
          <div>
            <p className="text-4xl font-extralight text-neutral-900 dark:text-white mb-1">99.9%</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Uptime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
