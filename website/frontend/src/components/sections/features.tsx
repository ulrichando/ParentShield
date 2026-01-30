"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Gamepad2,
  Globe,
  Shield,
  BarChart3,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    number: "01",
    title: "Screen Time",
    description: "Intelligent limits that adapt to your family's schedule. Homework mode, weekend extensions, and granular per-app controls.",
  },
  {
    icon: Gamepad2,
    number: "02",
    title: "Game Control",
    description: "Block 500+ gaming platforms with a single toggle. Steam, Epic, Discord—managed effortlessly.",
  },
  {
    icon: Globe,
    number: "03",
    title: "Web Filtering",
    description: "AI-powered content analysis blocks harmful sites in real-time. Protection that stays invisible.",
  },
  {
    icon: Shield,
    number: "04",
    title: "Tamper-Proof",
    description: "Enterprise-grade security that even tech-savvy teenagers cannot bypass. You stay in control.",
  },
  {
    icon: BarChart3,
    number: "05",
    title: "Insights",
    description: "Weekly reports with usage trends, app breakdowns, and actionable recommendations.",
  },
  {
    icon: Zap,
    number: "06",
    title: "Quick Setup",
    description: "Get protected in under five minutes. No complex configuration required.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-12 mb-24">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white leading-tight">
              Everything you need,
              <br />
              <span className="italic">nothing you don&apos;t.</span>
            </h2>
          </motion.div>
          <motion.div
            className="lg:col-span-5 lg:col-start-8 flex items-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Comprehensive protection designed for modern families.
              Simple to configure, impossible to bypass.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start gap-6">
        {/* Number */}
        <span className="text-xs text-neutral-300 dark:text-neutral-600 font-light mt-1">
          {feature.number}
        </span>

        <div className="flex-1">
          {/* Icon */}
          <div className="w-12 h-12 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 mb-6 group-hover:border-neutral-900 dark:group-hover:border-white transition-colors">
            <Icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-3">
            {feature.title}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
