// API Service for communicating with ParentShield website backend

const API_URL = "http://localhost:8000";

interface InstallationRegisterRequest {
  download_token?: string;
  device_id: string;
  device_name?: string;
  platform: string;
  os_version?: string;
  app_version: string;
}

interface InstallationResponse {
  installation_id: string;
  device_id: string;
  status: string;
  message: string;
}

interface HeartbeatResponse {
  status: string;
  server_time: string;
}

// Generate a unique device ID based on machine characteristics
function getDeviceId(): string {
  // Use a combination of factors to create a unique ID
  const nav = navigator;
  const screen = window.screen;
  const data = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join("|");

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  // Convert to hex and pad
  const deviceId = `device_${Math.abs(hash).toString(16).padStart(12, "0")}`;

  // Store in localStorage for consistency
  const storedId = localStorage.getItem("device_id");
  if (storedId) {
    return storedId;
  }
  localStorage.setItem("device_id", deviceId);
  return deviceId;
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

  constructor() {
    this.deviceId = getDeviceId();
    this.loadTokens();
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

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error("Login failed:", await response.text());
        return false;
      }

      const data = await response.json();
      this.saveTokens(data.access_token, data.refresh_token);

      // Register installation after login
      await this.registerInstallation();

      // Start heartbeat
      this.startHeartbeat();

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  async registerInstallation(): Promise<InstallationResponse | null> {
    if (!this.accessToken) {
      console.log("No access token, skipping installation registration");
      return null;
    }

    try {
      const request: InstallationRegisterRequest = {
        device_id: this.deviceId,
        device_name: `${getPlatform().toUpperCase()} Device`,
        platform: getPlatform(),
        os_version: getOsVersion(),
        app_version: "0.1.0",
        download_token: localStorage.getItem("download_token") || undefined,
      };

      const response = await fetch(`${API_URL}/device/installation/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(request),
      });

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.registerInstallation();
        }
        return null;
      }

      if (!response.ok) {
        console.error("Installation registration failed:", await response.text());
        return null;
      }

      const data = await response.json();
      console.log("Installation registered:", data);
      return data;
    } catch (error) {
      console.error("Installation registration error:", error);
      return null;
    }
  }

  async sendHeartbeat(): Promise<HeartbeatResponse | null> {
    if (!this.accessToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/device/installation/heartbeat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          device_id: this.deviceId,
          app_version: "0.1.0",
        }),
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.sendHeartbeat();
        }
        return null;
      }

      if (!response.ok) {
        console.error("Heartbeat failed:", await response.text());
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Heartbeat error:", error);
      return null;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const data = await response.json();
      this.saveTokens(data.access_token, data.refresh_token);
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  }

  startHeartbeat() {
    // Send heartbeat every 5 minutes
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(
      () => {
        this.sendHeartbeat();
      },
      5 * 60 * 1000
    );

    // Send initial heartbeat
    this.sendHeartbeat();
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.stopHeartbeat();
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  // Initialize on app start - check if logged in and register
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
