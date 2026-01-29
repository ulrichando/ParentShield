"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free Trial",
    price: "0",
    period: "7 days",
    description: "Try all Pro features free",
    features: [
      { text: "All Pro features included", included: true },
      { text: "7-day full access", included: true },
      { text: "No credit card required", included: true },
      { text: "Email support", included: true },
      { text: "1 device", included: true },
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Pro",
    price: "9.99",
    period: "month",
    description: "Complete family protection",
    features: [
      { text: "Unlimited devices", included: true },
      { text: "Game & app blocking", included: true },
      { text: "Website filtering", included: true },
      { text: "Screen time limits", included: true },
      { text: "Activity reports", included: true },
      { text: "Tamper protection", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Get Pro",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Basic",
    price: "4.99",
    period: "month",
    description: "Essential protection",
    features: [
      { text: "3 devices", included: true },
      { text: "Website filtering", included: true },
      { text: "Basic time limits", included: true },
      { text: "Weekly reports", included: true },
      { text: "Game blocking", included: false },
      { text: "Tamper protection", included: false },
    ],
    cta: "Get Basic",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 bg-surface-raised relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-linear-to-b from-primary-500/5 via-transparent to-secondary-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-primary-500/10 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Choose Your <span className="text-gradient">Protection Plan</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Start free, upgrade anytime. All plans include a 30-day money-back guarantee.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative rounded-xl p-5 border flex flex-col",
                plan.featured
                  ? "bg-linear-to-b from-primary-500/15 to-surface-card border-primary-500/50 scale-105 z-10"
                  : "bg-surface-card border-white/5"
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: plan.featured
                  ? "0 20px 40px rgba(6, 182, 212, 0.2)"
                  : "0 15px 30px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-glow-sm">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-xs">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-lg font-semibold text-gray-400">$</span>
                  <span
                    className={cn(
                      "text-3xl font-bold",
                      plan.featured ? "text-gradient" : "text-white"
                    )}
                  >
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 grow mb-5">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      feature.included ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 shrink-0" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.featured ? "primary" : "secondary"}
                size="sm"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.p
          className="text-center text-gray-500 text-xs mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Secure payment via Stripe - Cancel anytime - 30-day money-back guarantee
        </motion.p>
      </div>
    </section>
  );
}
