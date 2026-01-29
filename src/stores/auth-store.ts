import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";

// Helper to extract error message from Tauri errors
// Tauri can return errors in different formats depending on the error type
function extractErrorMessage(error: unknown): string {
  // If it's already a string, return it directly
  if (typeof error === "string") {
    return error;
  }

  // If it's an Error instance
  if (error instanceof Error) {
    return error.message;
  }

  // If it's an object, try to extract the message
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // Common error message properties
    if (typeof err.message === "string") return err.message;
    if (typeof err.error === "string") return err.error;
    if (typeof err.msg === "string") return err.msg;
    if (typeof err.description === "string") return err.description;

    // If error has a nested error object
    if (typeof err.error === "object" && err.error !== null) {
      const nested = err.error as Record<string, unknown>;
      if (typeof nested.message === "string") return nested.message;
    }

    // Last resort: stringify but make it readable
    try {
      const str = JSON.stringify(error);
      // If it's just an empty object or similar, provide a generic message
      if (str === "{}" || str === "null") {
        return "An unknown error occurred";
      }
      return str;
    } catch {
      return "An unknown error occurred";
    }
  }

  return String(error);
}

interface AuthStatus {
  isConfigured: boolean;
  isAuthenticated: boolean;
}

interface SetupResult {
  success: boolean;
  master_password: string | null;
  error: string | null;
}

interface ChangePasswordResult {
  success: boolean;
  error: string | null;
}

interface AuthStore {
  isConfigured: boolean;
  isAuthenticated: boolean;
  masterPassword: string | null;
  isLoading: boolean;
  error: string | null;

  checkAuthStatus: () => Promise<void>;
  setupPassword: (password: string) => Promise<SetupResult>;
  completeSetup: () => void;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<ChangePasswordResult>;
  resetWithMaster: (masterPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isConfigured: false,
  isAuthenticated: false,
  masterPassword: null,
  isLoading: true,
  error: null,

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const status = await invoke<AuthStatus>("get_auth_status");
      set({
        isConfigured: status.isConfigured,
        isLoading: false,
      });
    } catch (error) {
      set({ error: extractErrorMessage(error), isLoading: false });
    }
  },

  setupPassword: async (password: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await invoke<SetupResult>("setup_password", { password });
      if (result.success) {
        set({
          masterPassword: result.master_password,
          isConfigured: true,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ error: result.error, isLoading: false });
      }
      return result;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      return { success: false, master_password: null, error: errorMessage };
    }
  },

  completeSetup: () => {
    set({ isConfigured: true, isAuthenticated: true, masterPassword: null });
  },

  login: async (password: string) => {
    try {
      set({ isLoading: true, error: null });
      const isValid = await invoke<boolean>("verify_password", { password });
      if (isValid) {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ error: "Invalid password", isLoading: false });
      }
      return isValid;
    } catch (error) {
      set({ error: extractErrorMessage(error), isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({ isAuthenticated: false });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      set({ isLoading: true, error: null });
      const success = await invoke<boolean>("change_password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      set({ isLoading: false });
      if (success) {
        return { success: true, error: null };
      } else {
        return { success: false, error: "Current password is incorrect" };
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  resetWithMaster: async (masterPassword: string, newPassword: string) => {
    try {
      set({ isLoading: true, error: null });
      const success = await invoke<boolean>("reset_with_master", {
        master_password: masterPassword,
        new_password: newPassword,
      });
      if (success) {
        set({ isAuthenticated: true, isLoading: false });
      }
      return success;
    } catch (error) {
      set({ error: extractErrorMessage(error), isLoading: false });
      return false;
    }
  },
}));
