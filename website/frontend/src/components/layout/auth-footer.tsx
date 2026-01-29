"use client";

import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="py-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ParentShield. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/support"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
