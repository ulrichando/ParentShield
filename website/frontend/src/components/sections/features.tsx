"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Gamepad2,
  Globe,
  Shield,
  Laptop,
  BarChart3,
  Lock,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Clock,
    title: "Smart Time Limits",
    description:
      "Set daily screen time limits that automatically adjust based on your family's schedule. Includes homework mode and weekend extensions.",
    span: "md:col-span-2",
    featured: true,
  },
  {
    icon: Gamepad2,
    title: "Game Blocking",
    description:
      "Block Steam, Epic, and 500+ gaming platforms. Whitelist educational games while blocking distractions.",
    span: "",
  },
  {
    icon: Globe,
    title: "Website Filtering",
    description:
      "AI-powered content filtering that blocks harmful content in real-time across all browsers.",
    span: "",
  },
  {
    icon: Shield,
    title: "Tamper Protection",
    description:
      "Enterprise-grade security prevents kids from disabling or bypassing the software. Even tech-savvy teenagers can't circumvent it.",
    span: "md:col-span-3",
    featured: true,
  },
  {
    icon: Laptop,
    title: "Cross-Platform",
    description:
      "Works on Windows, macOS, and Linux. One subscription covers all your family's devices.",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Activity Reports",
    description:
      "Weekly reports show screen time trends, most-used apps, and blocked attempts.",
    span: "",
  },
  {
    icon: Lock,
    title: "App Control",
    description:
      "Block or limit any application. Set different rules for different apps.",
    span: "",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description:
      "Get notified when limits are reached or when blocked content is attempted.",
    span: "",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 bg-surface-base relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Everything You Need to{" "}
            <span className="text-gradient">Protect Your Family</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Comprehensive parental control tools designed for modern families.
            Easy to set up, impossible to bypass.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={cn("col-span-1", feature.span)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  featured = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "h-full rounded-xl p-4 border transition-all duration-300",
        "bg-surface-card hover:bg-surface-elevated",
        featured
          ? "border-primary-500/30 bg-linear-to-br from-primary-500/10 to-transparent"
          : "border-white/5 hover:border-primary-500/20"
      )}
      whileHover={{
        y: -3,
        boxShadow: featured
          ? "0 0 40px rgba(6, 182, 212, 0.15)"
          : "0 0 30px rgba(6, 182, 212, 0.08)",
      }}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
          featured ? "bg-gradient-primary shadow-glow-sm" : "bg-surface-elevated"
        )}
      >
        <Icon className={cn("w-5 h-5", featured ? "text-white" : "text-primary-400")} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
