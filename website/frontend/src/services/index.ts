/**
 * API Services Index
 * Central export point for all API services.
 */

export * from "./api-client";
export * from "./customer-api";

// Admin types (excluding names that conflict with customer-api exports)
export type {
  DashboardStats,
  ChartDataPoint,
  User,
  CustomerWithSubscription,
  Download,
  Installation,
  CustomerListResponse,
  SubscriptionListResponse,
  TransactionListResponse,
  DownloadListResponse,
  InstallationListResponse,
  CustomerListParams,
  SubscriptionListParams,
  TransactionListParams,
  DownloadListParams,
  InstallationListParams,
} from "./admin-api";

// Admin functions
export {
  getDashboardStats,
  getRevenueChart,
  getCustomerChart,
  listCustomers,
  listSubscriptions,
  listTransactions,
  listDownloads,
  listInstallations,
  adminApi,
} from "./admin-api";

export { default as customerApi } from "./customer-api";
