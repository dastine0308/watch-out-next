import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Device {
  device_id?: string;
  uid?: string;
  device_name?: string;
  location?: string;
  [key: string]: unknown; // allow other possible device data
}

interface DeviceState {
  devices: Device[];
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (deviceId: string, device: Partial<Device>) => void;
  removeDevice: (deviceId: string) => void;
  clearDevices: () => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      devices: [],
      setDevices: (devices: Device[]) => set({ devices }),
      addDevice: (device: Device) =>
        set((state) => ({ devices: [...state.devices, device] })),
      updateDevice: (deviceId: string, device: Partial<Device>) =>
        set((state) => ({
          devices: state.devices.map((d) =>
            d.device_id === deviceId ||
            d.uid === deviceId ||
            (d as { _id?: string })._id === deviceId
              ? { ...d, ...device }
              : d,
          ),
        })),
      removeDevice: (deviceId: string) =>
        set((state) => ({
          devices: state.devices.filter(
            (d) =>
              d.device_id !== deviceId &&
              d.uid !== deviceId &&
              (d as { _id?: string })._id !== deviceId,
          ),
        })),
      clearDevices: () => set({ devices: [] }),
    }),
    {
      name: "device-storage", // localStorage key
    },
  ),
);
