/**
 * Customer Account API Service
 * Handles all customer-facing API operations.
 */

import { apiGet, apiPut, apiDelete, buildQueryString } from "./api-client";

// ============================================================================
// Types
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface Subscription {
  id?: string;
  status: "active" | "canceled" | "expired" | "past_due" | "trialing" | "none";
  plan: string;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  canceledAt?: string | null;
  features?: Record<string, boolean | number>;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// Profile API
// ============================================================================

export async function getProfile(): Promise<UserProfile> {
  return apiGet<UserProfile>("/account/profile");
}

export async function updateProfile(data: ProfileUpdateData): Promise<UserProfile> {
  return apiPut<UserProfile>("/account/profile", data);
}

// ============================================================================
// Subscription API
// ============================================================================

export async function getSubscription(): Promise<Subscription> {
  return apiGet<Subscription>("/account/subscription");
}

export async function cancelSubscription(): Promise<MessageResponse> {
  return apiDelete<MessageResponse>("/account/subscription");
}

// ============================================================================
// Transactions API
// ============================================================================

export interface TransactionListParams {
  limit?: number;
}

export async function getTransactions(
  params: TransactionListParams = {}
): Promise<Transaction[]> {
  const query = buildQueryString({ limit: params.limit ?? 10 });
  return apiGet<Transaction[]>(`/account/transactions${query}`);
}

// ============================================================================
// Account Management API
// ============================================================================

export async function closeAccount(): Promise<MessageResponse> {
  return apiDelete<MessageResponse>("/account/close");
}

// ============================================================================
// Export all functions as a service object
// ============================================================================

export const customerApi = {
  getProfile,
  updateProfile,
  getSubscription,
  cancelSubscription,
  getTransactions,
  closeAccount,
};

export default customerApi;
