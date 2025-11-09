"use client";

import React, { useEffect, useState } from "react";
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

interface AlertDetailData {
  id?: string;
  alert_id?: string;
  alert_name?: string;
  title?: string;
  description?: string;
  video_url?: string;
  videoUrl?: string;
  s3_url?: string;
  duration?: string;
  resolution?: string;
  file_size?: number | string;
  fileSize?: string;
  start_time?: string;
  startTime?: string;
  end_time?: string;
  endTime?: string;
  time?: string;
  created_at?: string;
  location?: string;
  status?: string;
  device_id?: string;
  [key: string]: unknown;
}

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
  const [alertData, setAlertData] = useState<AlertDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alertId || !open) {
      setAlertData(null);
      return;
    }

    const fetchAlertDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/alert/${alertId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch alert detail");
        }
        const data = await response.json();
        console.log("alert detail data", JSON.stringify(data, null, 2));
        setAlertData(data);
      } catch (err) {
        console.error("Error fetching alert detail:", err);
        setError(err instanceof Error ? err.message : "Failed to load alert");
      } finally {
        setLoading(false);
      }
    };

    fetchAlertDetail();
  }, [alertId, open]);

  if (!alertId) return null;

  // 格式化檔案大小
  const formatFileSize = (bytes: number | string | undefined): string => {
    if (!bytes) return "N/A";
    const numBytes = typeof bytes === "string" ? parseInt(bytes) : bytes;
    if (isNaN(numBytes)) return "N/A";
    if (numBytes < 1024) return `${numBytes} B`;
    if (numBytes < 1024 * 1024) return `${(numBytes / 1024).toFixed(2)} KB`;
    return `${(numBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // 從 API 資料中提取值，支援多種可能的欄位名稱
  const alertTitle =
    alertData?.title || alertData?.alert_name || "Alert Details";
  const alertIdDisplay = alertData?.id || alertData?.alert_id || alertId;
  // 優先使用 s3_url，這是 API 返回的主要影片 URL
  const videoUrl =
    alertData?.s3_url || alertData?.video_url || alertData?.videoUrl;
  const duration = alertData?.duration || "N/A";
  const resolution = alertData?.resolution || "N/A";
  const fileSize = formatFileSize(alertData?.file_size || alertData?.fileSize);
  const timeDisplay =
    alertData?.time ||
    alertData?.created_at ||
    alertData?.start_time ||
    "unknown time";
  const locationDisplay = alertData?.location || "";
  const description =
    alertData?.description ||
    `Alert detected at ${timeDisplay}${locationDisplay ? ` in ${locationDisplay}` : ""}`;

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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
                <p className="text-sm text-slate-500">
                  Loading alert details...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Video Card */}
              <Card>
                <CardHeader className="border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800">
                      {alertTitle}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Alert ID: {alertIdDisplay}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Video Player */}
                  <div className="aspect-video w-full">
                    <VideoPlayer videoUrl={videoUrl} />
                  </div>

                  {/* Video Info */}
                  <VideoInfo
                    duration={duration}
                    resolution={resolution}
                    fileSize={fileSize}
                  />
                </CardContent>
              </Card>

              {/* Recording Details Card */}
              <Card>
                <CardContent className="pt-6">
                  <RecordingDetails description={description} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
