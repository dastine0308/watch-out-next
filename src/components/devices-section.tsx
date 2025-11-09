import { Suspense } from "react";
import { getDevicesList } from "@/lib/server-api";
import FallDetectDevices, {
  sampleDevices,
  type FallDetectDevice,
} from "@/components/fall-detect-devices";
import DevicesLoading from "@/components/devices-loading";

interface DevicesSectionProps {
  userId?: string;
}

async function DevicesList({ userId }: DevicesSectionProps) {
  try {
    const devices = await getDevicesList(userId);
    return <FallDetectDevices devices={devices.length > 0 ? devices : sampleDevices} />;
  } catch (error) {
    console.error("Error loading devices:", error);
    // Fallback to sample devices on error
    return (
      <div>
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Failed to load devices"}
          </p>
          <p className="mt-2 text-xs text-red-500">Showing sample devices</p>
        </div>
        <FallDetectDevices devices={sampleDevices} />
      </div>
    );
  }
}

export default function DevicesSection({ userId }: DevicesSectionProps) {
  return (
    <Suspense fallback={<DevicesLoading />}>
      <DevicesList userId={userId} />
    </Suspense>
  );
}

