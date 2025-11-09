"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import DashboardCards, { defaultStats } from "@/components/dashboard-cards";
import AlertsTable, { sampleAlerts } from "@/components/alerts-table";
import FallDetectDevices, {
  sampleDevices,
} from "@/components/fall-detect-devices";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AlertDetailSidebar from "@/components/alert-detail/alert-detail-sidebar";

export default function Home() {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onopen = () => {
      // Connection opened
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const handleAlertClick = (alertId: string) => {
    setSelectedAlertId(alertId);
    setIsSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-6 sm:py-8">
        <Hero
          title="Watch Out! Stick Man!"
          subtitle="Monitor all alerts in one place"
        />

        {/* Overview Section */}
        <section className="pt-4 sm:pt-6">
          <DashboardCards stats={defaultStats} />
        </section>

        {/* Alerts and Devices Tabs Section */}
        <section className="pt-4 sm:pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="alerts" className="w-full">
              <TabsList className="mb-6 grid w-full max-w-sm grid-cols-2">
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>
              <TabsContent value="alerts" className="mt-0">
                <AlertsTable
                  alerts={sampleAlerts}
                  onAlertClick={handleAlertClick}
                />
              </TabsContent>
              <TabsContent value="devices" className="mt-0">
                <FallDetectDevices devices={sampleDevices} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      {/* Alert Detail Sidebar */}
      <AlertDetailSidebar
        alertId={selectedAlertId}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </div>
  );
}
