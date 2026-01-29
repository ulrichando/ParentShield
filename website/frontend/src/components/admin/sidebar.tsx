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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface-card border-b border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-linear-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
      <aside className={`fixed left-0 top-0 h-full w-52 bg-surface-card border-r border-white/5 p-4 flex flex-col z-50 transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-linear-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white">ParentShield</span>
            <p className="text-[10px] text-red-400 font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.href)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                activePage === item.key
                  ? "bg-linear-to-r from-red-500 to-orange-500 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-400 to-orange-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{user?.first_name || "Admin"}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={handleLogout}>
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-14" />
    </>
  );
}
