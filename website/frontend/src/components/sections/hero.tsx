"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          {/* Left content - offset for asymmetry */}
          <div className="lg:col-span-7 lg:pr-12">
            {/* Eyebrow */}
            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Parental Control Software
            </motion.p>

            {/* Main headline - editorial typography */}
            <motion.h1
              className="mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="block text-6xl md:text-7xl lg:text-8xl font-light text-neutral-900 dark:text-white leading-[0.9] tracking-tight">
                Protect
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-light italic text-neutral-900 dark:text-white leading-[0.9] tracking-tight">
                your family&apos;s
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-semibold text-neutral-900 dark:text-white leading-[0.9] tracking-tight">
                digital life.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Screen time limits. Game blocking. Web filtering.
              Enterprise-grade protection made simple for modern families.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-6 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link href="/register">
                <motion.button
                  className="group px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm uppercase tracking-wider font-medium flex items-center gap-3"
                  whileHover={{ x: 5 }}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <button className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors underline underline-offset-4">
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-12 mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { value: "10K+", label: "Families" },
                { value: "99.9%", label: "Uptime" },
                { value: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-light text-neutral-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Editorial image placeholder */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="aspect-4/5 bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden">
              {/* Abstract shapes for visual interest */}
              <div className="absolute top-12 left-12 w-32 h-32 border border-neutral-300 dark:border-neutral-700 rounded-full" />
              <div className="absolute bottom-20 right-8 w-48 h-48 bg-neutral-200 dark:bg-neutral-800" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-[200px] font-light text-neutral-200 dark:text-neutral-800 select-none">PS</div>
              </div>

              {/* Floating label */}
              <div className="absolute bottom-8 left-8 bg-white dark:bg-neutral-800 px-4 py-2 shadow-sm dark:shadow-none dark:border dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Protected</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Since 2024</p>
              </div>
            </div>

            {/* Offset accent line */}
            <div className="absolute -left-8 top-20 w-px h-32 bg-neutral-900 dark:bg-white" />
          </motion.div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-800" />
    </section>
  );
}
