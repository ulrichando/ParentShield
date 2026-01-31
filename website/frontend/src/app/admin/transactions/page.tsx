"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Loader2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface TransactionData {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  invoice_url: string | null;
  created_at: string;
}

interface TransactionListResponse {
  transactions: TransactionData[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-purple-500/20 text-purple-400",
};

export default function AdminTransactionsPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
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

        const res = await authFetch(`/api/admin/transactions?${params}`);
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const json = await res.json();
        const data: TransactionListResponse = json.data;
        setTransactions(data.transactions);
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

  const handleExport = async () => {
    try {
      const res = await authFetch("/api/admin/transactions/export");

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      <AdminSidebar activePage="transactions" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
        {/* Editorial Page Header */}
        <header className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-2">Administration</p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Transactions</h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">View payment history</p>
            </div>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">No transactions found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Date</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Customer</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Description</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Amount</th>
                    <th className="text-left text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </span>
                        <p className="text-xs text-neutral-500">
                          {new Date(tx.created_at).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{tx.user_name || "No name"}</p>
                          <p className="text-xs text-neutral-500">{tx.user_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{tx.description || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          ${tx.amount.toFixed(2)} {tx.currency}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 capitalize ${statusColors[tx.status] || "bg-gray-500/20 text-gray-400"}`}>
                          {tx.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Showing {transactions.length} of {total} transactions
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
