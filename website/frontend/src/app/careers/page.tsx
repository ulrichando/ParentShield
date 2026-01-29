"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, ArrowRight, Heart, Zap, Users, Coffee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive growth through creative campaigns and content marketing strategies.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Mission to Protect Families
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              We&apos;re building the future of digital parenting. Join a team that&apos;s passionate about making the internet safer for children.
            </p>
            <Button size="lg">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-surface-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Work With Us</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                className="bg-surface-card/50 rounded-2xl border border-white/5 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Culture</h2>
          <div className="prose prose-invert prose-gray max-w-none text-gray-300 space-y-6">
            <p>
              At ParentShield, we believe that great products come from diverse, empowered teams. We&apos;ve built a culture that values transparency, creativity, and work-life balance.
            </p>
            <p>
              We&apos;re a remote-first company, which means you can work from anywhere while still feeling connected to your teammates through regular video calls, virtual events, and annual company retreats.
            </p>
            <p>
              We encourage continuous learning and provide a generous professional development budget. Whether you want to attend conferences, take courses, or buy books, we&apos;ve got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6 bg-surface-card/30" id="positions">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <motion.div
                key={job.title}
                className="bg-surface-card/50 rounded-2xl border border-white/5 p-6 hover:border-primary-500/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                    <p className="text-gray-500 text-sm mb-3">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link href={`mailto:careers@parentshield.app?subject=Application: ${job.title}`}>
                    <Button variant="secondary">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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
          <h2 className="text-2xl font-bold text-white mb-4">Don&apos;t see the right role?</h2>
          <p className="text-gray-400 mb-6">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <Link href="mailto:careers@parentshield.app">
            <Button variant="secondary">
              Send Your Resume
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
