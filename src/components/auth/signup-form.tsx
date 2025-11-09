"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, phoneNumberSchema } from "@/lib/validation";
import { ZodError } from "zod";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    phoneNumber?: string;
    password?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = signupSchema.parse({
        email,
        phoneNumber,
        password,
      });

      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: validatedData.email,
          phone: validatedData.phoneNumber,
          password: validatedData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message ||
          data.error ||
          "Registration failed, please try again later";
        setErrors({ general: errorMessage });
        return;
      }

      router.push("/login");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: {
          email?: string;
          phoneNumber?: string;
          password?: string;
        } = {};

        error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (
            path === "email" ||
            path === "phoneNumber" ||
            path === "password"
          ) {
            fieldErrors[path] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        setErrors({
          general:
            "Network error, please check your network connection and try again",
        });
      } else {
        setErrors({
          general: "An unexpected error occurred, please try again later",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (value) {
      const result = phoneNumberSchema.safeParse(value);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: result.error.issues[0]?.message,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.phoneNumber;
          return newErrors;
        });
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className={`h-[34px] border-slate-600 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-slate-300">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          required
          disabled={isLoading}
          className={`h-[34px] border-slate-600 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.phoneNumber ? "border-red-500" : ""
          }`}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-red-400">{errors.phoneNumber}</p>
        )}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className={`h-[34px] border-slate-600 bg-slate-900 pr-10 text-sm text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
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
        disabled={isLoading}
        className="h-9 w-full rounded-md bg-blue-600 text-sm font-normal text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>

      <div className="border-t border-slate-700 pt-4">
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="inline text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
