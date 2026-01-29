"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Key, Copy, Trash2, Loader2, Search, Eye, EyeOff, Check, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  user_email: string;
  plan: "basic" | "pro" | "enterprise";
  requests_limit: number;
  requests_used: number;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

const PLANS = [
  { value: "basic", label: "Basic", price: "$29/mo", limit: 1000 },
  { value: "pro", label: "Pro", price: "$99/mo", limit: 10000 },
  { value: "enterprise", label: "Enterprise", price: "$299/mo", limit: 100000 },
];

export default function AdminApiKeysPage() {
  const { user, isLoading, authFetch } = useAdminAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: "",
    user_email: "",
    plan: "basic" as "basic" | "pro" | "enterprise",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      fetchApiKeys();
    }
  }, [isLoading]);

  const fetchApiKeys = async () => {
    try {
      setKeysLoading(true);
      const res = await authFetch("/api/admin/api-keys");
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    } finally {
      setKeysLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const res = await authFetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKeyData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to create API key");
      }

      const data = await res.json();
      setNewKey(data.key);
      await fetchApiKeys();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) return;

    try {
      const res = await authFetch(`/api/admin/api-keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchApiKeys();
      }
    } catch (err) {
      console.error("Failed to revoke key:", err);
    }
  };

  const handleToggleActive = async (key: ApiKey) => {
    try {
      const res = await authFetch(`/api/admin/api-keys/${key.id}/toggle`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchApiKeys();
      }
    } catch (err) {
      console.error("Failed to toggle key:", err);
    }
  };

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = apiKeys.reduce((sum, key) => {
    const plan = PLANS.find(p => p.value === key.plan);
    return sum + (plan ? parseInt(plan.price.replace(/\D/g, "")) : 0);
  }, 0);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <AdminSidebar activePage="api-keys" user={user} />

      <main className="lg:ml-52 pt-14 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-white mb-0.5">API Keys Management</h1>
              <p className="text-sm text-gray-400">Manage paid API access for developers</p>
            </div>
            <Button size="sm" onClick={() => { setShowForm(true); setNewKey(null); }}>
              <Plus className="w-4 h-4 mr-1" />
              Create Key
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="bg-surface-card rounded-xl border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-primary-400" />
                <span className="text-xs text-gray-500">Total Keys</span>
              </div>
              <p className="text-xl font-bold text-white">{apiKeys.length}</p>
            </div>
            <div className="bg-surface-card rounded-xl border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <p className="text-xl font-bold text-green-400">{apiKeys.filter(k => k.is_active).length}</p>
            </div>
            <div className="bg-surface-card rounded-xl border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-500">Monthly Revenue</span>
              </div>
              <p className="text-xl font-bold text-purple-400">${totalRevenue}</p>
            </div>
            <div className="bg-surface-card rounded-xl border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-500">Total Requests</span>
              </div>
              <p className="text-xl font-bold text-blue-400">{apiKeys.reduce((sum, k) => sum + k.requests_used, 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-surface-card rounded-xl border border-white/5 p-4 mb-5">
            <h3 className="text-sm font-medium text-white mb-3">API Pricing Plans</h3>
            <div className="grid grid-cols-3 gap-4">
              {PLANS.map(plan => (
                <div key={plan.value} className="p-3 rounded-lg bg-surface-base border border-white/5">
                  <p className="font-medium text-white">{plan.label}</p>
                  <p className="text-lg font-bold text-primary-400">{plan.price}</p>
                  <p className="text-xs text-gray-500">{plan.limit.toLocaleString()} requests/month</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-surface-card border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Create Key Modal */}
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setShowForm(false); setNewKey(null); }}
            >
              <motion.div
                className="bg-surface-card rounded-xl border border-white/5 p-6 max-w-md w-full"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                {newKey ? (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white mb-2">API Key Created</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      Copy this key now. You won&apos;t be able to see it again.
                    </p>
                    <div className="bg-surface-base border border-white/10 rounded-lg p-3 flex items-center justify-between mb-4">
                      <code className="text-sm text-primary-400 font-mono">{newKey}</code>
                      <Button variant="ghost" size="sm" onClick={handleCopyKey}>
                        {copiedKey ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Button onClick={() => { setShowForm(false); setNewKey(null); }}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-white mb-4">Create API Key</h2>
                    <form onSubmit={handleCreateKey} className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Key Name</label>
                        <input
                          type="text"
                          value={newKeyData.name}
                          onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                          className="w-full bg-surface-base border border-white/10 rounded-lg py-2 px-3 text-sm text-white mt-1"
                          placeholder="My Integration"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">User Email</label>
                        <input
                          type="email"
                          value={newKeyData.user_email}
                          onChange={(e) => setNewKeyData({ ...newKeyData, user_email: e.target.value })}
                          className="w-full bg-surface-base border border-white/10 rounded-lg py-2 px-3 text-sm text-white mt-1"
                          placeholder="developer@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Plan</label>
                        <select
                          value={newKeyData.plan}
                          onChange={(e) => setNewKeyData({ ...newKeyData, plan: e.target.value as "basic" | "pro" | "enterprise" })}
                          className="w-full bg-surface-base border border-white/10 rounded-lg py-2 px-3 text-sm text-white mt-1"
                        >
                          {PLANS.map(plan => (
                            <option key={plan.value} value={plan.value}>
                              {plan.label} - {plan.price} ({plan.limit.toLocaleString()} req/mo)
                            </option>
                          ))}
                        </select>
                      </div>
                      {formError && (
                        <p className="text-sm text-red-400">{formError}</p>
                      )}
                      <div className="flex gap-2">
                        <Button type="submit" disabled={formLoading}>
                          {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Key"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Keys List */}
          {keysLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="bg-surface-card rounded-xl border border-white/5 p-8 text-center">
              <Key className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No API keys yet</p>
              <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                Create First Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredKeys.map((key) => (
                <motion.div
                  key={key.id}
                  className="bg-surface-card rounded-xl border border-white/5 p-4"
                  whileHover={{ borderColor: "rgba(6, 182, 212, 0.3)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{key.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          key.plan === "enterprise" ? "bg-purple-500/20 text-purple-400" :
                          key.plan === "pro" ? "bg-blue-500/20 text-blue-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {key.plan.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${key.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {key.is_active ? "Active" : "Revoked"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <code className="text-xs font-mono text-gray-500">{key.key_prefix}...</code>
                        <span>{key.user_email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Usage: {key.requests_used.toLocaleString()} / {key.requests_limit.toLocaleString()}</span>
                        <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                        {key.last_used_at && (
                          <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      {/* Usage bar */}
                      <div className="mt-2 h-1.5 bg-surface-base rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            key.requests_used / key.requests_limit > 0.9 ? "bg-red-500" :
                            key.requests_used / key.requests_limit > 0.7 ? "bg-yellow-500" :
                            "bg-primary-500"
                          }`}
                          style={{ width: `${Math.min(100, (key.requests_used / key.requests_limit) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(key)}
                        title={key.is_active ? "Disable" : "Enable"}
                      >
                        {key.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRevokeKey(key.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
