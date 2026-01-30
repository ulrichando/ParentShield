"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  BarChart3,
  Download,
  Laptop,
  Clock,
  Ban,
  Globe,
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  CreditCard,
  Code,
  Sun,
  Moon,
} from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useTheme } from "@/components/theme-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Download, label: "Download App", href: "/dashboard/download" },
  { icon: Laptop, label: "My Devices", href: "/dashboard/devices" },
  { icon: Clock, label: "Screen Time", href: "/dashboard/screen-time" },
  { icon: Ban, label: "Blocked Apps", href: "/dashboard/blocked-apps" },
  { icon: Globe, label: "Web Filters", href: "/dashboard/web-filters" },
  { icon: Bell, label: "Alerts", href: "/dashboard/alerts" },
  { icon: CreditCard, label: "Subscription", href: "/dashboard/billing" },
  { icon: Code, label: "API", href: "/dashboard/api" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useCustomerAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white dark:text-neutral-900" />
          </div>
          <span className="text-lg font-medium text-neutral-900 dark:text-white">ParentShield</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              )
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-56 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-5 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white dark:text-neutral-900" />
          </div>
          <span className="text-lg font-medium text-neutral-900 dark:text-white">ParentShield</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle (Desktop) */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all mb-4"
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
            <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
              <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {user?.first_name || "User"}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-56 pt-16 lg:pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
