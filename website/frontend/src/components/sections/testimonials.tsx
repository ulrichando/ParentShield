"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "My kids went from six hours of gaming to actually doing their homework. This changed our family.",
    author: "Sarah Mitchell",
    role: "Mother of 3",
  },
  {
    quote: "As an IT professional, I was skeptical. My tech-savvy teenager couldn't bypass it. Genuinely impressed.",
    author: "David Chen",
    role: "IT Director",
  },
  {
    quote: "The weekly reports finally gave us something concrete to discuss. Real conversations, not arguments.",
    author: "Emily Rodriguez",
    role: "Working Mom",
  },
  {
    quote: "Five minute setup. It just works. No more daily battles about screen time. Worth every penny.",
    author: "Michael Thompson",
    role: "Father of 2",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-32 bg-[#FAFAFA] dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white leading-tight">
            Loved by families
            <br />
            <span className="italic">around the world.</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid - Editorial layout */}
        <div className="grid md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              className="bg-[#FAFAFA] dark:bg-neutral-900 p-10 md:p-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Quote mark */}
              <div className="text-6xl font-serif text-neutral-200 dark:text-neutral-800 leading-none mb-6">
                &ldquo;
              </div>

              {/* Quote */}
              <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8 font-light">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {testimonial.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rating */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            Rated <span className="text-neutral-900 dark:text-white font-medium">4.9/5</span> from 2,000+ reviews
          </p>
        </motion.div>
      </div>
    </section>
  );
}
