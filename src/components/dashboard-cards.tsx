"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AlertTriangleIcon, BellIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, sampleAlerts } from "@/components/alerts-table";

type Stat = {
  id: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "default" | "warning";
};

export default function DashboardCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.id} className="border-slate-200 bg-white shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium",
                  s.variant === "warning" && "text-red-600",
                )}
              >
                {s.title}
              </CardTitle>
              <div className="text-2xl opacity-20">{s.icon}</div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div
                className={`text-3xl font-bold ${
                  s.variant === "warning" ? "text-red-600" : "text-slate-800"
                }`}
              >
                {s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Updated stats to match requirements: Total Alert, Unhandled, Resolved
export const defaultStats: Stat[] = [
  {
    id: "total",
    title: "Total Alerts",
    value: sampleAlerts.length,
    icon: <BellIcon className="h-4 w-4" />,
    variant: "default",
  },
  {
    id: "unhandled",
    title: "Unhandled",
    value: sampleAlerts.filter((a: Alert) => a.status === "unhandled").length,
    icon: <AlertTriangleIcon className="h-4 w-4" />,
    variant: "warning",
  },
  {
    id: "resolved",
    title: "Resolved",
    value: sampleAlerts.filter((a: Alert) => a.status === "resolved").length,
    icon: <CheckIcon className="h-4 w-4" />,
    variant: "default",
  },
];
