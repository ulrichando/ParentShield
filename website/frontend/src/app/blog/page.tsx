"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
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
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
              Blog
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white mb-4">
              Insights & <span className="italic">resources.</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl">
              Tips, insights, and resources for raising digitally healthy children.
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              className="border border-neutral-200 dark:border-neutral-800 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="md:flex">
                <div className="md:w-1/2 aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <span className="text-6xl">📱</span>
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-medium">
                      Featured
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">{featuredPost.category}</span>
                  </div>
                  <h2 className="text-2xl font-light text-neutral-900 dark:text-white mb-3">{featuredPost.title}</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-neutral-400 dark:text-neutral-500 mb-6">
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
                    className="inline-flex items-center text-neutral-900 dark:text-white hover:gap-3 gap-2 transition-all font-medium text-sm"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
            {regularPosts.map((post, i) => (
              <motion.article
                key={post.title}
                className="bg-white dark:bg-neutral-950 p-8 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{post.category}</span>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mt-3 mb-3 group-hover:underline">{post.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium tracking-wide hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
