"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  email: string;
  role: string;
  first_name?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useCustomerAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    router.push("/login");
  }, [router]);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      logout();
      throw new Error("No access token");
    }

    // Use full API URL for backend requests
    const fullUrl = url.startsWith("/api") ? `${API_URL}${url.replace("/api", "")}` : url;

    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.access_token);
            if (data.refresh_token) {
              localStorage.setItem("refresh_token", data.refresh_token);
            }
            setToken(data.access_token);

            return fetch(fullUrl, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${data.access_token}`,
              },
            });
          }
        } catch {
          // Refresh failed
        }
      }

      logout();
      throw new Error("Session expired. Please login again.");
    }

    return res;
  }, [logout]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    setToken(accessToken);
    setUser({
      email: localStorage.getItem("user_email") || "user@example.com",
      role: localStorage.getItem("user_role") || "customer",
      first_name: localStorage.getItem("user_name") || "User",
    });
    setIsLoading(false);
  }, [router]);

  return { user, isLoading, token, router, authFetch, logout };
}
