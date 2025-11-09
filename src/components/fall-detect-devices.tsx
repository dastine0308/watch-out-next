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

export type FallDetectDevice = {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  lastActivity: string;
  alertsCount: number;
};

type FallDetectDevicesProps = {
  devices: FallDetectDevice[];
};

export default function FallDetectDevices({ devices }: FallDetectDevicesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceLocation, setDeviceLocation] = useState("");
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

  const handleAddDevice = () => {
    // TODO: Implement add device logic
    console.log("Adding device:", {
      name: deviceName,
      location: deviceLocation,
    });
    // Reset form
    setDeviceName("");
    setDeviceLocation("");
    setIsDialogOpen(false);
  };

  const handleEditDevice = (device: FallDetectDevice) => {
    setEditingDevice(device);
    setDeviceName(device.name);
    setDeviceLocation(device.location);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDevice = () => {
    if (!editingDevice) return;

    // TODO: Implement update device logic
    console.log("Updating device:", {
      id: editingDevice.id,
      name: deviceName,
      location: deviceLocation,
    });

    // Update local state
    setDevicesList((prev) =>
      prev.map((device) =>
        device.id === editingDevice.id
          ? { ...device, name: deviceName, location: deviceLocation }
          : device,
      ),
    );

    // Reset form
    setDeviceName("");
    setDeviceLocation("");
    setEditingDevice(null);
    setIsEditDialogOpen(false);
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
                  key={device.id}
                  className="border-slate-200 transition-shadow hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-1 text-sm font-bold text-slate-800">
                          {device.name}
                        </CardTitle>
                        <p className="text-xs text-slate-500">
                          {device.location}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-bold ${getStatusStyles(
                          device.status,
                        )}`}
                      >
                        {device.status.toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Last Activity</span>
                      <span className="text-slate-700">
                        {device.lastActivity}
                      </span>
                    </div>
                    {device.alertsCount > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Active Alerts</span>
                        <span className="rounded-full bg-red-100 px-2 py-1 font-bold text-red-700">
                          {device.alertsCount}
                        </span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleEditDevice(device)}
                      >
                        <Pencil className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
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

export const sampleDevices: FallDetectDevice[] = [
  {
    id: "1",
    name: "Device A001",
    location: "Living Room",
    status: "online",
    lastActivity: "2 minutes ago",
    alertsCount: 0,
  },
];
