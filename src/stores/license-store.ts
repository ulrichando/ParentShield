import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface Features {
  websiteBlocking: boolean;
  gameBlocking: boolean;
  maxBlocks: number;
  webDashboard: boolean;
  activityReports: boolean;
  schedules: boolean;
  tamperProtection: string | null;
}

interface LicenseStoreState {
  plan: string;
  status: string;
  isLocked: boolean;
  features: Features;
  expiresAt: string | null;
  upgradeUrl: string | null;
  message: string | null;
  isLoading: boolean;
  error: string | null;
  daysRemaining: number | null;
}

interface LicenseStore extends LicenseStoreState {
  checkLicense: () => Promise<void>;
  getLicenseState: () => Promise<void>;
  platformLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  platformLogout: () => Promise<void>;
  isFeatureAvailable: (feature: keyof Features) => boolean;
  initLicenseListener: () => Promise<() => void>;
}

const defaultFeatures: Features = {
  websiteBlocking: false,
  gameBlocking: false,
  maxBlocks: 0,
  webDashboard: false,
  activityReports: false,
  schedules: false,
  tamperProtection: null,
};

function mapRustState(raw: Record<string, unknown>): Partial<LicenseStoreState> {
  const expiresAt = (raw.expires_at as string) || null;
  const daysRemaining = expiresAt
    ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const rawFeatures = (raw.features as Record<string, unknown>) || {};

  return {
    plan: (raw.plan as string) || "none",
    status: (raw.status as string) || "none",
    isLocked: (raw.is_locked as boolean) ?? true,
    features: {
      websiteBlocking: (rawFeatures.website_blocking as boolean) ?? (rawFeatures.websiteBlocking as boolean) ?? false,
      gameBlocking: (rawFeatures.game_blocking as boolean) ?? (rawFeatures.gameBlocking as boolean) ?? false,
      maxBlocks: (rawFeatures.max_blocks as number) ?? (rawFeatures.maxBlocks as number) ?? 0,
      webDashboard: (rawFeatures.web_dashboard as boolean) ?? (rawFeatures.webDashboard as boolean) ?? false,
      activityReports: (rawFeatures.activity_reports as boolean) ?? (rawFeatures.activityReports as boolean) ?? false,
      schedules: (rawFeatures.schedules as boolean) ?? false,
      tamperProtection: (rawFeatures.tamper_protection as string) ?? (rawFeatures.tamperProtection as string) ?? null,
    },
    expiresAt,
    upgradeUrl: (raw.upgrade_url as string) ?? (raw.upgradeUrl as string) ?? null,
    message: (raw.message as string) || null,
    daysRemaining,
  };
}

export const useLicenseStore = create<LicenseStore>((set, get) => ({
  plan: "none",
  status: "none",
  isLocked: true,
  features: { ...defaultFeatures },
  expiresAt: null,
  upgradeUrl: null,
  message: null,
  isLoading: false,
  error: null,
  daysRemaining: null,

  checkLicense: async () => {
    try {
      set({ isLoading: true, error: null });
      const state = await invoke<Record<string, unknown>>("check_license");
      set({ ...mapRustState(state), isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  getLicenseState: async () => {
    try {
      const state = await invoke<Record<string, unknown>>("get_license_state");
      set(mapRustState(state));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  platformLogin: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const result = await invoke<{ success: boolean; plan?: string; message?: string }>(
        "platform_login",
        { email, password }
      );
      if (result.success) {
        await get().checkLicense();
      }
      set({ isLoading: false });
      return { success: result.success, message: result.message };
    } catch (error) {
      set({ error: String(error), isLoading: false });
      return { success: false, message: String(error) };
    }
  },

  platformLogout: async () => {
    try {
      await invoke("platform_logout");
      set({
        plan: "none",
        status: "none",
        isLocked: true,
        features: { ...defaultFeatures },
        expiresAt: null,
        upgradeUrl: null,
        message: null,
        daysRemaining: null,
      });
    } catch (error) {
      set({ error: String(error) });
    }
  },

  isFeatureAvailable: (feature) => {
    const { features, isLocked } = get();
    if (isLocked) return false;
    return !!features[feature];
  },

  initLicenseListener: async () => {
    const unlisten = await listen<Record<string, unknown>>("license-state-changed", (event) => {
      set(mapRustState(event.payload));
    });
    return unlisten;
  },
}));
