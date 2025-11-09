import { Suspense } from "react";
import { getDevicesList } from "@/lib/server-api";
import FallDetectDevices from "@/components/fall-detect-devices";
import DevicesLoading from "@/components/devices-loading";

async function DevicesList() {
  try {
    const devices = await getDevicesList();
    console.log("devices", devices);
    return <FallDetectDevices devices={devices} />;
  } catch (error) {
    console.error("Error loading devices:", error);
    return (
      <div>
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Failed to load devices"}
          </p>
          <p className="mt-2 text-xs text-red-500">Failed to load devices</p>
        </div>
        <FallDetectDevices devices={[]} />
      </div>
    );
  }
}

export default function DevicesSection() {
  return (
    <Suspense fallback={<DevicesLoading />}>
      <DevicesList />
    </Suspense>
  );
}
