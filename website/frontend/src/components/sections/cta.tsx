"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-6">
              Get Started
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-neutral-900 dark:text-white leading-[0.95] tracking-tight mb-8">
              Ready to
              <br />
              <span className="italic font-light">protect</span>
              <br />
              your family?
            </h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-10 max-w-md">
              Join thousands of families who trust ParentShield
              to keep their children safe online.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-6 items-center">
              <Link href="/register">
                <motion.button
                  className="group px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm uppercase tracking-wider font-medium flex items-center gap-3"
                  whileHover={{ x: 5 }}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link
                href="/#pricing"
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors underline underline-offset-4"
              >
                View Pricing
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex gap-10 mt-12 pt-10 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="text-2xl font-light text-neutral-900 dark:text-white">7 days</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Free trial</p>
              </div>
              <div>
                <p className="text-2xl font-light text-neutral-900 dark:text-white">No card</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Required</p>
              </div>
              <div>
                <p className="text-2xl font-light text-neutral-900 dark:text-white">Cancel</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Anytime</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Visual Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Large decorative number */}
            <div className="text-[25rem] font-extralight text-neutral-100 dark:text-neutral-900 leading-none select-none pointer-events-none">
              7
            </div>

            {/* Floating card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-8 shadow-2xl dark:shadow-none dark:border dark:border-neutral-700 max-w-xs">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4">
                What you get
              </p>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
                  Unlimited devices
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
                  All premium features
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
                  Priority support
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
                  No commitment
                </li>
              </ul>
            </div>

            {/* Accent lines */}
            <div className="absolute top-20 right-0 w-32 h-px bg-neutral-200 dark:bg-neutral-800" />
            <div className="absolute bottom-32 left-0 w-px h-32 bg-neutral-200 dark:bg-neutral-800" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
