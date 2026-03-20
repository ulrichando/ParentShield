// API Service for communicating with ParentShield website backend

const API_URL = import.meta.env.VITE_API_URL ?? "https://parentshield.app";

interface InstallationRegisterRequest {
  deviceId: string;
  deviceName: string;
  platform: string;
  osVersion?: string;
  appVersion: string;
}

interface InstallationRegisterResponse {
  data: {
    id: string;
    deviceId: string;
    deviceName: string;
    platform: string;
    status: string;
    deviceSecret?: string; // Only present on first registration
  };
}

interface HeartbeatResponse {
  status: string;
  isBlocked: boolean;
  blockedReason: string | null;
}

interface LicenseCheckResponse {
  valid: boolean;
  plan: string;
  status: string;
  is_locked: boolean;
  expires_at: string | null;
  features: Record<string, unknown>;
  message: string | null;
  upgrade_url: string | null;
}

interface ActivationCodeResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  user_email?: string;
  plan?: string;
  error?: string;
}

// Generate a cryptographically random device ID, persisted in localStorage.
function getDeviceId(): string {
  const stored = localStorage.getItem("device_id");
  if (stored) return stored;
  const id = `ps_${crypto.randomUUID()}`;
  localStorage.setItem("device_id", id);
  return id;
}

function getPlatform(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";
  if (userAgent.includes("android")) return "android";
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "ios";
  return "linux"; // Default for Tauri on Linux
}

function getOsVersion(): string {
  const userAgent = navigator.userAgent;
  const match = userAgent.match(/\(([^)]+)\)/);
  return match ? match[1].split(";")[0].trim() : "Unknown";
}

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private deviceId: string;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private onSessionExpiredCallback: (() => void) | null = null;

  constructor() {
    this.deviceId = getDeviceId();
    this.loadTokens();
  }

  // Allow components to subscribe to session expiration events
  onSessionExpired(callback: () => void) {
    this.onSessionExpiredCallback = callback;
  }

  private loadTokens() {
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
  }

  private saveTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem("refresh_token", refreshToken);
    }
  }

  private getDeviceSecret(): string | null {
    return localStorage.getItem("device_secret");
  }

  private saveDeviceSecret(secret: string) {
    localStorage.setItem("device_secret", secret);
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      this.saveTokens(data.data.accessToken, data.data.refreshToken);

      // Register installation after login
      await this.registerInstallation();

      // Start heartbeat
      this.startHeartbeat();

      return true;
    } catch {
      return false;
    }
  }

  async registerInstallation(): Promise<InstallationRegisterResponse | null> {
    if (!this.accessToken) {
      return null;
    }

    try {
      const payload: InstallationRegisterRequest = {
        deviceId: this.deviceId,
        deviceName: `${getPlatform().toUpperCase()} Device`,
        platform: getPlatform(),
        osVersion: getOsVersion(),
        appVersion: "0.2.0",
      };

      const response = await fetch(`${API_URL}/api/device/installations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) return this.registerInstallation();
        return null;
      }

      if (!response.ok) return null;

      const data: InstallationRegisterResponse = await response.json();

      // Save the device secret returned on first registration.
      // It is only included once — subsequent updates don't include it.
      if (data.data.deviceSecret) {
        this.saveDeviceSecret(data.data.deviceSecret);
      }

      return data;
    } catch {
      return null;
    }
  }

  async sendHeartbeat(): Promise<HeartbeatResponse | null> {
    const deviceSecret = this.getDeviceSecret();
    if (!deviceSecret) {
      // No secret stored yet — re-register to get one
      await this.registerInstallation();
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/device/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: this.deviceId,
          deviceSecret,
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.data as HeartbeatResponse;
    } catch {
      return null;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.logout(true);
        return false;
      }

      const data = await response.json();
      this.saveTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  async checkLicense(): Promise<LicenseCheckResponse | null> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(`${API_URL}/api/v1/app/license/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ device_id: this.deviceId }),
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) return this.checkLicense();
        return null;
      }

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(
      () => {
        this.sendHeartbeat();
        this.checkLicense();
      },
      5 * 60 * 1000
    );

    // Send initial heartbeat and license check
    this.sendHeartbeat();
    this.checkLicense();
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  logout(sessionExpired: boolean = false) {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.stopHeartbeat();

    if (sessionExpired && this.onSessionExpiredCallback) {
      this.onSessionExpiredCallback();
    }
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error: string | null }> {
    if (!this.accessToken) {
      return { success: false, error: "Not logged in" };
    }

    try {
      const response = await fetch(`${API_URL}/api/account/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) return this.changePassword(currentPassword, newPassword);
        return { success: false, error: "Session expired. Please log in again." };
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { success: false, error: data.error || "Failed to change password" };
      }

      return { success: true, error: null };
    } catch {
      return { success: false, error: "Connection failed. Please try again." };
    }
  }

  async redeemActivationCode(code: string): Promise<ActivationCodeResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/app/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activation_code: code.toUpperCase().replace(/[^A-Z0-9]/g, ""),
          device_id: this.deviceId,
          device_name: `${getPlatform().toUpperCase()} Device`,
          platform: getPlatform(),
          os_version: getOsVersion(),
          app_version: "0.2.0",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          success: false,
          error: data.detail || data.message || "Invalid activation code",
        };
      }

      const data = await response.json();

      if (data.access_token) {
        this.saveTokens(data.access_token, data.refresh_token);
        await this.registerInstallation();
        this.startHeartbeat();
      }

      return {
        success: true,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user_email: data.user_email,
        plan: data.plan,
      };
    } catch {
      return {
        success: false,
        error: "Connection failed. Please check your internet and try again.",
      };
    }
  }

  async generateLinkingCode(): Promise<{ code: string; expires_in: number } | null> {
    try {
      const response = await fetch(`${API_URL}/api/v1/app/device/link-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: this.deviceId,
          device_name: `${getPlatform().toUpperCase()} Device`,
          platform: getPlatform(),
        }),
      });

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async checkDeviceLinkStatus(): Promise<ActivationCodeResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/app/device/link-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: this.deviceId }),
      });

      if (!response.ok) return { success: false };

      const data = await response.json();

      if (data.linked && data.access_token) {
        this.saveTokens(data.access_token, data.refresh_token);
        await this.registerInstallation();
        this.startHeartbeat();

        return {
          success: true,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user_email: data.user_email,
          plan: data.plan,
        };
      }

      return { success: false };
    } catch {
      return { success: false };
    }
  }

  async initialize() {
    this.loadTokens();
    if (this.accessToken) {
      await this.registerInstallation();
      this.startHeartbeat();
    }
  }
}

export const apiService = new ApiService();
export default apiService;
