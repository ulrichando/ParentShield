/**
 * Admin Account API Service
 * Handles all admin dashboard API operations.
 */

import { apiGet, apiPut, buildQueryString, API_URL } from "./api-client";

// ============================================================================
// Types
// ============================================================================

export interface DashboardStats {
  total_customers: number;
  active_subscriptions: number;
  monthly_revenue: number;
  total_revenue: number;
  new_customers_today: number;
  new_customers_this_week: number;
  churn_rate: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  status: "active" | "canceled" | "expired" | "past_due" | "trialing";
  plan_name: string;
  amount: number;
  currency: string;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  description: string | null;
  invoice_url: string | null;
  created_at: string;
}

export interface CustomerWithSubscription {
  user: User;
  subscription: Subscription | null;
  total_spent: number;
}

export interface Download {
  id: string;
  user_id: string | null;
  user_email: string | null;
  download_token: string;
  platform: string;
  app_version: string;
  source: string;
  ip_address: string;
  created_at: string;
}

export interface Installation {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  device_id: string;
  device_name: string;
  platform: string;
  os_version: string;
  app_version: string;
  status: "active" | "inactive" | "uninstalled";
  is_blocked: boolean;
  blocked_reason: string | null;
  last_seen: string;
  created_at: string;
}

export interface DownloadStats {
  total_downloads: number;
  total_installations: number;
  active_installations: number;
  recent_downloads_30d: number;
  conversion_rate: number;
  downloads_by_platform: Record<string, number>;
  installations_by_platform: Record<string, number>;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  items: T[];
}

export interface CustomerListResponse {
  customers: CustomerWithSubscription[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DownloadListResponse {
  downloads: Download[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface InstallationListResponse {
  installations: Installation[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// Dashboard Stats API
// ============================================================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>("/admin/stats");
}

/**
 * Get revenue chart data
 */
export async function getRevenueChart(days: number = 30): Promise<ChartDataPoint[]> {
  return apiGet<ChartDataPoint[]>(`/admin/stats/revenue?days=${days}`);
}

/**
 * Get customer growth chart data
 */
export async function getCustomerChart(days: number = 30): Promise<ChartDataPoint[]> {
  return apiGet<ChartDataPoint[]>(`/admin/stats/customers?days=${days}`);
}

/**
 * Get download and installation statistics
 */
export async function getDownloadStats(): Promise<DownloadStats> {
  return apiGet<DownloadStats>("/admin/stats/downloads");
}

// ============================================================================
// Customer Management API
// ============================================================================

export interface CustomerListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

/**
 * List all customers
 */
export async function listCustomers(
  params: CustomerListParams = {}
): Promise<CustomerListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    search: params.search,
  });
  return apiGet<CustomerListResponse>(`/admin/api/customers${query}`);
}

/**
 * Suspend a customer account
 */
export async function suspendCustomer(customerId: string): Promise<MessageResponse> {
  return apiPut<MessageResponse>(`/admin/customers/${customerId}/suspend`);
}

/**
 * Activate a customer account
 */
export async function activateCustomer(customerId: string): Promise<MessageResponse> {
  return apiPut<MessageResponse>(`/admin/customers/${customerId}/activate`);
}

// ============================================================================
// Subscription Management API
// ============================================================================

export interface SubscriptionListParams {
  page?: number;
  per_page?: number;
  status?: string;
}

/**
 * List all subscriptions
 */
export async function listSubscriptions(
  params: SubscriptionListParams = {}
): Promise<SubscriptionListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    status: params.status,
  });
  return apiGet<SubscriptionListResponse>(`/admin/api/subscriptions${query}`);
}

// ============================================================================
// Transaction Management API
// ============================================================================

export interface TransactionListParams {
  page?: number;
  per_page?: number;
  status?: string;
}

/**
 * List all transactions
 */
export async function listTransactions(
  params: TransactionListParams = {}
): Promise<TransactionListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    status: params.status,
  });
  return apiGet<TransactionListResponse>(`/admin/api/transactions${query}`);
}

/**
 * Get transaction export URL
 */
export function getTransactionExportUrl(): string {
  const token = localStorage.getItem("access_token");
  return `${API_URL}/admin/transactions/export?token=${token}`;
}

// ============================================================================
// Download Management API
// ============================================================================

export interface DownloadListParams {
  page?: number;
  per_page?: number;
  platform?: string;
}

/**
 * List all downloads
 */
export async function listDownloads(
  params: DownloadListParams = {}
): Promise<DownloadListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    platform: params.platform,
  });
  return apiGet<DownloadListResponse>(`/admin/api/downloads${query}`);
}

// ============================================================================
// Installation Management API
// ============================================================================

export interface InstallationListParams {
  page?: number;
  per_page?: number;
  status?: string;
  platform?: string;
}

/**
 * List all installations
 */
export async function listInstallations(
  params: InstallationListParams = {}
): Promise<InstallationListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    status: params.status,
    platform: params.platform,
  });
  return apiGet<InstallationListResponse>(`/admin/api/installations${query}`);
}

/**
 * Block an installation
 */
export async function blockInstallation(
  installationId: string,
  reason?: string
): Promise<MessageResponse> {
  const query = reason ? `?reason=${encodeURIComponent(reason)}` : "";
  return apiPut<MessageResponse>(`/admin/api/installations/${installationId}/block${query}`);
}

/**
 * Unblock an installation
 */
export async function unblockInstallation(installationId: string): Promise<MessageResponse> {
  return apiPut<MessageResponse>(`/admin/api/installations/${installationId}/unblock`);
}

// ============================================================================
// Export all functions as a service object
// ============================================================================

export const adminApi = {
  // Dashboard
  getDashboardStats,
  getRevenueChart,
  getCustomerChart,
  getDownloadStats,

  // Customers
  listCustomers,
  suspendCustomer,
  activateCustomer,

  // Subscriptions
  listSubscriptions,

  // Transactions
  listTransactions,
  getTransactionExportUrl,

  // Downloads
  listDownloads,

  // Installations
  listInstallations,
  blockInstallation,
  unblockInstallation,
};

export default adminApi;
