"use client";

import React from "react";

interface VideoPlayerProps {
  videoUrl?: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-md bg-slate-900 text-center">
        <div className="flex h-full flex-col items-center justify-center p-6">
          <p className="text-slate-400">No video available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-slate-900">
      <iframe
        src={videoUrl}
        className="h-full w-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Alert Video"
      />
    </div>
  );
}
