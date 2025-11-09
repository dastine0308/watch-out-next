"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

export type Alert = {
  id: string;
  title: string;
  status: "unhandled" | "resolved";
  description: string;
  timeAgo: string;
  location: string;
};

type AlertsTableProps = {
  alerts: Alert[];
  onAlertClick?: (alertId: string) => void;
};

type FilterStatus = "all" | "unhandled" | "resolved";

export default function AlertsTable({
  alerts,
  onAlertClick,
}: AlertsTableProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "unhandled":
        return "bg-red-100 border-red-300 text-red-500";
      default:
        return "bg-gray-100 border-gray-300 text-gray-500";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesStatus =
      filterStatus === "all" || alert.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-6 py-4 md:flex-row">
          <div>
            <h3 className="mb-1 text-base font-bold text-slate-800">
              All Alerts
            </h3>
            <p className="text-sm text-slate-500">View and manage all alerts</p>
          </div>
          {/* Search and Tabs */}
          <div>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full flex-1 sm:max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  <SearchIcon className="h-4 w-4" />
                </span>
                <Input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={
                    filterStatus === "unhandled" ? "secondary" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus("unhandled")}
                >
                  Unhandled
                </Button>
                <Button
                  variant={
                    filterStatus === "resolved" ? "secondary" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus("resolved")}
                >
                  Resolved
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4 p-6">
          {filteredAlerts.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No alerts found
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onAlertClick?.(alert.id)}
                className="cursor-pointer rounded-md border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-slate-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h4 className="text-base font-bold text-slate-800">
                        {alert.title}
                      </h4>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyles(
                          alert.status,
                        )}`}
                      >
                        {alert.status}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-slate-500">
                      {alert.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>{alert.timeAgo}</span>
                      <span>{alert.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export const sampleAlerts: Alert[] = [
  {
    id: "1",
    title: "Fall Detected",
    status: "unhandled",
    description: "Fall detected in the living room",
    timeAgo: "2 minutes ago",
    location: "Living Room",
  },
  {
    id: "2",
    title: "Fall Detected",
    status: "resolved",
    description: "Fall detected in the bathroom",
    timeAgo: "2 minutes ago",
    location: "Bathroom",
  },
];
