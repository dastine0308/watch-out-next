"use client";

import { useState } from "react";
import DashboardCards, { defaultStats } from "@/components/dashboard-cards";
import AlertsTable, { sampleAlerts } from "@/components/alerts-table";
import FallDetectDevices, {
  type FallDetectDevice,
} from "@/components/fall-detect-devices";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AlertDetailSidebar from "@/components/alert-detail/alert-detail-sidebar";

interface HomeClientProps {
  devices: FallDetectDevice[];
}

export default function HomeClient({ devices }: HomeClientProps) {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAlertClick = (alertId: string) => {
    setSelectedAlertId(alertId);
    setIsSidebarOpen(true);
  };

  return (
    <>
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
              <FallDetectDevices devices={devices} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Alert Detail Sidebar */}
      <AlertDetailSidebar
        alertId={selectedAlertId}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </>
  );
}

