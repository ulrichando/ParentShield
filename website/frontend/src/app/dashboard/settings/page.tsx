"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Settings,
  Loader2,
  Save,
  User,
  Bell,
  Mail,
  Clock,
  ToggleLeft,
  ToggleRight,
  Key,
  CreditCard,
  ExternalLink,
  Code,
  Plus,
  Copy,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface UserSettings {
  email_alerts: boolean;
  email_weekly_report: boolean;
  email_security_alerts: boolean;
  alert_blocked_sites: boolean;
  alert_blocked_apps: boolean;
  alert_screen_time: boolean;
  alert_tamper_attempts: boolean;
  timezone: string;
}

interface UserProfile {
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  expires_at: string | null;
  is_revoked: boolean;
  last_used_at: string | null;
  created_at: string;
}

interface NewAPIKey extends APIKey {
  key: string;
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

export default function SettingsPage() {
  const { user, isLoading: authLoading, authFetch } = useCustomerAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoadingApiKeys, setIsLoadingApiKeys] = useState(false);
  const [showCreateKeyForm, setShowCreateKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [settingsRes, profileRes] = await Promise.all([
        authFetch(`${API_URL}/parental/settings`),
        authFetch(`${API_URL}/account/profile`),
      ]);

      if (!settingsRes.ok) throw new Error("Failed to fetch settings");
      const settingsData = await settingsRes.json();
      setSettings(settingsData);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }
      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authFetch(`${API_URL}/parental/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      setHasChanges(false);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
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
      const response = await authFetch(`${API_URL}/account/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        // Handle validation errors (detail is an array) vs regular errors (detail is a string)
        let errorMessage = "Failed to change password";
        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          // Pydantic validation errors return msg field
          errorMessage = data.detail[0]?.msg || errorMessage;
        }
        throw new Error(errorMessage);
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

