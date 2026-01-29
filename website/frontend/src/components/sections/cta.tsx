"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-primary" />

      {/* Animated Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Rotating gradient effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm mb-5"
            whileHover={{ rotate: -5, scale: 1.1 }}
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Protecting Your Family Today
          </h2>

          <p className="text-base text-white/80 mb-6 max-w-2xl mx-auto">
            Join 10,000+ families who trust ParentShield to keep their children safe online.
            Start your free trial now — no credit card required.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {["7-day free trial", "No credit card", "Cancel anytime"].map((benefit) => (
              <div key={benefit} className="flex items-center gap-1.5 text-white/90 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="white" size="sm" className="group">
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="sm">
              Schedule a Demo
            </Button>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-white/60 text-xs">
            Trusted by parents in 50+ countries - Enterprise-grade security - GDPR compliant
          </p>
        </motion.div>
      </div>
    </section>
  );
}
