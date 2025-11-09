import { Suspense } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import { getDevicesList } from "@/lib/server-api";
import HomeClient from "@/components/home-client";
import { sampleDevices } from "@/components/fall-detect-devices";
import { useUserStore } from "@/store/user-store";

async function DevicesContent() {
  const userId = useUserStore.getState().user?.id || "";
  try {
    // Fetch devices (with or without user_id)
    const devices = await getDevicesList(userId);
    return (
      <HomeClient devices={devices.length > 0 ? devices : sampleDevices} />
    );
  } catch (error) {
    console.error("Error loading data:", error);
    // Fallback to sample devices on error
    return <HomeClient devices={sampleDevices} />;
  }
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-6 sm:py-8">
        <Hero
          title="Watch Out! Stick Man!"
          subtitle="Monitor all alerts in one place"
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
