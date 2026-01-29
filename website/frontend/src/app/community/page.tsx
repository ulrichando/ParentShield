"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Github, Twitter, Heart, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const communities = [
  {
    icon: MessageSquare,
    title: "Discord Server",
    description: "Join thousands of parents sharing tips and getting help in real-time.",
    members: "5,000+",
    link: "#",
    cta: "Join Discord",
  },
  {
    icon: Github,
    title: "GitHub Discussions",
    description: "Report bugs, request features, and contribute to ParentShield.",
    members: "1,200+",
    link: "#",
    cta: "View on GitHub",
  },
  {
    icon: Twitter,
    title: "Twitter/X",
    description: "Follow us for updates, tips, and digital parenting insights.",
    members: "15,000+",
    link: "#",
    cta: "Follow Us",
  },
];

const discussions = [
  {
    title: "Best practices for introducing screen time limits",
    author: "Sarah M.",
    replies: 42,
    category: "Parenting Tips",
  },
  {
    title: "How do you handle screen time during summer break?",
    author: "Mike T.",
    replies: 38,
    category: "Discussion",
  },
  {
    title: "Feature request: Homework mode",
    author: "Lisa K.",
    replies: 56,
    category: "Feature Requests",
  },
  {
    title: "Success story: Our family's digital detox journey",
    author: "David R.",
    replies: 24,
    category: "Success Stories",
  },
];

const contributors = [
  { name: "Alex Chen", contributions: 47, initial: "A" },
  { name: "Maria Garcia", contributions: 32, initial: "M" },
  { name: "James Wilson", contributions: 28, initial: "J" },
  { name: "Emma Davis", contributions: 21, initial: "E" },
];

export default function CommunityPage() {
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
            <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Community
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with thousands of parents who are navigating the digital world together. Share tips, get support, and learn from each other.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-16 px-6 bg-surface-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Where to Find Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {communities.map((community, i) => (
              <motion.div
                key={community.title}
                className="bg-surface-card/50 rounded-2xl border border-white/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                  <community.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{community.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{community.description}</p>
                <p className="text-primary-400 text-sm mb-4">{community.members} members</p>
                <Link href={community.link}>
                  <Button variant="secondary" className="w-full">
                    {community.cta}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Popular Discussions</h2>
          <div className="space-y-4">
            {discussions.map((discussion, i) => (
              <motion.div
                key={discussion.title}
                className="bg-surface-card/50 rounded-xl border border-white/5 p-4 hover:border-primary-500/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-primary-400 font-medium">{discussion.category}</span>
                    <h3 className="text-white font-medium mt-1">{discussion.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">by {discussion.author}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{discussion.replies}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="secondary">View All Discussions</Button>
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-20 px-6 bg-surface-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Top Contributors</h2>
          <p className="text-gray-400 text-center mb-8">
            Thank you to our amazing community members who help make ParentShield better.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contributors.map((contributor, i) => (
              <motion.div
                key={contributor.name}
                className="bg-surface-card/50 rounded-xl border border-white/5 p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-white">{contributor.initial}</span>
                </div>
                <h3 className="font-medium text-white">{contributor.name}</h3>
                <p className="text-sm text-gray-500">{contributor.contributions} contributions</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 text-primary-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Our community is full of helpful parents and our team members. We&apos;d love to have you!
          </p>
          <Button size="lg">
            Join the Community
            <Users className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
