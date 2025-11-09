import { Suspense } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import { getAlertsList, getDevicesList } from "@/lib/server-api";
import HomeClient from "@/components/home-client";
import { FallDetectDevice } from "@/components/fall-detect-devices";
import { Alert } from "@/components/alerts-table";

async function DevicesContent() {
  try {
    const alerts = await getAlertsList();
    const formattedAlerts = Array.isArray(alerts) ? (alerts as Alert[]) : [];

    // 計算 alert 統計數據
    const totalAlerts = formattedAlerts.length;
    const unhandledAlerts = formattedAlerts.filter(
      (alert) => alert.status === "unhandled",
    ).length;
    const resolvedAlerts = formattedAlerts.filter(
      (alert) => alert.status === "resolved",
    ).length;

    const devices = await getDevicesList();
    const formattedDevices = Array.isArray(devices)
      ? (devices as FallDetectDevice[])
      : [];
    return (
      <HomeClient
        devices={formattedDevices}
        alerts={formattedAlerts}
        stats={{
          total: totalAlerts,
          unhandled: unhandledAlerts,
          resolved: resolvedAlerts,
        }}
      />
    );
  } catch {
    return (
      <HomeClient
        devices={[]}
        alerts={[]}
        stats={{ total: 0, unhandled: 0, resolved: 0 }}
      />
    );
  }
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-6 sm:py-8">
        <Hero
          title="WatchOut"
          subtitle="All Fall Detection. Instant Alerts. Total Peace of Mind."
        />

        <Suspense
          fallback={
            <>
              {/* Overview Section */}
              <section className="pt-4 sm:pt-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
                      <p className="text-sm text-slate-500">Loading...</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          }
        >
          <DevicesContent />
        </Suspense>
      </main>
    </div>
  );
}
