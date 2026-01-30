"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  User,
  DollarSign,
  Activity,
  Monitor,
  Menu,
  X,
  Briefcase,
  FileText,
  Key,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface AdminSidebarProps {
  activePage: "dashboard" | "users" | "subscriptions" | "transactions" | "analytics" | "devices" | "settings" | "careers" | "blog" | "api-keys";
  user: {
    email: string;
    first_name?: string;
  };
}

const navItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin", key: "dashboard" },
  { icon: Users, label: "Users", href: "/admin/users", key: "users" },
  { icon: Monitor, label: "Devices", href: "/admin/devices", key: "devices" },
  { icon: CreditCard, label: "Subscriptions", href: "/admin/subscriptions", key: "subscriptions" },
  { icon: DollarSign, label: "Transactions", href: "/admin/transactions", key: "transactions" },
  { icon: Key, label: "API Keys", href: "/admin/api-keys", key: "api-keys" },
  { icon: FileText, label: "Blog", href: "/admin/blog", key: "blog" },
  { icon: Briefcase, label: "Careers", href: "/admin/careers", key: "careers" },
  { icon: Activity, label: "Analytics", href: "/admin/analytics", key: "analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings", key: "settings" },
];

export function AdminSidebar({ activePage, user }: AdminSidebarProps) {
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    router.push("/login");
  };

  const handleNavClick = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-neutral-900 dark:text-white">ParentShield</span>
            <span className="text-xs text-red-600 dark:text-red-400 ml-2">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-56 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-5 flex flex-col z-50 transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-red-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-medium text-neutral-900 dark:text-white">ParentShield</span>
            <p className="text-xs text-red-600 dark:text-red-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
                activePage === item.key
                  ? "bg-red-600 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all mb-4"
        >
          {mounted ? (
            theme === "dark" ? (
              <>
                <Sun className="w-4 h-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                Dark Mode
              </>
            )
          ) : (
            <>
              <div className="w-4 h-4" />
              Theme
            </>
          )}
        </button>

        {/* User */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <User className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user?.first_name || "Admin"}</p>
              <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-14" />
    </>
  );
}
