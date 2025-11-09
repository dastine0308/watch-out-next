"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardCards, { defaultStats } from "@/components/dashboard-cards";
import AlertsTable, { Alert } from "@/components/alerts-table";
import FallDetectDevices, {
  type FallDetectDevice,
} from "@/components/fall-detect-devices";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AlertDetailSidebar from "@/components/alert-detail/alert-detail-sidebar";
import { useSocket } from "@/lib/use-socket";

interface HomeClientProps {
  devices: FallDetectDevice[];
  alerts: Alert[];
}

export default function HomeClient({ devices, alerts: initialAlerts }: HomeClientProps) {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  // 當初始 alerts 改變時更新 state（例如從 server 端重新獲取）
  useEffect(() => {
    setAlerts(initialAlerts);
  }, [initialAlerts]);

  // 處理新的 alert
  const handleNewAlert = useCallback((newAlert: Alert) => {
    setAlerts((prevAlerts) => {
      // 檢查是否已存在相同的 alert（避免重複）
      const exists = prevAlerts.some((alert) => alert.id === newAlert.id);
      if (exists) {
        return prevAlerts;
      }
      // 將新 alert 添加到列表開頭
      return [newAlert, ...prevAlerts];
    });
  }, []);

  // 處理 alert 更新
  const handleAlertUpdate = useCallback((updatedAlert: Alert) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === updatedAlert.id ? updatedAlert : alert
      )
    );
  }, []);

  // 使用 socket.io 監聽 alerts
  useSocket({
    onNewAlert: handleNewAlert,
    onAlertUpdate: handleAlertUpdate,
  });

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
              <AlertsTable alerts={alerts} onAlertClick={handleAlertClick} />
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
