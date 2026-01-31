"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface CustomerUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

interface CustomerWithSubscription {
  user: CustomerUser;
  subscription: {
    plan_name: string;
    status: string;
  } | null;
  total_spent: number;
}

interface CustomerListResponse {
  customers: CustomerWithSubscription[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export default function AdminUsersPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [customers, setCustomers] = useState<CustomerWithSubscription[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    const fetchCustomers = async () => {
      setCustomersLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "20",
        });
        if (search) {
          params.append("search", search);
        }

        const res = await authFetch(`/api/admin/customers?${params}`);
        if (!res.ok) throw new Error("Failed to fetch customers");

        const json = await res.json();
        const data: CustomerListResponse = json.data;
        setCustomers(data.customers);
        setTotalPages(data.total_pages);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setCustomersLoading(false);
      }
    };

    fetchCustomers();
  }, [isLoading, authFetch, page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
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
      <AdminSidebar activePage="users" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
        {/* Editorial Page Header */}
        <header className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-500 mb-2">Administration</p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1">Users</h1>
          <p className="text-base text-neutral-500 dark:text-neutral-400">Manage customer accounts</p>
        </header>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-2 pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            />
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 mb-5 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {customersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">No customers found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">User</th>
                    <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Subscription</th>
                    <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Total Spent</th>
                    <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <motion.tr
                      key={customer.user.id}
                      className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-medium text-xs">
                            {(customer.user.first_name || customer.user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-neutral-900 dark:text-white">
                              {customer.user.first_name || customer.user.last_name
                                ? `${customer.user.first_name || ""} ${customer.user.last_name || ""}`.trim()
                                : "No name"}
                            </p>
                            <p className="text-caption-2 text-neutral-500">{customer.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-caption-2 font-medium px-1.5 py-0.5 ${
                            customer.user.is_active
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : "bg-red-500/20 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {customer.user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {customer.subscription ? (
                          <span className="text-caption-2 font-medium px-1.5 py-0.5 bg-purple-500/20 text-purple-600 dark:text-purple-400">
                            {customer.subscription.plan_name}
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-xs">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-neutral-900 dark:text-white text-xs">
                          ${customer.total_spent.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                          {new Date(customer.user.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Showing {customers.length} of {total} customers
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Previous
                  </Button>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Page {page} of {totalPages || 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                  >
                    Next
                    <ChevronRight className="w-3 h-3" />
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
