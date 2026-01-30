"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "4.99",
    description: "Essential protection for small families",
    features: [
      "3 devices",
      "Website filtering",
      "Basic time limits",
      "Weekly reports",
    ],
  },
  {
    name: "Pro",
    price: "9.99",
    description: "Complete protection for growing families",
    featured: true,
    features: [
      "Unlimited devices",
      "Game & app blocking",
      "Advanced filtering",
      "Screen time limits",
      "Activity reports",
      "Tamper protection",
      "Priority support",
    ],
  },
  {
    name: "Trial",
    price: "0",
    description: "Experience everything free for 7 days",
    features: [
      "All Pro features",
      "7-day access",
      "No credit card required",
      "1 device",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white leading-tight">
            Simple, transparent
            <br />
            <span className="italic">pricing.</span>
          </h2>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`p-10 md:p-12 ${plan.featured ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" : "bg-white dark:bg-neutral-950"}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Plan name */}
              <p className={`text-xs uppercase tracking-[0.2em] mb-6 ${plan.featured ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-400 dark:text-neutral-500"}`}>
                {plan.name}
                {plan.featured && " — Most Popular"}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-5xl font-light ${plan.featured ? "text-white dark:text-neutral-900" : "text-neutral-900 dark:text-white"}`}>
                  ${plan.price}
                </span>
                <span className={plan.featured ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-400 dark:text-neutral-500"}>/mo</span>
              </div>

              {/* Description */}
              <p className={`text-sm mb-10 ${plan.featured ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-500 dark:text-neutral-400"}`}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 ${plan.featured ? "text-white dark:text-neutral-900" : "text-neutral-400 dark:text-neutral-500"}`} />
                    <span className={plan.featured ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/register" className="block">
                <motion.button
                  className={`w-full py-4 text-sm font-medium tracking-wide transition-colors ${
                    plan.featured
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100"
                  }`}
                  whileHover={{ x: 3 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          className="text-center text-sm text-neutral-400 dark:text-neutral-500 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          All plans include a 30-day money-back guarantee
        </motion.p>
      </div>
    </section>
  );
}
