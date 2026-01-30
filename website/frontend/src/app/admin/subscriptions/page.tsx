"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface SubscriptionData {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  status: string;
  plan_name: string;
  amount: number;
  currency: string;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  created_at: string;
}

interface SubscriptionListResponse {
  subscriptions: SubscriptionData[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-600 dark:text-green-400",
  canceled: "bg-red-500/20 text-red-600 dark:text-red-400",
  past_due: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  trialing: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  incomplete: "bg-gray-500/20 text-neutral-500 dark:text-neutral-400",
};

export default function AdminSubscriptionsPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (isLoading) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "20",
        });
        if (statusFilter) {
          params.append("status", statusFilter);
        }

        const res = await authFetch(`/api/admin/api/subscriptions?${params}`);
        if (!res.ok) throw new Error("Failed to fetch subscriptions");

        const data: SubscriptionListResponse = await res.json();
        setSubscriptions(data.subscriptions);
        setTotalPages(data.total_pages);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [isLoading, authFetch, page, statusFilter]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      <AdminSidebar activePage="subscriptions" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
        {/* Editorial Page Header */}
        <header className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase mb-2">Administration</p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">Subscriptions</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Manage customer subscriptions</p>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-2 px-4 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">No subscriptions found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Customer</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Plan</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Status</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Amount</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Period End</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <motion.tr
                      key={sub.id}
                      className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{sub.user_name || "No name"}</p>
                          <p className="text-xs text-neutral-500">{sub.user_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white">{sub.plan_name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 capitalize ${statusColors[sub.status] || "bg-gray-500/20 text-neutral-500 dark:text-neutral-400"}`}>
                          {sub.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          ${sub.amount.toFixed(2)} {sub.currency}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {sub.current_period_end
                            ? new Date(sub.current_period_end).toLocaleDateString()
                            : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Showing {subscriptions.length} of {total} subscriptions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Page {page} of {totalPages || 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
