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
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activePage: "dashboard" | "users" | "subscriptions" | "transactions" | "analytics" | "devices" | "settings";
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
  { icon: Activity, label: "Analytics", href: "/admin/analytics", key: "analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings", key: "settings" },
];

export function AdminSidebar({ activePage, user }: AdminSidebarProps) {
  const router = useRouter();
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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-card border-b border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-surface-card border-r border-white/5 p-6 flex flex-col z-50 transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-linear-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">ParentShield</span>
            <p className="text-xs text-red-400 font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === item.key
                  ? "bg-linear-to-r from-red-500 to-orange-500 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-400 to-orange-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.first_name || "Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
}
