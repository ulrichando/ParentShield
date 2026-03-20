/**
 * Admin Account API Service
 * Handles all admin dashboard API operations.
 */

import { apiGet, apiPut, buildQueryString } from "./api-client";

// ============================================================================
// Types
// ============================================================================

export interface DashboardStats {
  totalCustomers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalDownloads: number;
  totalInstallations: number;
  recentCustomers: number;
  conversionRate: number | string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  status: "active" | "canceled" | "expired" | "past_due" | "trialing";
  plan: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
}

export interface CustomerWithSubscription {
  user: User;
  subscription: { plan: string; status: string } | null;
  totalSpent: number;
}

export interface Download {
  id: string;
  userId: string | null;
  downloadToken: string;
  platform: string;
  version: string | null;
  source: string;
  ipAddress: string | null;
  createdAt: string;
}

export interface Installation {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  osVersion: string | null;
  appVersion: string | null;
  status: string;
  isBlocked: boolean;
  blockedReason: string | null;
  lastSeen: string | null;
  createdAt: string;
}

export interface CustomerListResponse {
  customers: CustomerWithSubscription[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DownloadListResponse {
  downloads: Download[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface InstallationListResponse {
  installations: Installation[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// Dashboard Stats API
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>("/admin/stats");
}

export async function getRevenueChart(days: number = 30): Promise<ChartDataPoint[]> {
  return apiGet<ChartDataPoint[]>(`/admin/stats/revenue?days=${days}`);
}

export async function getCustomerChart(days: number = 30): Promise<ChartDataPoint[]> {
  return apiGet<ChartDataPoint[]>(`/admin/stats/customers?days=${days}`);
}

// ============================================================================
// Customer Management API
// ============================================================================

export interface CustomerListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export async function listCustomers(
  params: CustomerListParams = {}
): Promise<CustomerListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    search: params.search,
  });
  return apiGet<CustomerListResponse>(`/admin/customers${query}`);
}

// ============================================================================
// Subscription Management API
// ============================================================================

export interface SubscriptionListParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export async function listSubscriptions(
  params: SubscriptionListParams = {}
): Promise<SubscriptionListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    status: params.status,
  });
  return apiGet<SubscriptionListResponse>(`/admin/subscriptions${query}`);
}

// ============================================================================
// Transaction Management API
// ============================================================================

export interface TransactionListParams {
  page?: number;
  per_page?: number;
}

export async function listTransactions(
  params: TransactionListParams = {}
): Promise<TransactionListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
  });
  return apiGet<TransactionListResponse>(`/admin/transactions${query}`);
}

// ============================================================================
// Download Management API
// ============================================================================

export interface DownloadListParams {
  page?: number;
  per_page?: number;
  platform?: string;
}

export async function listDownloads(
  params: DownloadListParams = {}
): Promise<DownloadListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    platform: params.platform,
  });
  return apiGet<DownloadListResponse>(`/admin/downloads${query}`);
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

export async function listInstallations(
  params: InstallationListParams = {}
): Promise<InstallationListResponse> {
  const query = buildQueryString({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    status: params.status,
    platform: params.platform,
  });
  return apiGet<InstallationListResponse>(`/admin/installations${query}`);
}

// ============================================================================
// Export all functions as a service object
// ============================================================================

export const adminApi = {
  getDashboardStats,
  getRevenueChart,
  getCustomerChart,
  listCustomers,
  listSubscriptions,
  listTransactions,
  listDownloads,
  listInstallations,
};

export default adminApi;
