"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { phoneNumberSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { useUserStore } from "@/store/user-store";

export default function SettingsPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Load user data from zustand store
  useEffect(() => {
    const userEmail = user?.email || "";
    const userPhoneNumber = user?.phoneNumber || "";
    setEmail(userEmail);
    setPhoneNumber(userPhoneNumber);
  }, [user]);

  // Validate phone number on change (only show error after touched)
  const validatePhoneNumber = (value: string) => {
    if (!touched) return;

    try {
      phoneNumberSchema.parse(value);
      setError(null);
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0]?.message || "Invalid phone number");
      }
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setSuccess(false);
    validatePhoneNumber(value);
  };

  const handlePhoneNumberBlur = () => {
    setTouched(true);
    validatePhoneNumber(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setTouched(true);
    setIsLoading(true);

    try {
      phoneNumberSchema.parse(phoneNumber);

      const response = await fetch(`/api/user/update/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (response.status !== 200) {
        const data = await response.json();
        setError(
          data.error || "Failed to update phone number. Please try again.",
        );
        return;
      }
      useUserStore.getState().setUser({ ...user, phoneNumber });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: { phoneNumber?: string } = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (path === undefined || path === "") {
            // Root level error
            fieldErrors.phoneNumber = issue.message;
          } else if (path === "phoneNumber") {
            fieldErrors.phoneNumber = issue.message;
          }
        });
        setError(fieldErrors.phoneNumber || "Invalid phone number");
      } else {
        setError("Failed to update phone number. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-6 sm:py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your phone number and account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    onBlur={handlePhoneNumberBlur}
                    className={
                      error ? "border-red-500 focus-visible:ring-red-500" : ""
                    }
                  />
                  {error && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                  {success && !error && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Phone number updated successfully!
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter your phone number in international format
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} variant="default">
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
