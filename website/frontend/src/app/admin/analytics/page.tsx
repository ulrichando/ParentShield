"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2, TrendingUp, Users, DollarSign } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface DashboardStats {
  total_customers: number;
  active_subscriptions: number;
  revenue_today: number;
  revenue_this_month: number;
  revenue_total: number;
  new_customers_today: number;
  new_customers_this_month: number;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4"
      whileHover={{ y: -2, boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-xl font-bold text-neutral-900 dark:text-white mb-0.5">{value}</p>
      <p className="text-xs text-neutral-500">{title}</p>
    </motion.div>
  );
}

function SimpleBarChart({ data, label }: { data: ChartDataPoint[]; label: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-neutral-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value ?? 0), 1);

  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-full gap-1">
        {data.slice(-30).map((point, i) => {
          const value = point.value ?? 0;
          const height = (value / maxValue) * 100;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end group"
            >
              <div className="relative w-full">
                <motion.div
                  className="w-full bg-neutral-900 dark:bg-white min-h-0.5"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 2)}%` }}
                  transition={{ delay: i * 0.02 }}
                  style={{ maxHeight: "100%" }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#FAFAFA] dark:bg-neutral-800 px-2 py-1 text-xs text-neutral-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {label === "Revenue" ? `$${value.toFixed(2)}` : value}
                  <br />
                  <span className="text-neutral-500 dark:text-neutral-400">{new Date(point.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [customerData, setCustomerData] = useState<ChartDataPoint[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (isLoading) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [statsRes, revenueRes, customersRes] = await Promise.all([
          authFetch("/api/admin/stats"),
          authFetch(`/api/admin/stats/revenue?days=${days}`),
          authFetch(`/api/admin/stats/customers?days=${days}`),
        ]);

        if (!statsRes.ok || !revenueRes.ok || !customersRes.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const [statsData, revenueRaw, customersRaw] = await Promise.all([
          statsRes.json(),
          revenueRes.json(),
          customersRes.json(),
        ]);

        setStats(statsData);
        setRevenueData(revenueRaw || []);
        setCustomerData(customersRaw || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [isLoading, authFetch, days]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      <AdminSidebar activePage="analytics" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
        {/* Editorial Page Header */}
        <header className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase mb-2">Admin Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2">Analytics</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Platform insights and metrics</p>
        </header>

        <div className="flex items-center justify-end mb-5">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-2 px-4 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <StatCard
                title="Total Revenue"
                value={`$${stats?.revenue_total.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`}
                icon={DollarSign}
                color="bg-green-500"
              />
              <StatCard
                title="Monthly Revenue"
                value={`$${stats?.revenue_this_month.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`}
                icon={TrendingUp}
                color="bg-blue-500"
              />
              <StatCard
                title="Total Customers"
                value={stats?.total_customers.toLocaleString() || "0"}
                icon={Users}
                color="bg-purple-500"
              />
              <StatCard
                title="Active Subscriptions"
                value={stats?.active_subscriptions.toLocaleString() || "0"}
                icon={Activity}
                color="bg-orange-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Chart */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Revenue Over Time</h2>
                <SimpleBarChart data={revenueData} label="Revenue" />
                <p className="text-xs text-neutral-500 mt-4 text-center">
                  Showing last {days} days
                </p>
              </div>

              {/* Customer Growth Chart */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Customer Growth</h2>
                <SimpleBarChart data={customerData} label="Customers" />
                <p className="text-xs text-neutral-500 mt-4 text-center">
                  Showing last {days} days
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Revenue Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">Today</span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      ${stats?.revenue_today.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">This Month</span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      ${stats?.revenue_this_month.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-neutral-500 dark:text-neutral-400">All Time</span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      ${stats?.revenue_total.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Customer Metrics</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">New Today</span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {stats?.new_customers_today || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">New This Month</span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {stats?.new_customers_this_month || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-neutral-500 dark:text-neutral-400">Total Customers</span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {stats?.total_customers || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </main>
    </div>
  );
}
