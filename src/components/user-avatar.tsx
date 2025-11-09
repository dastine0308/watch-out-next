"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { useUserStore } from "@/store/user-store";

export function UserAvatar() {
  const user = useUserStore((state) => state.user);
  const email = user?.email || "";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get first letter of email (uppercase)
  const getInitial = (email: string): string => {
    if (!email) return "?";
    const firstChar = email.charAt(0).toUpperCase();
    return /[A-Z]/.test(firstChar) ? firstChar : "?";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const clearUser = useUserStore.getState().clearUser;

    // clear token cookie through API
    try {
      await fetch("/api/user/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // clear token from localStorage
    localStorage.removeItem("token");
    // clear user data from zustand store
    clearUser();
    router.push("/login");
    setIsOpen(false);
  };

  const handleSettings = () => {
    router.push("/settings");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {getInitial(email)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium">{email}</div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700" />
            <div className="py-1">
              <button
                onClick={handleSettings}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
