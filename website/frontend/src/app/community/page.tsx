"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Github, Twitter, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const communities = [
  {
    icon: MessageSquare,
    title: "Discord Server",
    description: "Join thousands of parents sharing tips and getting help in real-time.",
    members: "5,000+",
    link: "#",
  },
  {
    icon: Github,
    title: "GitHub Discussions",
    description: "Report bugs, request features, and contribute to ParentShield.",
    members: "1,200+",
    link: "#",
  },
  {
    icon: Twitter,
    title: "Twitter/X",
    description: "Follow us for updates, tips, and digital parenting insights.",
    members: "15,000+",
    link: "#",
  },
];

const discussions = [
  { title: "Best practices for introducing screen time limits", author: "Sarah M.", replies: 42, category: "Parenting Tips" },
  { title: "How do you handle screen time during summer break?", author: "Mike T.", replies: 38, category: "Discussion" },
  { title: "Feature request: Homework mode", author: "Lisa K.", replies: 56, category: "Feature Requests" },
  { title: "Success story: Our family's digital detox journey", author: "David R.", replies: 24, category: "Success Stories" },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Community
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
              Join the <span className="italic">conversation.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl">
              Connect with thousands of parents who are navigating the digital world together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-16 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Where to Find Us
          </p>
          <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-8">
            Community <span className="italic">channels.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
            {communities.map((community, i) => (
              <motion.a
                key={community.title}
                href={community.link}
                className="bg-[#FAFAFA] dark:bg-neutral-900 p-8 group hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-6 group-hover:border-neutral-900 dark:group-hover:border-white transition-colors">
                  <community.icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">{community.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{community.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400 dark:text-neutral-500">{community.members} members</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Discussions
          </p>
          <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-8">
            Popular <span className="italic">topics.</span>
          </h2>
          <div className="space-y-px bg-neutral-200 dark:bg-neutral-800">
            {discussions.map((discussion, i) => (
              <motion.div
                key={discussion.title}
                className="bg-white dark:bg-neutral-950 p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{discussion.category}</span>
                    <h3 className="text-neutral-900 dark:text-white font-medium mt-1">{discussion.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">by {discussion.author}</p>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{discussion.replies}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-6" />
          <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-4">Ready to join?</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Our community is full of helpful parents. We&apos;d love to have you!
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            Join the Community
            <Users className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
