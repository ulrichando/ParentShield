"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CreditCard, Bell, DollarSign, UserPlus, Loader2, Download, Monitor, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface DashboardStats {
  totalCustomers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalDownloads: number;
  totalInstallations: number;
  recentCustomers: number;
  conversionRate: number | string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}

function StatCard({ title, value, icon: Icon, color, loading }: StatCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4"
      whileHover={{ y: -2, boxShadow: "0 0 20px rgba(0, 0, 0, 0.08)" }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white dark:text-neutral-900" />
        </div>
      </div>
      {loading ? (
        <div className="h-7 flex items-center">
          <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />
        </div>
      ) : (
        <p className="text-xl font-bold text-neutral-900 dark:text-white mb-0.5">{value}</p>
      )}
      <p className="text-xs text-neutral-500">{title}</p>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (isLoading) return;

    const fetchStats = async () => {
      try {
        const res = await authFetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const json = await res.json();
        setStats(json.data);
      } catch (err) {
        setStatsError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [isLoading, authFetch]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      <AdminSidebar activePage="dashboard" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
        {/* Editorial Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Dashboard</p>
            <h1 className="text-2xl font-light text-neutral-900 dark:text-white mb-0.5">Admin Dashboard</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Overview of ParentShield platform</p>
          </div>
          <Button variant="secondary" size="sm">
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </Button>
        </div>

        {/* Stats Error */}
        {statsError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 mb-5 text-sm">
            {statsError}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers?.toLocaleString() || "0"}
            icon={Users}
            color="bg-neutral-900 dark:bg-white"
            loading={statsLoading}
          />
          <StatCard
            title="Active Subscriptions"
            value={stats?.activeSubscriptions?.toLocaleString() || "0"}
            icon={CreditCard}
            color="bg-neutral-900 dark:bg-white"
            loading={statsLoading}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
            icon={DollarSign}
            color="bg-neutral-900 dark:bg-white"
            loading={statsLoading}
          />
          <StatCard
            title="Recent Customers"
            value={stats?.recentCustomers?.toLocaleString() || "0"}
            icon={UserPlus}
            color="bg-neutral-900 dark:bg-white"
            loading={statsLoading}
          />
        </div>

        {/* Downloads & Installations Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <StatCard
            title="Total Downloads"
            value={stats?.totalDownloads?.toLocaleString() || "0"}
            icon={Download}
            color="bg-neutral-900 dark:bg-white"
            loading={statsLoading}
          />
          <StatCard
            title="Total Installations"
            value={stats?.totalInstallations?.toLocaleString() || "0"}
            icon={Monitor}
            color="bg-neutral-900 dark:bg-white"
            loading={statsLoading}
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats?.conversionRate || "0"}%`}
            icon={Activity}
            color="bg-neutral-900 dark:bg-white"
            loading={statsLoading}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Summary Cards */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Platform Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Customers</span>
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  {statsLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    stats?.totalCustomers?.toLocaleString() || "0"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Active Subscriptions</span>
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  {statsLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    stats?.activeSubscriptions?.toLocaleString() || "0"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Revenue</span>
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  {statsLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    `$${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Device Stats */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Device Statistics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Downloads</span>
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  {statsLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    stats?.totalDownloads?.toLocaleString() || "0"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Installations</span>
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  {statsLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    stats?.totalInstallations?.toLocaleString() || "0"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Conversion Rate</span>
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  {statsLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    `${stats?.conversionRate || "0"}%`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
