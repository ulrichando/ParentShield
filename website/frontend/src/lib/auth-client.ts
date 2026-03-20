"use client";

/** Shared client-side token management utilities. Used by useCustomerAuth and useAdminAuth. */

export const TOKEN_KEYS = {
  access: "access_token",
  refresh: "refresh_token",
  role: "user_role",
  email: "user_email",
  name: "user_name",
} as const;

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.access);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.refresh);
}

export function setTokens(accessToken: string, refreshToken?: string | null): void {
  localStorage.setItem(TOKEN_KEYS.access, accessToken);
  if (refreshToken) localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
}

export function clearTokens(): void {
  Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
}

/**
 * Attempts to refresh the access token using the stored refresh token.
 * Returns the new access token on success, or null on failure.
 */
export async function refreshTokens(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}
