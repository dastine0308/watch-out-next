"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { useUserStore } from "@/store/user-store";

export default function Header() {
  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const userEmail = user?.email || "";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-bold">
              Watch Out
            </Link>
          </div>

          <div className="hidden items-center space-x-6 sm:flex">
            {/* <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Dashboard
              </Link>
            </nav> */}
            {userEmail && <UserAvatar />}
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <div className="hidden md:block">
              {userEmail && <UserAvatar />}
            </div>
            <button
              aria-label="Menu"
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-white px-4 py-3 dark:bg-gray-900 sm:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/" className="py-2 text-sm">
              Home
            </Link>
            <Link href="/settings" className="py-2 text-sm">
              Settings
            </Link>
            <Link href="/login" className="py-2 text-sm">
              Logout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
