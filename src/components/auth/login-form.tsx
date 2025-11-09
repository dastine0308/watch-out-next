"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { ZodError } from "zod";
import { LoginFormData, loginSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);

      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (data?.error) {
        setErrors({ general: data.error });
        return;
      }

      // save token to localStorage
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      const { token, ...userData } = data;

      const userId = userData?.user_id || "";
      const userInfoResponse = await fetch(`/api/user/get/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const userInfoData = await userInfoResponse.json();
      const { _id, phone, ...userInfo } = userInfoData;
      useUserStore
        .getState()
        .setUser({ ...userInfo, id: _id || "", phoneNumber: phone || "" });

      router.push("/");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: {
          email?: string;
          password?: string;
          general?: string;
        } = {};

        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3">
          <p className="text-xs text-red-400">{errors.general}</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-300">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="h-[34px] border-slate-600 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-slate-300"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className={`h-[34px] border-slate-600 bg-slate-900 pr-10 text-sm text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="h-9 w-full rounded-md bg-blue-600 text-sm font-normal text-white hover:bg-blue-700"
      >
        Login
      </Button>

      <div className="border-t border-slate-700 pt-4">
        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="inline text-blue-400 hover:text-blue-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
