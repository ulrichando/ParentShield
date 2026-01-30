"use client";

import { motion } from "framer-motion";
import { Shield, Target, Heart, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const stats = [
  { label: "Families Protected", value: "10,000+" },
  { label: "Countries", value: "50+" },
  { label: "Apps Blocked Daily", value: "1M+" },
  { label: "Customer Satisfaction", value: "98%" },
];

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "We prioritize the digital safety of children above all else, building robust protection into every feature.",
  },
  {
    icon: Heart,
    title: "Family Focused",
    description: "We understand the challenges of modern parenting and design our tools to support healthy family dynamics.",
  },
  {
    icon: Target,
    title: "Transparency",
    description: "We believe in open communication. Our tools help parents and children have honest conversations about screen time.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Digital safety should be available to every family, regardless of technical expertise or budget.",
  },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", initial: "S" },
  { name: "Marcus Johnson", role: "CTO & Co-Founder", initial: "M" },
  { name: "Emily Rodriguez", role: "Head of Product", initial: "E" },
  { name: "David Kim", role: "Lead Engineer", initial: "D" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              About Us
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-white leading-tight mb-6">
              Protecting families in
              <br />
              <span className="italic">the digital age.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
              ParentShield was founded with a simple mission: give parents the tools they need to keep their children safe online without sacrificing trust or privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-extralight text-neutral-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white mb-8">
              How it all <span className="italic">started.</span>
            </h2>
          </motion.div>
          <div className="space-y-6 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              ParentShield began in 2023 when our founders, both parents themselves, realized that existing parental control solutions were either too invasive or too easy to bypass. They envisioned a tool that would respect both parents&apos; need for oversight and children&apos;s need for appropriate independence.
            </p>
            <p>
              Today, ParentShield protects over 10,000 families across 50+ countries. Our enterprise-grade technology blocks distracting games and websites while fostering healthy digital habits. We&apos;re proud to be trusted by families, schools, and organizations worldwide.
            </p>
            <p>
              We continue to innovate, adding new features based on feedback from our community of parents. Our commitment remains the same: making the digital world safer for children, one family at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Our Values
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white">
              What we <span className="italic">stand for.</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                className="bg-[#FAFAFA] dark:bg-neutral-900 p-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-6">
                  <value.icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Our Team
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white mb-4">
              Meet the <span className="italic">people.</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              We&apos;re a dedicated team of parents, engineers, and child safety advocates working to make the internet safer.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-light text-neutral-400 dark:text-neutral-500">{member.initial}</span>
                </div>
                <h3 className="font-medium text-neutral-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-neutral-400 dark:text-neutral-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
