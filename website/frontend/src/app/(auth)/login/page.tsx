"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = typeof data.detail === "string"
          ? data.detail
          : Array.isArray(data.detail)
            ? data.detail[0]?.msg || "Login failed"
            : "Login failed";
        throw new Error(errorMsg);
      }

      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Fetch user profile to determine role
      try {
        const profileRes = await fetch("/api/account/profile", {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        if (profileRes.ok) {
          const profile = await profileRes.json();
          localStorage.setItem("user_role", profile.role);
          localStorage.setItem("user_email", profile.email);
          localStorage.setItem("user_name", profile.first_name || "User");
          // Redirect based on role
          if (profile.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          // Profile fetch failed, redirect to dashboard anyway
          router.push("/dashboard");
        }
      } catch {
        // Profile fetch error, redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-16 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute -top-25 -right-12 w-75 h-75 rounded-full bg-primary-600/30 blur-[100px]" />
        <div className="absolute -bottom-12 -left-12 w-50 h-50 rounded-full bg-secondary-500/20 blur-[80px]" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-5">
          <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ParentShield</span>
        </Link>

        {/* Card */}
        <div className="bg-surface-card/80 backdrop-blur-xl rounded-xl border border-white/10 p-5">
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </div>

          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-xs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-elevated border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-elevated border border-white/10 rounded-lg py-2 pl-9 pr-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-400 text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Accounts Info */}
        <motion.div
          className="mt-4 bg-surface-card/50 backdrop-blur rounded-lg border border-white/5 p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-gray-500 text-center mb-1.5">Demo Accounts (click to fill)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@parentshield.app");
                setPassword("Admin123!");
              }}
              className="bg-surface-elevated rounded-lg p-1.5 text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <p className="text-gray-400 font-medium text-xs">Admin</p>
              <p className="text-gray-500 text-xs truncate">admin@parentshield.app</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("customer@test.com");
                setPassword("Customer123");
              }}
              className="bg-surface-elevated rounded-lg p-1.5 text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <p className="text-gray-400 font-medium text-xs">Customer</p>
              <p className="text-gray-500 text-xs truncate">customer@test.com</p>
            </button>
          </div>
        </motion.div>
      </motion.div>
      </div>
      <Footer />
    </main>
  );
}
