/**
 * Customer Account API Service
 * Handles all customer-facing API operations.
 */

import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from "./api-client";

// ============================================================================
// Types
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export interface Subscription {
  id: string;
  user_id: string;
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
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  description: string | null;
  invoice_url: string | null;
  created_at: string;
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// Profile API
// ============================================================================

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<UserProfile> {
  return apiGet<UserProfile>("/account/profile");
}

/**
 * Update the current user's profile
 */
export async function updateProfile(data: ProfileUpdateData): Promise<UserProfile> {
  return apiPut<UserProfile>("/account/profile", data);
}

/**
 * Change the current user's password
 */
export async function changePassword(data: PasswordChangeData): Promise<MessageResponse> {
  return apiPut<MessageResponse>("/account/password", data);
}

// ============================================================================
// Subscription API
// ============================================================================

/**
 * Get subscription details
 */
export async function getSubscription(): Promise<Subscription | null> {
  return apiGet<Subscription | null>("/account/subscription/details");
}

/**
 * Cancel the current subscription
 */
export async function cancelSubscription(): Promise<MessageResponse> {
  return apiPost<MessageResponse>("/account/subscription/cancel");
}

// ============================================================================
// Transactions API
// ============================================================================

export interface TransactionListParams {
  limit?: number;
  offset?: number;
}

/**
 * Get transaction history
 */
export async function getTransactions(
  params: TransactionListParams = {}
): Promise<Transaction[]> {
  const query = buildQueryString({
    limit: params.limit ?? 50,
    offset: params.offset ?? 0,
  });
  return apiGet<Transaction[]>(`/account/transactions/list${query}`);
}

// ============================================================================
// Account Management API
// ============================================================================

/**
 * Close the user account permanently
 */
export async function closeAccount(): Promise<MessageResponse> {
  return apiDelete<MessageResponse>("/account/close");
}

// ============================================================================
// Downloads API
// ============================================================================

export interface DownloadInfo {
  filename: string;
  display_name: string;
  size: string;
  requirements: string;
}

export type Platform = "windows" | "macos" | "linux-appimage" | "linux-deb";

/**
 * Get download URL for a platform (requires active subscription)
 */
export function getDownloadUrl(platform: Platform): string {
  const token = localStorage.getItem("access_token");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${API_URL}/account/download/${platform}?token=${token}`;
}

// ============================================================================
// Export all functions as a service object
// ============================================================================

export const customerApi = {
  // Profile
  getProfile,
  updateProfile,
  changePassword,

  // Subscription
  getSubscription,
  cancelSubscription,

  // Transactions
  getTransactions,

  // Account
  closeAccount,

  // Downloads
  getDownloadUrl,
};

export default customerApi;
