"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Loader2,
  User,
  Key,
  CreditCard,
  ExternalLink,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";


interface UserProfile {
  email: string;
  firstName: string | null;
  lastName: string | null;
}


export default function SettingsPage() {
  const { user, isLoading: authLoading, authFetch } = useCustomerAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileRes = await authFetch(`/api/account/profile`);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.data ?? profileData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (passwordData.new_password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authFetch(`/api/account/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.current_password,
          newPassword: passwordData.new_password,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.message || "Failed to change password");
      }
      setSuccess("Password changed successfully!");
      setShowPasswordForm(false);
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchSettings();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-neutral-900 dark:text-white animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Editorial Page Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
          Account
        </p>
        <h1 className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-white">
          Settings
        </h1>
      </motion.div>

      {error && (
        <motion.div
          className="bg-red-500/10 border border-red-500/20 p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-red-400 text-center">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          className="bg-green-500/10 border border-green-500/20 p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-green-400 text-center">{success}</p>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-neutral-900 dark:text-white animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Profile Section */}
          <motion.div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Profile</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile?.email || user?.email || ""}
                    disabled
                    className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={`${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "Not set"}
                    disabled
                    className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>

                {showPasswordForm && (
                  <motion.div
                    className="mt-4 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, current_password: e.target.value })
                        }
                        className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.new_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, new_password: e.target.value })
                          }
                          className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirm_password: e.target.value })
                          }
                          className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={changePassword}
                      disabled={isChangingPassword || !passwordData.current_password || !passwordData.new_password}
                    >
                      {isChangingPassword ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      Update Password
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subscription Link */}
            <motion.div
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Subscription</h2>
              </div>

              <p className="text-neutral-500 text-sm mb-4">
                Manage your subscription, billing, and payment methods.
              </p>

              <Link href="/dashboard/billing">
                <Button variant="secondary" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Manage Subscription
                </Button>
              </Link>
            </motion.div>

            {/* API Link */}
            <motion.div
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Code className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">API & Integrations</h2>
              </div>

              <p className="text-neutral-500 text-sm mb-4">
                Manage API keys and webhooks for programmatic access.
              </p>

              <Link href="/dashboard/api">
                <Button variant="secondary" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Manage API
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
