"use client";

import React from "react";

export default function VideoPlayer() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-slate-900 text-center">
      <div className="flex h-full flex-col items-center justify-center p-6">
        <iframe
          src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
          className="h-full w-full"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
