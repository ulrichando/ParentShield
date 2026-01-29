"use client";

import { motion } from "framer-motion";
import { Shield, Target, Heart, Award, Globe } from "lucide-react";
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
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-600/20 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">Trusted by families worldwide</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Protecting Families in the Digital Age
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              ParentShield was founded with a simple mission: give parents the tools they need to keep their children safe online without sacrificing trust or privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5">
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
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Story</h2>
          <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
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
      <section className="py-20 px-6 bg-surface-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                className="bg-surface-card/50 rounded-2xl border border-white/5 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Meet the Team</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            We&apos;re a dedicated team of parents, engineers, and child safety advocates working to make the internet safer.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{member.initial}</span>
                </div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
