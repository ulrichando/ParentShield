/**
 * API Services Index
 * Central export point for all API services.
 */

export * from "./api-client";
export * from "./customer-api";

// Admin types (excluding MessageResponse to avoid conflict with customer-api)
export type {
  DashboardStats,
  ChartDataPoint,
  User,
  Subscription,
  Transaction,
  CustomerWithSubscription,
  Download,
  Installation,
  DownloadStats,
  PaginatedResponse,
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
  getDownloadStats,
  listCustomers,
  suspendCustomer,
  activateCustomer,
  listSubscriptions,
  listTransactions,
  getTransactionExportUrl,
  listDownloads,
  listInstallations,
  blockInstallation,
  unblockInstallation,
  adminApi,
} from "./admin-api";

export { default as customerApi } from "./customer-api";
