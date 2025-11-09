"use client";

import React from "react";

interface RecordingDetailsProps {
  description: string;
}

export default function RecordingDetails({
  description,
}: RecordingDetailsProps) {
  return (
    <div className="space-y-2">
      <p className="text-base font-bold text-slate-800">Recording Details</p>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
