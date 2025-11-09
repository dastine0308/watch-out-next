"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VideoPlayer from "@/components/alert-detail/video-player";
import VideoInfo from "@/components/alert-detail/video-info";
import RecordingDetails from "@/components/alert-detail/recording-details";

// Mock data - in production, this would come from an API
const mockAlertData = {
  id: "ALERT-2024-001847",
  title: "Fall Detected",
  description:
    "This recording captures the fall detected on November 8, 2024 at 14:32:15 UTC. The video shows the fall detected in the living room.",
  startTime: "2025-11-08 14:30:00 UTC",
  endTime: "2025-11-08 14:36:30 UTC",
  duration: "6 minutes 30 seconds",
  resolution: "1920 × 1080",
  fileSize: "245 MB",
  isEncrypted: true,
};

interface AlertDetailSidebarProps {
  alertId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AlertDetailSidebar({
  alertId,
  open,
  onOpenChange,
}: AlertDetailSidebarProps) {
  // In production, fetch alert data based on alertId
  const alert = mockAlertData;

  if (!alertId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-2xl lg:max-w-4xl"
      >
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="text-sm sm:text-base lg:text-lg">
              Recording Details
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Video Card */}
          <Card>
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">
                  {alert.title}
                </h3>
                <p className="text-sm text-slate-500">Alert ID: {alert.id}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Video Player */}
              <div className="aspect-video w-full">
                <VideoPlayer />
              </div>

              {/* Video Info */}
              <VideoInfo
                duration={alert.duration}
                resolution={alert.resolution}
                fileSize={alert.fileSize}
              />
            </CardContent>
          </Card>

          {/* Recording Details Card */}
          <Card>
            <CardContent className="pt-6">
              <RecordingDetails description={alert.description} />
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
