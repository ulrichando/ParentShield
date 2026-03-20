"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens, refreshTokens, TOKEN_KEYS } from "@/lib/auth-client";

interface UserData {
  email: string;
  role: string;
  firstName?: string;
}

export function useCustomerAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const logout = useCallback(() => {
    clearTokens();
    router.push("/login");
  }, [router]);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        logout();
        throw new Error("No access token");
      }

      const res = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
      });

      if (res.status === 401) {
        const newToken = await refreshTokens();
        if (newToken) {
          setToken(newToken);
          return fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
          });
        }
        logout();
        throw new Error("Session expired. Please login again.");
      }

      return res;
    },
    [logout]
  );

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.push("/login");
      return;
    }

    setToken(accessToken);

    fetch("/api/account/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Profile fetch failed");
      })
      .then(({ data: profile }) => {
        localStorage.setItem(TOKEN_KEYS.email, profile.email);
        localStorage.setItem(TOKEN_KEYS.role, profile.role);
        localStorage.setItem(TOKEN_KEYS.name, profile.firstName || "User");
        setUser({ email: profile.email, role: profile.role, firstName: profile.firstName || "User" });
      })
      .catch(() => {
        setUser({
          email: localStorage.getItem(TOKEN_KEYS.email) || "",
          role: localStorage.getItem(TOKEN_KEYS.role) || "customer",
          firstName: localStorage.getItem(TOKEN_KEYS.name) || "User",
        });
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  return { user, isLoading, token, router, authFetch, logout };
}
