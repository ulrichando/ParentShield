"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  ExternalLink,
  RefreshCw,
  Zap,
  Ban,
  Trash2,
  AlertOctagon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SubscriptionData {
  id: string;
  status: string;
  plan_name: string;
  amount: number;
  currency: string;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  created_at: string;
}

interface TransactionData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface PlanData {
  name: string;
  price: string;
  interval: string;
  features: string[];
  highlight?: boolean;
  isFree?: boolean;
}

const PLANS: PlanData[] = [
  {
    name: "Free Trial",
    price: "$0",
    interval: "7 days",
    isFree: true,
    features: [
      "All Pro features included",
      "Website blocking",
      "Game blocking",
      "Unlimited blocked items",
      "Web dashboard access",
      "Activity reports",
      "Schedules",
      "7-day trial period",
    ],
  },
  {
    name: "Basic",
    price: "$4.99",
    interval: "month",
    features: [
      "Website blocking only",
      "Up to 30 blocked items",
      "Basic tamper protection",
      "1 device",
      "No game blocking",
      "No web dashboard",
      "No activity reports",
      "No schedules",
    ],
  },
  {
    name: "Pro",
    price: "$9.99",
    interval: "month",
    highlight: true,
    features: [
      "Website blocking",
      "Game blocking",
      "Unlimited blocked items",
      "Web dashboard",
      "Activity reports",
      "Schedules",
      "Advanced tamper protection",
      "Up to 5 devices",
    ],
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function getStatusConfig(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", label: "Active" };
    case "trialing":
      return { icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", label: "Free Trial" };
    case "past_due":
      return { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Past Due" };
    case "canceled":
      return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Canceled" };
    case "incomplete":
      return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Expired" };
    default:
      return { icon: CreditCard, color: "text-neutral-500 dark:text-neutral-400", bg: "bg-gray-500/10", label: status };
  }
}

export default function BillingPage() {
  const { isLoading: authLoading, logout } = useCustomerAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const hasFetched = useRef(false);

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [subRes, txRes] = await Promise.allSettled([
        fetch(`${API_URL}/account/subscription/details`, { headers }),
        fetch(`${API_URL}/account/transactions/list?limit=10`, { headers }),
      ]);

      if (subRes.status === "fulfilled" && subRes.value.ok) {
        const data = await subRes.value.json();
        if (data) setSubscription(data);
      }

      if (txRes.status === "fulfilled" && txRes.value.ok) {
        const data = await txRes.value.json();
        if (Array.isArray(data)) setTransactions(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load billing data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/account/subscription/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setShowCancelModal(false);
        hasFetched.current = false;
        fetchData();
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to cancel subscription");
      }
    } catch (err) {
      setError("Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseAccount = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/account/close`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setShowCloseAccountModal(false);
        logout();
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to close account");
      }
    } catch (err) {
      setError("Failed to close account");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !hasFetched.current) {
      hasFetched.current = true;
      fetchData();
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

  const statusConfig = subscription ? getStatusConfig(subscription.status) : null;
  const daysRemaining = subscription?.current_period_end
    ? getDaysRemaining(subscription.current_period_end)
    : null;

  return (
    <DashboardLayout>
      {/* Editorial Page Header */}
      <motion.div
        className="mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase mb-2">
          Account
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Subscription & Billing
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          Manage your subscription and view billing history.
        </p>
      </motion.div>

      {/* Actions Bar */}
      <motion.div
        className="flex justify-end mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            hasFetched.current = false;
            fetchData();
          }}
          disabled={isLoading}
          className="rounded-none"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-neutral-900 dark:text-white animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current Subscription */}
          <motion.div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Current Subscription</h2>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${statusConfig?.bg || "bg-blue-500/10"}`}>
                    {statusConfig ? <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} /> : <Clock className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{subscription?.plan_name || "Free Trial"}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 ${statusConfig?.bg || "bg-blue-500/10"} ${statusConfig?.color || "text-blue-400"}`}>
                        {statusConfig?.label || "Free Trial"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">
                    {subscription && subscription.amount > 0
                      ? `$${subscription.amount.toFixed(2)}`
                      : "Free"}
                  </p>
                  {subscription && subscription.amount > 0 && (
                    <p className="text-xs text-neutral-500">per month</p>
                  )}
                </div>
              </div>

              {/* Trial countdown */}
              {(!subscription || subscription.status?.toLowerCase() === "trialing") && (
                <div className="bg-blue-500/5 border border-blue-500/20 p-4">
                  {/* Trial not started yet - show install message */}
                  {subscription && !subscription.current_period_start ? (
                    <>
                      <p className="text-sm text-blue-300 mb-3 text-center">
                        Your 7-day free trial will start when you install the app.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center">
                          <div className="bg-blue-500/20 px-4 py-2 min-w-15">
                            <p className="text-2xl font-bold text-blue-400">7</p>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">Days</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-500/20 px-4 py-2 min-w-15">
                            <p className="text-2xl font-bold text-blue-400">0</p>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">Hours</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-500/20 px-4 py-2 min-w-15">
                            <p className="text-2xl font-bold text-blue-400">0</p>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">Minutes</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-3 text-center">
                        Download and log in to the ParentShield app to start your trial.
                      </p>
                    </>
                  ) : (daysRemaining !== null && daysRemaining > 0) || !subscription ? (
                    <>
                      <p className="text-sm text-blue-300 mb-3">
                        You&apos;re on a 7-day free trial with access to all features.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center">
                          <div className="bg-blue-500/20 px-4 py-2 min-w-15">
                            <p className="text-2xl font-bold text-blue-400">{daysRemaining ?? 7}</p>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">Days</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-500/20 px-4 py-2 min-w-15">
                            <p className="text-2xl font-bold text-blue-400">0</p>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">Hours</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-500/20 px-4 py-2 min-w-15">
                            <p className="text-2xl font-bold text-blue-400">0</p>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">Minutes</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-red-400 text-center">Your trial has expired.</p>
                  )}
                </div>
              )}

              {subscription && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  {subscription.current_period_start && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Period Start</p>
                      <p className="text-sm text-neutral-900 dark:text-white">{formatDate(subscription.current_period_start)}</p>
                    </div>
                  )}
                  {subscription.current_period_end && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">
                        {subscription.status?.toLowerCase() === "trialing" ? "Trial Ends" : "Next Billing"}
                      </p>
                      <p className="text-sm text-neutral-900 dark:text-white">{formatDate(subscription.current_period_end)}</p>
                    </div>
                  )}
                  {daysRemaining !== null && subscription.status?.toLowerCase() !== "trialing" && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Days Remaining</p>
                      <p className={`text-sm font-medium ${daysRemaining <= 3 ? "text-red-400" : "text-neutral-900 dark:text-white"}`}>
                        {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {subscription?.canceled_at && (
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500">Canceled on {formatDate(subscription.canceled_at)}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upgrade/Change Plan */}
          {(!subscription || ["trialing", "canceled", "incomplete"].includes(subscription.status?.toLowerCase() || "")) && (
            <motion.div
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {subscription?.status?.toLowerCase() === "trialing" ? "Upgrade Your Plan" : "Choose a Plan"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {PLANS.map((plan) => {
                  // Determine if this plan matches the user's current subscription
                  // Default to Free Trial if no subscription exists (all users start with trial)
                  const planName = subscription?.plan_name?.toLowerCase() || "free trial";
                  const status = subscription?.status?.toLowerCase() || "trialing";
                  const isCurrentPlan = plan.isFree
                    ? planName === "free trial" || status === "trialing"
                    : plan.name === "Basic"
                    ? planName === "basic"
                    : planName === "pro" || planName === "premium monthly" || planName === "premium yearly";
                  const isLimitedFeature = (feature: string) => feature.startsWith("No ");
                  return (
                    <div
                      key={plan.name}
                      className={`flex flex-col border p-4 ${
                        isCurrentPlan
                          ? "border-blue-500/50 bg-blue-500/5"
                          : plan.highlight
                          ? "border-neutral-900 dark:border-white bg-[#FAFAFA] dark:bg-neutral-800"
                          : "border-neutral-200 dark:border-neutral-700 bg-[#FAFAFA] dark:bg-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{plan.name}</h3>
                        {isCurrentPlan && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5">
                            Current Plan
                          </span>
                        )}
                        {plan.highlight && !isCurrentPlan && (
                          <span className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                        {plan.price}
                        <span className="text-sm font-normal text-neutral-500">/{plan.interval}</span>
                      </p>
                      <ul className="space-y-2 grow">
                        {plan.features.map((feature) => (
                          <li key={feature} className={`flex items-center gap-2 text-sm ${isLimitedFeature(feature) ? "text-neutral-500" : "text-neutral-600 dark:text-neutral-300"}`}>
                            {isLimitedFeature(feature) ? (
                              <XCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            )}
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        {plan.isFree ? (
                          isCurrentPlan ? (
                            <Button
                              className={`w-full shadow-none cursor-default rounded-none ${
                                subscription?.status?.toLowerCase() === "canceled"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-green-500/20 text-green-400 border border-green-500/30"
                              }`}
                              size="sm"
                              disabled
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              {subscription?.status?.toLowerCase() === "canceled"
                                ? "Trial Canceled"
                                : "Current"}
                            </Button>
                          ) : (
                            <Button
                              className="w-full shadow-none bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 cursor-default rounded-none"
                              size="sm"
                              disabled
                            >
                              Available for new accounts
                            </Button>
                          )
                        ) : isCurrentPlan ? (
                          <Button
                            className="w-full shadow-none bg-green-500/20 text-green-400 border border-green-500/30 cursor-default rounded-none"
                            size="sm"
                            disabled
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Current Plan
                          </Button>
                        ) : (
                          <Button
                            className={`w-full shadow-none rounded-none ${
                              plan.highlight
                                ? "bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900"
                                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700"
                            }`}
                            size="sm"
                            onClick={() => window.open("https://parentshield.app/pricing", "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Subscribe
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Billing History */}
          <motion.div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Billing History</h2>

            <div className="space-y-2">
              {/* Show Free Trial status - always show for trial or when no subscription (default trial) */}
              {(!subscription || subscription.status?.toLowerCase() === "trialing") && (
                <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-500/10">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {subscription?.current_period_start ? "Free Trial Activated" : "Free Trial"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {subscription?.current_period_start
                          ? formatDate(subscription.current_period_start)
                          : "Starts when you install the app"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">$0.00 USD</p>
                    <span className={`text-xs ${subscription?.current_period_start ? "text-blue-400" : "text-yellow-400"}`}>
                      {subscription?.current_period_start ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>
              )}

              {/* Show paid transactions */}
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center ${
                      tx.status === "succeeded" ? "bg-green-500/10" : "bg-yellow-500/10"
                    }`}>
                      <CreditCard className={`w-4 h-4 ${
                        tx.status === "succeeded" ? "text-green-400" : "text-yellow-400"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-900 dark:text-white">{tx.description || "Subscription payment"}</p>
                      <p className="text-xs text-neutral-500">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      ${tx.amount.toFixed(2)} {tx.currency.toUpperCase()}
                    </p>
                    <span className={`text-xs ${
                      tx.status === "succeeded" ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {tx.status === "succeeded" ? "Paid" : tx.status}
                    </span>
                  </div>
                </div>
              ))}

              {/* Show empty state only if not on trial and no transactions */}
              {transactions.length === 0 && subscription && subscription.status?.toLowerCase() !== "trialing" && (
                <div className="text-center py-6">
                  <Shield className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto mb-2" />
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">No transactions yet</p>
                  <p className="text-neutral-500 text-xs mt-1">
                    Your billing history will appear here after your first payment.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Account Management */}
          <motion.div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Account Management</h2>
            </div>

            <div className="space-y-4">
              {/* Cancel Subscription */}
              {subscription && subscription.status?.toLowerCase() !== "canceled" && (
                <div className="flex items-center justify-between p-4 bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Cancel Subscription</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {subscription.status?.toLowerCase() === "trialing"
                        ? "End your free trial early. You will lose access to all features."
                        : "Your subscription will remain active until the end of the billing period."}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-none"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <Ban className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}

              {/* Close Account */}
              <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">Close Account</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Permanently close your account. This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30 rounded-none"
                  onClick={() => setShowCloseAccountModal(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Close Account
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Cancel Subscription</h3>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
              Are you sure you want to cancel your subscription?
              {subscription?.status?.toLowerCase() === "trialing"
                ? " Your free trial will end immediately and you will lose access to all features."
                : " You will continue to have access until the end of your current billing period."}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="rounded-none"
              >
                Keep Subscription
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30 rounded-none"
                onClick={handleCancelSubscription}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                Yes, Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Close Account Modal */}
      {showCloseAccountModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Close Account</h3>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
              Are you sure you want to permanently close your account?
            </p>
            <ul className="text-sm text-neutral-500 mb-6 space-y-1">
              <li className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                All your data will be lost
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                Any active subscription will be canceled
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                You will be logged out immediately
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                This action cannot be undone
              </li>
            </ul>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCloseAccountModal(false)}
                disabled={actionLoading}
                className="rounded-none"
              >
                Keep Account
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30 rounded-none"
                onClick={handleCloseAccount}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Yes, Close Account
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
