"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, ArrowRight, Heart, Zap, Users, Coffee } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const benefits = [
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical, dental, and vision coverage" },
  { icon: Zap, title: "Flexible Hours", description: "Work when you're most productive" },
  { icon: Users, title: "Remote First", description: "Work from anywhere in the world" },
  { icon: Coffee, title: "Unlimited PTO", description: "Take the time you need to recharge" },
];

const openings = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build the next generation of parental control features using React, Node.js, and Rust.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Design intuitive experiences that help families manage their digital lives.",
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Remote (US)",
    type: "Full-time",
    description: "Help our customers get the most out of ParentShield and ensure their success.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Careers
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-white leading-tight mb-6">
              Join our mission to
              <br />
              <span className="italic">protect families.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl">
              We&apos;re building the future of digital parenting. Join a team that&apos;s passionate about making the internet safer for children.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Benefits
          </p>
          <h2 className="text-3xl font-light text-neutral-900 dark:text-white mb-12">
            Why work <span className="italic">with us.</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                className="bg-white dark:bg-neutral-950 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6">
                  <benefit.icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6 bg-[#FAFAFA] dark:bg-neutral-900" id="positions">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Open Positions
          </p>
          <h2 className="text-3xl font-light text-neutral-900 dark:text-white mb-12">
            Current <span className="italic">openings.</span>
          </h2>
          <div className="space-y-px bg-neutral-200 dark:bg-neutral-800">
            {openings.map((job, i) => (
              <motion.div
                key={job.title}
                className="bg-[#FAFAFA] dark:bg-neutral-900 p-8 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">{job.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 dark:text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`mailto:careers@parentshield.app?subject=Application: ${job.title}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-4">Don&apos;t see the right role?</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            We&apos;re always looking for talented people. Send us your resume.
          </p>
          <Link
            href="mailto:careers@parentshield.app"
            className="inline-flex items-center gap-2 px-8 py-4 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            Send Your Resume
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
