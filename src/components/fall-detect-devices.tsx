"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useDeviceStore } from "@/store/device-store";

export type FallDetectDevice = {
  _id: string;
  uid: string;
  status: string;
  registered_at: string;
  location: string;
  last_seen: string;
  device_name: string;
};

type FallDetectDevicesProps = {
  devices: FallDetectDevice[];
};

export default function FallDetectDevices({ devices }: FallDetectDevicesProps) {
  const user = useUserStore((state) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceLocation, setDeviceLocation] = useState("");
  const [deviceSerialNumber, setDeviceSerialNumber] = useState("");
  const [editingDevice, setEditingDevice] = useState<FallDetectDevice | null>(
    null,
  );
  const [devicesList, setDevicesList] = useState<FallDetectDevice[]>(devices);

  // Sync devices prop with internal state
  useEffect(() => {
    setDevicesList(devices);
  }, [devices]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-700 border-green-200";
      case "offline":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleAddDevice = async () => {
    try {
      const response = await fetch("/api/device/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          uid: deviceSerialNumber,
          device_name: deviceName,
          location: deviceLocation,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsDialogOpen(false);
        setDeviceName("");
        setDeviceLocation("");
        setDeviceSerialNumber("");
        // Update store
        useDeviceStore.getState().addDevice(data.device);
        // Update local state
        setDevicesList((prev) => [...prev, data.device]);
      }
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleEditDevice = (device: FallDetectDevice) => {
    setEditingDevice(device);
    setDeviceName(device.device_name);
    setDeviceLocation(device.location);
    setDeviceSerialNumber(device.uid);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDevice = async () => {
    if (!editingDevice) return;

    try {
      const response = await fetch(`/api/device/update/${editingDevice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          device_name: deviceName,
          location: deviceLocation,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Update store
        useDeviceStore.getState().updateDevice(editingDevice._id, {
          device_name: deviceName,
          location: deviceLocation,
        });

        // Update local state
        setDevicesList((prev) =>
          prev.map((device) =>
            device._id === editingDevice._id
              ? { ...device, device_name: deviceName, location: deviceLocation }
              : device,
          ),
        );

        // Reset form
        setDeviceName("");
        setDeviceLocation("");
        setDeviceSerialNumber("");
        setEditingDevice(null);
        setIsEditDialogOpen(false);
      } else {
        console.error("Error updating device:", data.error);
      }
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-base font-bold text-slate-800">
                My Devices
              </h3>
              <p className="text-sm text-slate-500">
                Monitor and manage all fall detection devices
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Device
            </Button>
          </div>
        </div>

        {/* Devices List */}
        <div className="p-6">
          {devicesList.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No devices found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {devicesList.map((device) => (
                <Card
                  key={device._id}
                  className="border-slate-200 transition-shadow hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="mb-1 text-sm font-bold text-slate-800">
                          {device.device_name}
                        </CardTitle>
                        <p className="text-xs text-slate-500">
                          {device.location || "Unknown"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-bold ${getStatusStyles(
                          device.status || "unknown",
                        )}`}
                      >
                        {(device.status || "unknown").toUpperCase()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleEditDevice(device)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Last Activity</span>
                      <span className="text-slate-700">
                        {device.last_seen
                          ? new Date(device.last_seen).toLocaleString()
                          : "Unknown"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Device Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Add a new fall detection device to your monitoring system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="device-serial-number">
                Device Serial Number (UID)
              </Label>
              <Input
                id="device-serial-number"
                placeholder="e.g., SN123456789"
                value={deviceSerialNumber}
                onChange={(e) => setDeviceSerialNumber(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input
                id="device-name"
                placeholder="e.g., Device A002"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-location">Location</Label>
              <Input
                id="device-location"
                placeholder="e.g., Bedroom"
                value={deviceLocation}
                onChange={(e) => setDeviceLocation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDevice}>Add Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Update the device name and location information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-device-serial-number">
                Device Serial Number (UID)
              </Label>
              <Input
                id="edit-device-serial-number"
                value={deviceSerialNumber}
                disabled
                className="cursor-not-allowed bg-slate-100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-device-name">Device Name</Label>
              <Input
                id="edit-device-name"
                placeholder="e.g., Device A002"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-device-location">Location</Label>
              <Input
                id="edit-device-location"
                placeholder="e.g., Bedroom"
                value={deviceLocation}
                onChange={(e) => setDeviceLocation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingDevice(null);
                setDeviceName("");
                setDeviceLocation("");
                setDeviceSerialNumber("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateDevice}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
