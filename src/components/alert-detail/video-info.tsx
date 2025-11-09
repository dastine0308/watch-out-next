"use client";

import React from "react";

interface VideoInfoProps {
  duration: string;
  resolution: string;
  fileSize: string;
}

export default function VideoInfo({
  duration,
  resolution,
  fileSize,
}: VideoInfoProps) {
  const infoItems = [
    { label: "Duration", value: duration },
    { label: "Resolution", value: resolution },
    { label: "File Size", value: fileSize },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-md bg-slate-50 p-4 sm:grid-cols-3 sm:gap-6 sm:p-6">
      {infoItems.map((item, index) => (
        <div key={index}>
          <p className="mb-1 text-xs text-slate-500 sm:text-sm">{item.label}</p>
          <p className="text-xs sm:text-base">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
