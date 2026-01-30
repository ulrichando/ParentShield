"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Bell, Shield, Mail, Globe, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function SettingsSection({ title, description, icon: Icon, children }: SettingsSectionProps) {
  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-[#FAFAFA] dark:bg-neutral-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</h3>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function ToggleSetting({ label, description, enabled, onChange }: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start sm:items-center justify-between gap-3 py-3 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-neutral-900 dark:text-white">{label}</p>
        <p className="text-[10px] text-neutral-500 wrap-break-word">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-10 h-5 transition-colors relative shrink-0 ${
          enabled ? "bg-neutral-900 dark:bg-white" : "bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 transition-transform ${
            enabled ? "left-5 bg-white dark:bg-neutral-900" : "left-0.5 bg-white"
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { user, isLoading } = useAdminAuth();
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    newUserAlerts: true,
    paymentAlerts: true,
    weeklyReports: false,
    maintenanceMode: false,
    registrationEnabled: true,
    trialDays: 7,
    requireEmailVerification: true,
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key: keyof typeof settings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      <AdminSidebar activePage="settings" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
        {/* Editorial Page Header */}
        <header className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Administration</p>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Settings</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Configure platform settings</p>
            </div>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </header>

        {saved && (
          <motion.div
            className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 mb-6 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Settings saved successfully!
          </motion.div>
        )}

        <div className="grid gap-4 max-w-3xl">
          {/* Notifications */}
          <SettingsSection
            title="Notifications"
            description="Configure how you receive alerts"
            icon={Bell}
          >
            <ToggleSetting
              label="Email Notifications"
              description="Receive important updates via email"
              enabled={settings.emailNotifications}
              onChange={(v) => updateSetting("emailNotifications", v)}
            />
            <ToggleSetting
              label="New User Alerts"
              description="Get notified when new users register"
              enabled={settings.newUserAlerts}
              onChange={(v) => updateSetting("newUserAlerts", v)}
            />
            <ToggleSetting
              label="Payment Alerts"
              description="Get notified about payments and subscriptions"
              enabled={settings.paymentAlerts}
              onChange={(v) => updateSetting("paymentAlerts", v)}
            />
            <ToggleSetting
              label="Weekly Reports"
              description="Receive weekly summary reports"
              enabled={settings.weeklyReports}
              onChange={(v) => updateSetting("weeklyReports", v)}
            />
          </SettingsSection>

          {/* Security */}
          <SettingsSection
            title="Security"
            description="Platform security settings"
            icon={Shield}
          >
            <ToggleSetting
              label="Require Email Verification"
              description="Users must verify email before accessing dashboard"
              enabled={settings.requireEmailVerification}
              onChange={(v) => updateSetting("requireEmailVerification", v)}
            />
            <ToggleSetting
              label="Maintenance Mode"
              description="Temporarily disable access for non-admin users"
              enabled={settings.maintenanceMode}
              onChange={(v) => updateSetting("maintenanceMode", v)}
            />
          </SettingsSection>

          {/* Registration */}
          <SettingsSection
            title="Registration"
            description="Control user registration settings"
            icon={Globe}
          >
            <ToggleSetting
              label="Registration Enabled"
              description="Allow new users to register"
              enabled={settings.registrationEnabled}
              onChange={(v) => updateSetting("registrationEnabled", v)}
            />
            <div className="py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-900 dark:text-white">Trial Duration</p>
                  <p className="text-[10px] text-neutral-500">Number of days for free trial</p>
                </div>
                <select
                  value={settings.trialDays}
                  onChange={(e) => updateSetting("trialDays", Number(e.target.value))}
                  className="bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-1.5 px-2.5 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* API Keys */}
          <SettingsSection
            title="API Configuration"
            description="Manage external service integrations"
            icon={Key}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Stripe Secret Key
                </label>
                <input
                  type="password"
                  value="sk_live_••••••••••••••••"
                  disabled
                  className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-1.5 px-2.5 text-neutral-500 text-xs"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Configured via environment variables
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  SMTP Server
                </label>
                <input
                  type="text"
                  value="smtp.example.com"
                  disabled
                  className="w-full bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-1.5 px-2.5 text-neutral-500 text-xs"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Configured via environment variables
                </p>
              </div>
            </div>
          </SettingsSection>
        </div>
        </div>
      </main>
    </div>
  );
}
