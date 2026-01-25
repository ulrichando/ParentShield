"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Monitor,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  Smartphone,
  Laptop,
  Apple,
  Chrome,
  Activity,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface DownloadItem {
  id: string;
  user_id: string | null;
  user_email: string | null;
  download_token: string;
  platform: string;
  app_version: string;
  source: string;
  ip_address: string | null;
  created_at: string;
}

interface InstallationItem {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  device_id: string;
  device_name: string | null;
  platform: string;
  os_version: string | null;
  app_version: string;
  status: string;
  is_blocked: boolean;
  blocked_reason: string | null;
  last_seen: string;
  created_at: string;
}

interface DownloadStats {
  total_downloads: number;
  total_installations: number;
  active_installations: number;
  recent_downloads_30d: number;
  conversion_rate: number;
  downloads_by_platform: Record<string, number>;
  installations_by_platform: Record<string, number>;
}

const platformIcons: Record<string, React.ReactNode> = {
  windows: <Laptop className="w-4 h-4" />,
  macos: <Apple className="w-4 h-4" />,
  linux: <Monitor className="w-4 h-4" />,
  android: <Smartphone className="w-4 h-4" />,
  ios: <Apple className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400",
  inactive: "bg-yellow-500/20 text-yellow-400",
  pending: "bg-blue-500/20 text-blue-400",
  uninstalled: "bg-red-500/20 text-red-400",
};

export default function AdminDevicesPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"installations" | "downloads">("installations");
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [installations, setInstallations] = useState<InstallationItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [platformFilter, setPlatformFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const fetchStats = async () => {
      try {
        const res = await authFetch("/api/admin/stats/downloads");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, [isLoading, authFetch]);

  useEffect(() => {
    if (isLoading) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "20",
        });
        if (platformFilter) {
          params.append("platform", platformFilter);
        }
        if (statusFilter && activeTab === "installations") {
          params.append("status", statusFilter);
        }

        const endpoint = activeTab === "installations"
          ? `/api/admin/api/installations?${params}`
          : `/api/admin/api/downloads?${params}`;

        const res = await authFetch(endpoint);
        if (!res.ok) throw new Error(`Failed to fetch ${activeTab}`);

        const data = await res.json();
        if (activeTab === "installations") {
          setInstallations(data.installations);
        } else {
          setDownloads(data.downloads);
        }
        setTotalPages(data.total_pages);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to load ${activeTab}`);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [isLoading, authFetch, page, activeTab, platformFilter, statusFilter]);

  const handleTabChange = (tab: "installations" | "downloads") => {
    setActiveTab(tab);
    setPage(1);
    setPlatformFilter("");
    setStatusFilter("");
  };

  const handleToggleBlock = async (installation: InstallationItem) => {
    setActionLoading(installation.id);
    try {
      const endpoint = installation.is_blocked
        ? `/api/admin/api/installations/${installation.id}/unblock`
        : `/api/admin/api/installations/${installation.id}/block?reason=Subscription%20required`;

      const res = await authFetch(endpoint, { method: "PUT" });
      if (res.ok) {
        // Update local state
        setInstallations(prev =>
          prev.map(i =>
            i.id === installation.id
              ? { ...i, is_blocked: !i.is_blocked, blocked_reason: i.is_blocked ? null : "Subscription required" }
              : i
          )
        );
      } else {
        setError("Failed to update installation");
      }
    } catch (err) {
      setError("Failed to update installation");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <AdminSidebar activePage="devices" user={user} />

      <main className="lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Devices & Downloads</h1>
            <p className="text-gray-400">Monitor app downloads and installations</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-card rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm">Total Downloads</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total_downloads.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.recent_downloads_30d} in last 30 days</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface-card rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm">Total Installations</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total_installations.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-card rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-gray-400 text-sm">Active Devices</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.active_installations.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Active in last 7 days</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface-card rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Chrome className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-gray-400 text-sm">Conversion Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.conversion_rate}%</p>
              <p className="text-xs text-gray-500 mt-1">Downloads to installs</p>
            </motion.div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTabChange("installations")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "installations"
                ? "bg-primary-500 text-white"
                : "bg-surface-card text-gray-400 hover:text-white"
            }`}
          >
            <Monitor className="w-4 h-4 inline mr-2" />
            Installations
          </button>
          <button
            onClick={() => handleTabChange("downloads")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "downloads"
                ? "bg-primary-500 text-white"
                : "bg-surface-card text-gray-400 hover:text-white"
            }`}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Downloads
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={platformFilter}
            onChange={(e) => { setPlatformFilter(e.target.value); setPage(1); }}
            className="bg-surface-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="">All Platforms</option>
            <option value="windows">Windows</option>
            <option value="macos">macOS</option>
            <option value="linux">Linux</option>
            <option value="android">Android</option>
            <option value="ios">iOS</option>
          </select>
          {activeTab === "installations" && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-surface-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="uninstalled">Uninstalled</option>
            </select>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          ) : activeTab === "installations" ? (
            installations.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No installations found</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Device</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">User</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Platform</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Version</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Last Seen</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installations.map((item) => (
                      <motion.tr
                        key={item.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-base flex items-center justify-center">
                              {platformIcons[item.platform] || <Monitor className="w-4 h-4 text-gray-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {item.device_name || "Unknown Device"}
                              </p>
                              <p className="text-xs text-gray-500">{item.device_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-white">{item.user_name || "—"}</p>
                          <p className="text-xs text-gray-500">{item.user_email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-white capitalize">{item.platform}</span>
                          {item.os_version && (
                            <p className="text-xs text-gray-500">{item.os_version}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-white">{item.app_version}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block w-fit ${statusColors[item.status] || "bg-gray-500/20 text-gray-400"}`}>
                              {item.status}
                            </span>
                            {item.is_blocked && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/20 text-red-400 inline-block w-fit">
                                BLOCKED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">
                            {new Date(item.last_seen).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant={item.is_blocked ? "success" : "destructive"}
                            size="sm"
                            onClick={() => handleToggleBlock(item)}
                            disabled={actionLoading === item.id}
                            className="flex items-center gap-1"
                          >
                            {actionLoading === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : item.is_blocked ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3" />
                                Block
                              </>
                            )}
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                  <p className="text-sm text-gray-400">
                    Showing {installations.length} of {total} installations
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
                    <span className="text-sm text-gray-400">
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
            )
          ) : downloads.length === 0 ? (
            <div className="text-center py-12">
              <Download className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No downloads found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Platform</th>
                    <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">User</th>
                    <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Version</th>
                    <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Source</th>
                    <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">IP Address</th>
                    <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((item) => (
                    <motion.tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-base flex items-center justify-center">
                            {platformIcons[item.platform] || <Monitor className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="text-sm text-white capitalize">{item.platform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white">
                          {item.user_email || <span className="text-gray-500">Anonymous</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white">{item.app_version}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 capitalize">
                          {item.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{item.ip_address || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                <p className="text-sm text-gray-400">
                  Showing {downloads.length} of {total} downloads
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
                  <span className="text-sm text-gray-400">
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
      </main>
    </div>
  );
}
