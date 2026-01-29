"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const posts = [
  {
    title: "5 Signs Your Child Needs Screen Time Limits",
    excerpt: "Learn the warning signs that indicate your child may be spending too much time on devices and how to address it.",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    category: "Parenting Tips",
    featured: true,
  },
  {
    title: "How to Talk to Your Kids About Online Safety",
    excerpt: "A guide to having open, productive conversations with your children about staying safe online.",
    date: "Jan 10, 2026",
    readTime: "7 min read",
    category: "Online Safety",
    featured: false,
  },
  {
    title: "The Impact of Gaming on Academic Performance",
    excerpt: "Research-backed insights into how gaming affects your child's school performance and what you can do about it.",
    date: "Jan 5, 2026",
    readTime: "6 min read",
    category: "Research",
    featured: false,
  },
  {
    title: "Setting Up ParentShield: A Step-by-Step Guide",
    excerpt: "Everything you need to know to get ParentShield running on all your family's devices.",
    date: "Dec 28, 2025",
    readTime: "4 min read",
    category: "Tutorials",
    featured: false,
  },
  {
    title: "Age-Appropriate Screen Time Guidelines",
    excerpt: "Expert recommendations for how much screen time is healthy for children at different ages.",
    date: "Dec 20, 2025",
    readTime: "5 min read",
    category: "Parenting Tips",
    featured: false,
  },
  {
    title: "Understanding Gaming Addiction in Children",
    excerpt: "What parents need to know about gaming disorder and how to identify if your child is at risk.",
    date: "Dec 15, 2025",
    readTime: "8 min read",
    category: "Research",
    featured: false,
  },
];

const categories = ["All", "Parenting Tips", "Online Safety", "Research", "Tutorials", "Product Updates"];

export default function BlogPage() {
  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tips, insights, and resources for raising digitally healthy children.
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "bg-primary-600 text-white"
                    : "bg-surface-card text-gray-400 hover:text-white hover:bg-surface-elevated"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              className="bg-surface-card/50 rounded-2xl border border-white/5 overflow-hidden mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="md:flex">
                <div className="md:w-1/2 aspect-video bg-linear-to-br from-primary-600/20 to-secondary-600/20 flex items-center justify-center">
                  <span className="text-6xl">📱</span>
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                    <span className="text-gray-500 text-sm">{featuredPost.category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{featuredPost.title}</h2>
                  <p className="text-gray-400 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, i) => (
              <motion.article
                key={post.title}
                className="bg-surface-card/50 rounded-2xl border border-white/5 overflow-hidden hover:border-primary-500/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="aspect-video bg-linear-to-br from-primary-600/10 to-secondary-600/10 flex items-center justify-center">
                  <Tag className="w-8 h-8 text-gray-600" />
                </div>
                <div className="p-6">
                  <span className="text-xs text-primary-400 font-medium">{post.category}</span>
                  <h3 className="text-lg font-semibold text-white mt-2 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-surface-card border border-white/10 rounded-xl text-white hover:bg-surface-elevated transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