  const updateSetting = (key: keyof UserSettings, value: boolean | string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  // API Key functions
  const fetchApiKeys = async () => {
    setIsLoadingApiKeys(true);
    try {
      const response = await authFetch(`${API_URL}/api/v1/api-keys`);
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    } finally {
      setIsLoadingApiKeys(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;

    setIsCreatingKey(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/api/v1/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName, scopes: ["read", "write"] }),
      });

      if (!response.ok) throw new Error("Failed to create API key");

      const data: NewAPIKey = await response.json();
      setNewlyCreatedKey(data.key);
      setApiKeys((prev) => [{ ...data, key: undefined } as unknown as APIKey, ...prev]);
      setNewKeyName("");
      setShowCreateKeyForm(false);
      setSuccess("API key created! Make sure to copy it - it won't be shown again.");
      setTimeout(() => setSuccess(null), 10000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setIsCreatingKey(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;

    try {
      const response = await authFetch(`${API_URL}/api/v1/api-keys/${keyId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to revoke API key");

      setApiKeys((prev) => prev.map((key) => (key.id === keyId ? { ...key, is_revoked: true } : key)));
      setSuccess("API key revoked successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke API key");
    }
  };

  const copyToClipboard = async (text: string, keyId?: string) => {
    await navigator.clipboard.writeText(text);
    if (keyId) {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchSettings();
      fetchApiKeys();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        {/* Page Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-lg md:text-base font-bold text-white mb-2 flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              Settings
            </h1>
            <p className="text-gray-400">Manage your account and notification preferences.</p>
          </div>
          <Button size="sm" onClick={saveSettings} disabled={!hasChanges || isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-400 text-center">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-green-400 text-center">{success}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : settings ? (
          <div className="space-y-3">
            {/* Profile Section */}
            <motion.div
              className="bg-surface-card rounded-xl border border-white/5 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-primary-400" />
                <h2 className="text-sm font-semibold text-white">Profile</h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile?.email || user?.email || ""}
                      disabled
                      className="w-full bg-surface-elevated border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={`${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Not set"}
                      disabled
                      className="w-full bg-surface-elevated border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </button>

                  {showPasswordForm && (
                    <motion.div
                      className="mt-4 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, current_password: e.target.value })
                          }
                          className="w-full bg-surface-elevated border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.new_password}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, new_password: e.target.value })
                            }
                            className="w-full bg-surface-elevated border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirm_password}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, confirm_password: e.target.value })
                            }
                            className="w-full bg-surface-elevated border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
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

            {/* Email Notifications */}
            <motion.div
              className="bg-surface-card rounded-xl border border-white/5 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-primary-400" />
                <h2 className="text-sm font-semibold text-white">Email Notifications</h2>
              </div>

              <div className="space-y-3">
                {[
                  { key: "email_alerts", label: "Alert Emails", description: "Receive emails when alerts are triggered" },
                  { key: "email_weekly_report", label: "Weekly Report", description: "Get a weekly summary of device activity" },
                  { key: "email_security_alerts", label: "Security Alerts", description: "Important security notifications" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-white">{item.label}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => updateSetting(item.key as keyof UserSettings, !settings[item.key as keyof UserSettings])}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {settings[item.key as keyof UserSettings] ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-500" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alert Preferences */}
            <motion.div
              className="bg-surface-card rounded-xl border border-white/5 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-primary-400" />
                <h2 className="text-sm font-semibold text-white">Alert Preferences</h2>
              </div>

              <div className="space-y-3">
                {[
                  { key: "alert_blocked_sites", label: "Blocked Sites", description: "Alert when blocked websites are accessed" },
                  { key: "alert_blocked_apps", label: "Blocked Apps", description: "Alert when blocked apps are launched" },
                  { key: "alert_screen_time", label: "Screen Time", description: "Alert when screen time limits are reached" },
                  { key: "alert_tamper_attempts", label: "Tamper Attempts", description: "Alert when someone tries to disable the app" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-white">{item.label}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => updateSetting(item.key as keyof UserSettings, !settings[item.key as keyof UserSettings])}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {settings[item.key as keyof UserSettings] ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-500" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Timezone */}
            <motion.div
              className="bg-surface-card rounded-xl border border-white/5 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-primary-400" />
                <h2 className="text-sm font-semibold text-white">Timezone</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                  className="w-full md:w-64 bg-surface-elevated border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Used for scheduling and activity reports.
                </p>
              </div>
            </motion.div>

            {/* Subscription Link */}
            <motion.div
              className="bg-surface-card rounded-xl border border-white/5 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-primary-400" />
                <h2 className="text-sm font-semibold text-white">Subscription</h2>
              </div>

              <p className="text-gray-400 mb-4">
                Manage your subscription, billing, and payment methods.
              </p>

              <Link href="/dashboard/billing">
                <Button variant="secondary">
                  <ExternalLink className="w-4 h-4" />
                  Manage Subscription
                </Button>
              </Link>
            </motion.div>

            {/* API Keys */}
            <motion.div
              className="bg-surface-card rounded-xl border border-white/5 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-primary-400" />
                  <h2 className="text-sm font-semibold text-white">API Keys</h2>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowCreateKeyForm(!showCreateKeyForm)}
                >
                  <Plus className="w-4 h-4" />
                  New Key
                </Button>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Use API keys to access ParentShield data programmatically.
              </p>

              {/* Create Key Form */}
              {showCreateKeyForm && (
                <motion.div
                  className="bg-surface-elevated rounded-lg p-4 mb-4 border border-white/10"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Key Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., My Integration"
                      className="flex-1 bg-surface-base border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                    />
                    <Button onClick={createApiKey} disabled={isCreatingKey || !newKeyName.trim()}>
                      {isCreatingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Newly Created Key */}
              {newlyCreatedKey && (
                <motion.div
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-green-400 text-sm font-medium mb-2">
                    Your new API key (copy it now - it won&apos;t be shown again):
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-surface-base rounded px-3 py-2 text-sm text-white font-mono break-all">
                      {newlyCreatedKey}
                    </code>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        copyToClipboard(newlyCreatedKey);
                        setNewlyCreatedKey(null);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* API Keys List */}
              {isLoadingApiKeys ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No API keys yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        key.is_revoked
                          ? "bg-red-500/5 border-red-500/20 opacity-60"
                          : "bg-surface-elevated border-white/10"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{key.name}</span>
                          {key.is_revoked && (
                            <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                              Revoked
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <code className="font-mono">{key.key_prefix}</code>
                          <span>
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </span>
                          {key.last_used_at && (
                            <span>
                              Last used {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(key.key_prefix, key.id)}
                          title="Copy key prefix"
                        >
                          {copiedKeyId === key.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        {!key.is_revoked && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => revokeApiKey(key.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Revoke key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        ) : null}
    </DashboardLayout>
  );
}
